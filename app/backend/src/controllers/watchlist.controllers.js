import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { Anime } from "../models/anime.models.js"
import mongoose from "mongoose"
import { Watchlist } from "../models/watchlist.models.js"

const addAnime = asyncHandler(async (req, res) => {
    const { animeId } = req.params
    const userId = String(req.user._id)

    const anime = await Anime.findById(animeId)

    if (!anime) {
        throw new ApiError(404, "Anime not found")
    }

    const exists = await Watchlist.findOne({
        anime: animeId,
        user: userId
    })

    if (exists) {
        throw new ApiError(400, "Anime already in watchlist")
    }

    const watchlist = await Watchlist.create({
        anime: animeId,
        user: userId,
    })

    if (!watchlist) {
        throw new ApiError(404, "Anime unable to add in watchlist")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                watchlist,
                "Anime added to watchlist"
            )
        )
})

const getAnime = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const watchlists = await Watchlist.aggregate([
        {
            $match: {
                user: userId,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $lookup: {
                from: "animes",
                localField: "anime",
                foreignField: "_id",
                as: "anime",
            },
        },
        {
            $unwind: "$anime",
        },
        {
            $project: {
                _id: 1,
                createdAt: 1,

                anime: {
                    _id: "$anime._id",
                    title: "$anime.title",
                    description: "$anime.description",
                    isSeries: "$anime.isSeries",
                    poster: "$anime.poster",
                },
            },
        },
    ])

    if (watchlists.length === 0) {
        throw new ApiError(404, "Watchlist has no anime")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                watchlists,
                "Watchlists fetched successfully"
            )
        )
})

const removeAnime = asyncHandler(async (req, res) => {
    const { animeId } = req.params
    const userId = req.user._id

    const removedAnime = await Watchlist.findOneAndDelete({
        anime: animeId,
        user: userId
    })

    if (!removedAnime) {
        throw new ApiError(404, "Unable to remove anime from watchlist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                removedAnime,
                "Anime removed successfully"
            )
        )
})