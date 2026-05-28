import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { Anime } from "../models/anime.models.js"
import { Review } from "../models/review.models.js"
import mongoose from "mongoose"

const createReview = asyncHandler(async (req, res) => {
    const { animeId } = req.params
    const { content } = req.body
    const userId = req.user._id

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required")
    }

    if (!mongoose.Types.ObjectId.isValid(animeId)) {
        throw new ApiError(400, "Invalid anime ID")
    }

    const anime = await Anime.findById(animeId)
    if (!anime) throw new ApiError(404, "Anime not found")

    try {
        const review = await Review.create({
            content,
            anime: animeId,
            user: userId,
        })

        return res.status(201).json(
            new ApiResponse(201, review, "Review created")
        )
    } catch (error) {
        if (error.code === 11000) {
            throw new ApiError(409, "You already reviewed this anime")
        }
        throw error
    }
})

const getReviews = asyncHandler(async (req, res) => {
    const { animeId } = req.params
    const { limit = 10, cursor } = req.query

    if (!mongoose.Types.ObjectId.isValid(animeId)) {
        throw new ApiError(400, "Invalid anime ID")
    }

    const parsedLimit = Math.min(Number(limit) || 10, 50)

    const matchStage = {
        anime: new mongoose.Types.ObjectId(animeId),
    }

    if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
        matchStage._id = { $lt: new mongoose.Types.ObjectId(cursor) }
    }

    const reviews = await Review.aggregate([
        { $match: matchStage },
        { $sort: { _id: -1 } },
        { $limit: parsedLimit },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: "$user" },
        {
            $project: {
                _id: 1,
                content: 1,
                createdAt: 1,
                user: {
                    _id: "$user._id",
                    username: "$user.username",
                },
            },
        },
    ])

    const nextCursor =
        reviews.length > 0
            ? reviews[reviews.length - 1]._id
            : null

    return res.status(200).json(
        new ApiResponse(200, {
            items: reviews,
            nextCursor,
        }, "Reviews fetched")
    )
})

const updateReview = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { content } = req.body
    const userId = req.user._id

    if (!content?.trim()) {
        throw new ApiError(400, "Content required")
    }

    const review = await Review.findOneAndUpdate(
        { _id: id, user: userId },
        { content },
        { new: true }
    )

    if (!review) {
        throw new ApiError(404, "Not found or unauthorized")
    }

    return res.status(200).json(
        new ApiResponse(200, review, "Updated")
    )
})

const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params
    const userId = req.user._id

    const review = await Review.findOneAndDelete({
        _id: id,
        user: userId,
    })

    if (!review) {
        throw new ApiError(404, "Not found or unauthorized")
    }

    return res.status(200).json(
        new ApiResponse(200, review, "Deleted")
    )
})

export { createReview, getReviews, updateReview, deleteReview }