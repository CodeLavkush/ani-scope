import IORedis from "ioredis";
import dotenv from "dotenv"

dotenv.config()

export const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    tls: process.env.REDIS_URL?.includes("rediss://") ? {} : undefined,
});