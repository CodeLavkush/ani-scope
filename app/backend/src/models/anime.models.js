import mongoose, { Schema } from "mongoose";

const animeSchema = new Schema(
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
        trailer: {
            type: String,
            default: ""
        },
        isSeries: {
            type: Boolean,
            default: false,
        },
        poster: {
            type: String,
            trim: true
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

export const Anime = mongoose.model("Anime", animeSchema)
