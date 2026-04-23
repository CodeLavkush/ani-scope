import { Queue } from "bullmq";
import { connection } from "./connection.js";

export const imageQueue = new Queue("image-processing", {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
});