import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { Movie } from "../models/movie.models.js"
import mongoose from "mongoose"
import { uploadToSupabase } from "../services/storage.service.js"
import { nsfwChecker, evaluateNSFW } from "../services/nsfwChecker.service.js"



const createMovie = asyncHandler(async (req, res) => {
    const { title, description, releaseYear, genre, tags } = req.body;

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

    if (decision.status === "BLOCK") {
        throw new ApiError(400, decision.reason);
    }

    //Saving image after checking nsfw flag
    const imageUrl = await uploadToSupabase(req.file);


    // Tags processing
    let parsedTags = [];
    if (tags) {
        parsedTags = Array.isArray(tags)
            ? tags
            : tags.split(",").map(tag => tag.trim());
    }

    const movie = await Movie.create({
        title,
        description,
        releaseYear,
        genre,
        tags: parsedTags,
        user: new mongoose.Types.ObjectId(req.user?._id),
        poster: {
            master: imageUrl,
        },
    });

    return res.json(
        new ApiResponse(
            201,
            movie,
            "Movie create successfully"
        )
    )
})

export {
    createMovie,
}