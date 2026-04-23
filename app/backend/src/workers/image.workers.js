import { Worker } from "bullmq";
import fetch from "node-fetch";
import { connection } from "../queues/connection.js";
import { Movie } from "../models/movie.models.js";
import { uploadPathToSupabase } from "../services/storage.service.js";
import connectDB from "../db/index.js";
import dotenv from "dotenv"
import fs from "fs";
import path from "path";

dotenv.config()
await connectDB()


const cleanupFiles = (files = []) => {
    files.forEach((file) => {
        try {
            if (!file) return;

            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
                console.log("Deleted:", file);
            } else {
                console.warn("File not found:", file);
            }
        } catch (err) {
            console.error("Cleanup error:", err.message);
        }
    });
};

const worker = new Worker(
    "image-processing",
    async (job) => {
        const { imageUrl, movieId } = job.data;

        const res = await fetch(process.env.PYTHON_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl, movieId }),
        });

        if (!res.ok) throw new Error("Python API failed");

        return await res.json();
    },
    {
        connection,
        concurrency: 5,
    }
);

worker.on("completed", async (job, result) => {
    console.log("✅ Completed:", job.id);

    const { movieId, imageUrl } = job.data;

    try {
        if (!result?.variants) throw new Error("Invalid Python response");

        const { small, medium, large } = result.variants;

        const smallUrl = await uploadPathToSupabase(small);
        const mediumUrl = await uploadPathToSupabase(medium);
        const largeUrl = await uploadPathToSupabase(large);

        await Movie.findByIdAndUpdate(movieId, {
            $set: {
                "poster.small": smallUrl,
                "poster.medium": mediumUrl,
                "poster.large": largeUrl,
                "processing.status": "processed",
                "processing.error": null,
            }
        });

        cleanupFiles([small, medium, large]);

    } catch (err) {
        console.error("❌ Upload/DB error:", err.message);

        await Movie.findByIdAndUpdate(movieId, {
            "processing.status": "failed",
            "processing.error": err.message,
        });
    }
});

// FAILURE
worker.on("failed", async (job, err) => {
    console.error("Job failed:", err.message);

    await Movie.findByIdAndUpdate(job.data.movieId, {
        "processing.status": "failed",
        "processing.error": err.message,
    });

    // OPTIONAL CLEANUP (if partial result exists)
    if (job.returnvalue?.variants) {
        cleanupFiles(Object.values(job.returnvalue.variants));
    }
});

// ERROR
worker.on("error", (err) => {
    console.error("Worker error:", err);
});