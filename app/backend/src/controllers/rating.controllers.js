import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { Anime } from "../models/anime.models.js"
import { Rating } from "../models/rating.models.js"
import mongoose from "mongoose"

const createRating = asyncHandler(async (req, res) => {
    const { animeId } = req.params
    const { rate } = req.body
    const userId = req.user._id

    if (rate < 1 || rate > 10) {
        throw new ApiError(400, "Rate must be between 1 and 10")
    }

    if (!mongoose.Types.ObjectId.isValid(animeId)) {
        throw new ApiError(400, "Invalid anime ID")
    }

    const anime = await Anime.findById(animeId)
    if (!anime) throw new ApiError(404, "Anime not found")

    try {
        const rating = await Rating.create({
            rate,
            anime: animeId,
            user: userId,
        })

        return res.status(201).json(
            new ApiResponse(201, rating, "Rating created")
        )
    } catch (error) {
        if (error.code === 11000) {
            throw new ApiError(409, "You already rated this anime")
        }
        throw error
    }
})

const getRatings = asyncHandler(async (req, res) => {
    const { animeId } = req.params

    if (!mongoose.Types.ObjectId.isValid(animeId)) {
        throw new ApiError(400, "Invalid anime ID")
    }

    const stats = await Rating.aggregate([
        { $match: { anime: new mongoose.Types.ObjectId(animeId) } },
        {
            $group: {
                _id: "$anime",
                avgRating: { $avg: "$rate" },
                totalRatings: { $sum: 1 },
            },
        },
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            stats[0] || { avgRating: 0, totalRatings: 0 },
            "Ratings stats"
        )
    )
})

const getMyRating = asyncHandler(async (req, res) => {
    const { animeId } = req.params
    const userId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(animeId)) {
        throw new ApiError(400, "Invalid anime ID")
    }

    const rating = await Rating.findOne({ anime: animeId, user: userId })

    return res.status(200).json(
        new ApiResponse(200, rating || null, "My rating")
    )
})

const updateRating = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { rate } = req.body
    const userId = req.user._id

    if (rate < 1 || rate > 10) {
        throw new ApiError(400, "Rate must be 1–10")
    }

    const rating = await Rating.findOneAndUpdate(
        { _id: id, user: userId },
        { rate },
        { new: true }
    )

    if (!rating) {
        throw new ApiError(404, "Not found or unauthorized")
    }

    return res.status(200).json(
        new ApiResponse(200, rating, "Updated")
    )
})

const deleteRating = asyncHandler(async (req, res) => {
    const { id } = req.params
    const userId = req.user._id

    const rating = await Rating.findOneAndDelete({
        _id: id,
        user: userId,
    })

    if (!rating) {
        throw new ApiError(404, "Not found or unauthorized")
    }

    return res.status(200).json(
        new ApiResponse(200, rating, "Deleted")
    )
})

export { createRating, getRatings, getMyRating, updateRating, deleteRating }