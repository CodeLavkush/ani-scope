import { Worker } from "bullmq";
import fetch from "node-fetch";
import { connection } from "../queues/connection.js";
import { Movie } from "../models/movie.models.js";
import connectDB from "../db/index.js";
import dotenv from "dotenv";

import { uploadBase64ToSupabase } from "../services/storage.service.js";

dotenv.config();
await connectDB();

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

// SUCCESS
worker.on("completed", async (job, result) => {
    console.log("✅ Completed:", job.id);

    const { movieId } = job.data;

    try {
        if (!result?.variants) throw new Error("Invalid Python response");

        const { small, medium, large } = result.variants;

        const smallUrl = await uploadBase64ToSupabase(small, `${movieId}-small`);
        const mediumUrl = await uploadBase64ToSupabase(medium, `${movieId}-medium`);
        const largeUrl = await uploadBase64ToSupabase(large, `${movieId}-large`);

        await Movie.findByIdAndUpdate(movieId, {
            $set: {
                "poster.small": smallUrl,
                "poster.medium": mediumUrl,
                "poster.large": largeUrl,
                "processing.status": "processed",
                "processing.error": null,
            }
        });

    } catch (err) {
        console.error("❌ Upload/DB error:", err.message);

        await Movie.findByIdAndUpdate(movieId, {
            "processing.status": "failed",
            "processing.error": err.message,
        });
    }
});

// FAILED
worker.on("failed", async (job, err) => {
    console.error("❌ Job failed:", err.message);

    if (job?.data?.movieId) {
        await Movie.findByIdAndUpdate(job.data.movieId, {
            "processing.status": "failed",
            "processing.error": err.message,
        });
    }
});

// ERROR
worker.on("error", (err) => {
    console.error("Worker error:", err);
});