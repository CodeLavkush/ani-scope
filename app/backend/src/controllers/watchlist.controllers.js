import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { Anime } from "../models/anime.models.js"
import { Watchlist } from "../models/watchlist.models.js"
import mongoose from "mongoose"

const addAnime = asyncHandler(async (req, res) => {
    const { animeId } = req.params
    const userId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(animeId)) {
        throw new ApiError(400, "Invalid anime ID")
    }

    const anime = await Anime.findById(animeId)
    if (!anime) throw new ApiError(404, "Anime not found")

    try {
        const watchlist = await Watchlist.create({
            anime: animeId,
            user: userId,
        })

        return res.status(201).json(
            new ApiResponse(201, watchlist, "Added to watchlist")
        )
    } catch (error) {
        if (error.code === 11000) {
            throw new ApiError(409, "Already in watchlist")
        }
        throw error
    }
})

const getWatchlist = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { limit = 10, cursor } = req.query

    const parsedLimit = Math.min(Number(limit) || 10, 50)

    const matchStage = { user: userId }

    if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
        matchStage._id = { $lt: new mongoose.Types.ObjectId(cursor) }
    }

    const watchlists = await Watchlist.aggregate([
        { $match: matchStage },
        { $sort: { _id: -1 } },
        { $limit: parsedLimit },
        {
            $lookup: {
                from: "animes",
                localField: "anime",
                foreignField: "_id",
                as: "anime",
            },
        },
        { $unwind: "$anime" },
        {
            $project: {
                _id: 1,
                createdAt: 1,
                anime: {
                    _id: "$anime._id",
                    title: "$anime.title",
                    poster: "$anime.poster",
                    isSeries: "$anime.isSeries",
                },
            },
        },
    ])

    const nextCursor =
        watchlists.length > 0
            ? watchlists[watchlists.length - 1]._id
            : null

    return res.status(200).json(
        new ApiResponse(200, {
            items: watchlists,
            nextCursor,
        }, "Watchlist fetched")
    )
})

const removeAnime = asyncHandler(async (req, res) => {
    const { animeId } = req.params
    const userId = req.user._id

    const removed = await Watchlist.findOneAndDelete({
        anime: animeId,
        user: userId,
    })

    if (!removed) {
        throw new ApiError(404, "Not found in watchlist")
    }

    return res.status(200).json(
        new ApiResponse(200, removed, "Removed from watchlist")
    )
})

export { addAnime, getWatchlist, removeAnime }