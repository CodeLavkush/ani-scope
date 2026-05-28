import { apiRequest } from "../utils/apiRequest";

const animeUrl = `/api/v1/anime`;

export const createAnime = async (animeData) => {
    try {
        const response = await fetch(`${animeUrl}`, {
            method: "POST",
            credentials: "include",
            body: animeData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || `Request failed: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};

export const getAnimeList = (limit = 10, cursor = "") =>
    apiRequest(`${animeUrl}?limit=${limit}&cursor=${cursor}`, "GET", null, true);

export const getAnimeById = (animeId) =>
    apiRequest(`${animeUrl}/${animeId}`, "GET", null, true);

export const updateAnime = (animeId, updatedData) =>
    apiRequest(`${animeUrl}/${animeId}`, "PATCH", updatedData, true);

export const deleteAnime = (animeId) =>
    apiRequest(`${animeUrl}/${animeId}`, "DELETE", null, true);
