import { apiRequest } from "../utils/apiRequest";

const animeUrl = `/api/v1/anime`;

export const createAnime = (animeData) =>
    apiRequest(animeUrl, "POST", animeData, true, true);

export const getAnimeList = (limit = 10, cursor = "") =>
    apiRequest(`${animeUrl}?limit=${limit}&cursor=${cursor}`, "GET", null, true);

export const getAnimeById = (animeId) =>
    apiRequest(`${animeUrl}/${animeId}`, "GET", null, true);

export const updateAnime = (animeId, updatedData) =>
    apiRequest(`${animeUrl}/${animeId}`, "PATCH", updatedData, true);

export const deleteAnime = (animeId) =>
    apiRequest(`${animeUrl}/${animeId}`, "DELETE", null, true);
