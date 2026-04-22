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
            type: Date,
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

export const Moive = mongoose.model("Movie", movieSchema)
