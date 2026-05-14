import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { Anime } from "../models/anime.models.js"
import mongoose from "mongoose"
import { Rating } from "../models/rating.models.js"


const createRating = asyncHandler(async (req, res) => {
    const { animeId } = req.params
    const { rate } = req.body

    const anime = await Anime.findById(animeId)

    if (!anime) {
        throw new ApiError(404, "Anime not found")
    }

    const rating = await Rating.create(
        {
            rate,
            anime: new mongoose.Types.ObjectId(animeId),
            user: new mongoose.Types.ObjectId(req.user?._id),
        }
    )

    if (!rating) {
        throw new ApiError(404, "Rating cannot be created")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                rating,
                "Rating given successfully"
            )
        )
})

const getRatings = asyncHandler(async (req, res) => {

    const { animeId } = req.params

    const anime = await Anime.findById(animeId)

    if (!anime) {
        throw new ApiError(404, "Anime not found")
    }

    const ratings = await Rating.aggregate([
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
                rate: 1,

                user: {
                    _id: "$user._id",
                    username: "$user.username",
                },
            },
        },
    ])

    if (ratings.length === 0) {
        throw new ApiError(404, "Ratings not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                ratings,
                "Ratings fetched successfully"
            )
        )
})

const updateRating = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { rate } = req.body

    const rating = await Rating.findByIdAndUpdate(
        id,
        {
            rate,
        },
        {
            returnDocument: "after",
        }
    )

    if (!rating) {
        throw new ApiError(404, "Rating not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                rating,
                "Rating updated successfully",
            )
        )
})

const deleteRating = asyncHandler(async (req, res) => {
    const { id } = req.params

    const rating = await Rating.findByIdAndDelete(id)

    if (!rating) {
        throw new ApiError(404, "Rating not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                rating,
                "Rating deleted successfully",
            )
        )
})

export {
    createRating,
    getRatings,
    updateRating,
    deleteRating,
}