import { Worker } from "bullmq";
import { connection } from "../queues/connection.js";

const worker = new Worker(
    "image-processing",
    async (job) => {
        try {
            const { imageUrl, movieId } = job.data;

            console.log(`Processing job ${job.id}`);

            // Simulate processing (replace later with Python API)
            await new Promise((res) => setTimeout(res, 2000));

            console.log(`Done processing ${movieId}`);

            return { success: true };
        } catch (error) {
            console.error("Worker error:", error.message);
            throw error; // important for retry
        }
    },
    {
        connection,
        concurrency: 5,
    }
);

// EVENTS
worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed:`, err.message);
});

worker.on("error", (err) => {
    console.error("Worker crashed:", err);
});