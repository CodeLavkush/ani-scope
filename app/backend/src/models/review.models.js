import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        content: {
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

export const Review = mongoose.model("Review", reviewSchema)