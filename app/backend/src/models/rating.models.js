import mongoose, { Schema } from "mongoose";

const ratingSchema = new Schema(
    {
        rate: {
            type: Number,
            min: 1,
            max: 10,
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

export const Rating = mongoose.model("Rating", ratingSchema)
