import { apiRequest } from "../utils/apiRequest";

const watchlistUrl = `/api/v1/watchlist`;

export const getWatchlist = (limit = 10, cursor = "") =>
    apiRequest(`${watchlistUrl}?limit=${limit}&cursor=${cursor}`, "GET", null, true);

export const addToWatchlist = (animeId) =>
    apiRequest(`${watchlistUrl}/${animeId}`, "POST", null, true);

export const removeFromWatchlist = (animeId) =>
    apiRequest(`${watchlistUrl}/${animeId}`, "DELETE", null, true);
