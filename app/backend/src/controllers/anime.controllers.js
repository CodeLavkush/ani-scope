import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { Anime } from "../models/anime.models.js"
import mongoose from "mongoose"
import { uploadBufferToSupabase } from "../services/storage.service.js"
import { nsfwChecker, evaluateNSFW } from "../services/nsfwChecker.service.js"
import { imageQueue } from "../queues/image.queues.js"
import { supabase } from "../config/supabase.js"


const createAnime = asyncHandler(async (req, res) => {
    const { title, description, releaseYear, genre, tags, isSeries, trailer } = req.body;

    if (!title) {
        throw new ApiError(
            400,
            "Title is required",
        )
    }

    if (!req.file) {
        throw new ApiError(
            400,
            "Poster image is required"
        )
    }

    // NSFW checking
    const nsfwProbability = await nsfwChecker(req.file.buffer);

    const decision = evaluateNSFW(nsfwProbability)

    if (decision.status === "BLOCK" || decision.status === "REVIEW") {
        throw new ApiError(400, decision.reason);
    }

    //Saving image after checking nsfw flag
    const imageUrl = await uploadBufferToSupabase(req.file);


    // Tags processing
    let parsedTags = [];
    if (tags) {
        parsedTags = Array.isArray(tags)
            ? tags
            : tags.split(",").map(tag => tag.trim());
    }

    const anime = await Anime.create({
        title,
        description,
        releaseYear,
        genre,
        tags: parsedTags,
        trailer,
        isSeries,
        user: new mongoose.Types.ObjectId(req.user?._id),
        poster: {
            master: imageUrl,
        },
        processing: {
            status: "processing"
        },
    });

    const job = await imageQueue.add(
        "image-processing",
        {
            animeId: anime._id.toString(),
            imageUrl,
        },
    )


    return res.json(
        new ApiResponse(
            201,
            anime,
            "anime create successfully"
        )
    )
})


const getAnime = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10
    const cursor = req.query.cursor

    let query = {}

    if (cursor) {
        query._id = { $gt: new mongoose.Types.ObjectId(cursor) }
    }

    const anime = await Anime.find(query)
        .sort({ _id: 1 })
        .limit(limit)

    const nextCursor = anime.length > 0 ? anime[anime.length - 1]._id.toString() : null;

    if (anime.length === 0) {
        return res.json(
            new ApiResponse(
                200,
                {
                    data: [],
                    cursor: null,
                },
                "No more anime"
            )
        )
    }

    return res
        .json(
            new ApiResponse(
                200,
                {
                    data: anime,
                    cursor: nextCursor,
                },
                "Anime fetched successfully"
            )
        )


})

const getAnimeById = asyncHandler(async (req, res) => {
    const { animeId } = req.params

    const anime = await Anime.findById(animeId)

    if (!anime) {
        throw new ApiError(404, "Anime not found")
    }

    return res
        .json(
            new ApiResponse(
                200,
                anime,
                "Anime fetched successfully"
            )
        )
})

const updateAnimeById = asyncHandler(async (req, res) => {
    const { title, description, releaseYear, genre, tags, trailer, isSeries } = req.body;
    const { animeId } = req.params

    let parsedTags = [];
    if (tags) {
        parsedTags = Array.isArray(tags)
            ? tags
            : tags.split(",").map(tag => tag.trim());
    }

    const updatedAnime = await Anime.findByIdAndUpdate(
        animeId,
        {
            title,
            description,
            releaseYear,
            genre,
            tags: parsedTags,
            trailer,
            isSeries,
        },
        {
            returnDocument: "after",
        }
    )

    if (!updatedAnime) {
        throw new ApiError(404, "Updated anime not found")
    }

    return res
        .json(
            new ApiResponse(
                200,
                updatedAnime,
                "Anime information updated successfully"
            )
        )
})

const deleteAnimeById = asyncHandler(async (req, res) => {
    const { animeId } = req.params;

    const anime = await Anime.findById(animeId);

    if (!anime) {
        throw new ApiError(404, "Anime not found");
    }

    // collect images
    const images = [
        anime.poster?.master,
        anime.poster?.small,
        anime.poster?.medium,
        anime.poster?.large,
    ].filter(Boolean);

    // convert URLs → file names
    const filesToDelete = images.map((url) =>
        url.split("/").pop()
    );

    // delete from supabase
    const { error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .remove(filesToDelete);

    if (error) {
        console.error("Supabase delete error:", error.message);
    }

    // delete from DB
    await Anime.findByIdAndDelete(animeId);

    return res.json(
        new ApiResponse(200, anime, "anime deleted successfully")
    );
});

export {
    createAnime,
    getAnime,
    getAnimeById,
    updateAnimeById,
    deleteAnimeById,
}