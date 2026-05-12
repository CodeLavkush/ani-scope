import mongoose, { Schema } from "mongoose";

const watchlistSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        anime: {
            type: Schema.Types.ObjectId,
            ref: "Anime",
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Watchlist = mongoose.model("Watchlist", watchlistSchema)