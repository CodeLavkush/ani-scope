import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { Anime } from "../models/anime.models.js"
import mongoose from "mongoose"
import { Review } from "../models/review.models.js"

const createReview = asyncHandler(async (req, res) => {
    const { animeId } = req.params
    const { content } = req.body

    const anime = await Anime.findById(animeId)

    if (!anime) {
        throw new ApiError(404, "Anime not found")
    }

    const review = await Review.create({
        content,
        anime: new mongoose.Types.ObjectId(animeId),
        user: new mongoose.Types.ObjectId(req.user._id),
    })

    if (!review) {
        throw new ApiError(404, "Review not found")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                review,
                "Review created successfully",
            )
        )
})

const getReviews = asyncHandler(async (req, res) => {
    const { animeId } = req.params

    const anime = await Anime.findById(animeId)

    if (!anime) {
        throw new ApiError(404, "Anime not found")
    }

    const reviews = await Review.aggregate([
        {
            $match: {
                anime: new mongoose.Types.ObjectId(animeId),
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $unwind: "$user",
        },

        {
            $project: {
                _id: 1,
                createdAt: 1,
                content: 1,

                user: {
                    _id: "$user._id",
                    username: "$user.username",
                },
            },
        },
    ])

    if (reviews.length === 0) {
        throw new ApiError(404, "Reviews not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                reviews,
                "Reviews fetched successfully"
            )
        )
})

const updateReview = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { content } = req.body

    const updatedReview = await Review.findByIdAndUpdate(
        id,
        {
            content,
        },
        {
            returnDocument: "after",
        }
    )

    if (!updatedReview) {
        throw new ApiError(404, "Review not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedReview,
                "Review updated successfully"
            )
        )
})

const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params

    const deletedReview = await Review.findByIdAndDelete(id)

    if (!deletedReview) {
        throw new ApiError(404, "Review not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedReview,
                "Review deleted successfully"
            )
        )
})

export {
    createReview,
    getReviews,
    updateReview,
    deleteReview,
}