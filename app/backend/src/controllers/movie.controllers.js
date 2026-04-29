import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { Movie } from "../models/movie.models.js"
import mongoose from "mongoose"
import { uploadBufferToSupabase } from "../services/storage.service.js"
import { nsfwChecker, evaluateNSFW } from "../services/nsfwChecker.service.js"
import { imageQueue } from "../queues/image.queues.js"
import { supabase } from "../config/supabase.js"


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
        processing: {
            status: "processing"
        },
    });

    const job = await imageQueue.add(
        "image-processing",
        {
            movieId: movie._id.toString(),
            imageUrl,
        },
    )


    return res.json(
        new ApiResponse(
            201,
            movie,
            "Movie create successfully"
        )
    )
})


const getMovies = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10
    const cursor = req.query.cursor

    let query = {}

    if (cursor) {
        query._id = { $gt: new mongoose.Types.ObjectId(cursor) }
    }

    const movies = await Movie.find(query)
        .sort({ _id: 1 })
        .limit(limit)

    const nextCursor = movies.length > 0 ? movies[movies.length - 1]._id.toString() : null;

    if (movies.length === 0) {
        return res.json(
            new ApiResponse(
                200,
                {
                    data: [],
                    cursor: null,
                },
                "No more movies"
            )
        )
    }

    return res
        .json(
            new ApiResponse(
                200,
                {
                    data: movies,
                    cursor: nextCursor,
                },
                "Movies fetched successfully"
            )
        )


})

const getMovieById = asyncHandler(async (req, res) => {
    const { movieId } = req.params

    const movie = await Movie.findById(movieId)

    if (!movie) {
        throw new ApiError(404, "Movie not found")
    }

    return res
        .json(
            new ApiResponse(
                200,
                movie,
                "Movie fetched successfully"
            )
        )
})

const updateMovieById = asyncHandler(async (req, res) => {
    const { title, description, releaseYear, genre, tags } = req.body;
    const { movieId } = req.params

    let parsedTags = [];
    if (tags) {
        parsedTags = Array.isArray(tags)
            ? tags
            : tags.split(",").map(tag => tag.trim());
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
        movieId,
        {
            title,
            description,
            releaseYear,
            genre,
            tags: parsedTags,
        },
        {
            returnDocument: "after",
        }
    )

    if (!updatedMovie) {
        throw new ApiError(404, "Updated movie not found")
    }

    return res
        .json(
            new ApiResponse(
                200,
                updatedMovie,
                "Movie information updated successfully"
            )
        )
})

const deleteMovieById = asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId);

    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }

    // collect images
    const images = [
        movie.poster?.master,
        movie.poster?.small,
        movie.poster?.medium,
        movie.poster?.large,
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
    await Movie.findByIdAndDelete(movieId);

    return res.json(
        new ApiResponse(200, movie, "Movie deleted successfully")
    );
});

export {
    createMovie,
    getMovies,
    getMovieById,
    updateMovieById,
    deleteMovieById,
}