import { Worker } from "bullmq";
import fetch from "node-fetch";
import { connection } from "../queues/connection.js";
import { Anime } from "../models/anime.models.js";
import connectDB from "../db/index.js";
import dotenv from "dotenv";

import { uploadBase64ToSupabase } from "../services/storage.service.js";

dotenv.config();
await connectDB();

const worker = new Worker(
    "image-processing",
    async (job) => {
        const { imageUrl, animeId } = job.data;

        const res = await fetch(process.env.NODE_ENV === "prod" ? process.env.PYTHON_API : "http://localhost:8000/process-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl, animeId }),
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

    const { animeId } = job.data;

    try {
        if (!result?.variants) throw new Error("Invalid Python response");

        const { small, medium, large } = result.variants;

        const smallUrl = await uploadBase64ToSupabase(small, `${animeId}-small`);
        const mediumUrl = await uploadBase64ToSupabase(medium, `${animeId}-medium`);
        const largeUrl = await uploadBase64ToSupabase(large, `${animeId}-large`);

        await Anime.findByIdAndUpdate(animeId, {
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

        await Anime.findByIdAndUpdate(animeId, {
            "processing.status": "failed",
            "processing.error": err.message,
        });
    }
});

// FAILED
worker.on("failed", async (job, err) => {
    console.error("❌ Job failed:", err.message);

    if (job?.data?.animeId) {
        await Anime.findByIdAndUpdate(job.data.animeId, {
            "processing.status": "failed",
            "processing.error": err.message,
        });
    }
});

// ERROR
worker.on("error", (err) => {
    console.error("Worker error:", err);
});