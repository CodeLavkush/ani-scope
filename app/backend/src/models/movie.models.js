import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        releaseYear: {
            type: String,
        },
        genre: {
            type: String,
        },
        tags: {
            type: [String],
            default: []
        },
        poster: {
            small: {
                type: String,
                trim: true,
            },
            medium: {
                type: String,
                trim: true,
            },
            large: {
                type: String,
                trim: true,
            },
            master: {
                type: String,
                trim: true,
            },
        },
        processing: {
            status: {
                type: String,
                enum: ["pending", "processing", "processed", "failed"],
                default: "pending",
            },
            error: String,
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

export const Movie = mongoose.model("Movie", movieSchema)
