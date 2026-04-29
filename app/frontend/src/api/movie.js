import { apiRequest } from "../utils/apiRequest";

const movieUrl = "/api/v1/movies"

export const createMovie = async (movieData) => {
    try {
        const response = await fetch(`${movieUrl}`, {
            method: "POST",
            credentials: "include",
            body: movieData,
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
}
export const getMovies = (limit = 6, cursor = "") =>
    apiRequest(`${movieUrl}?limit=${limit}&cursor=${cursor}`, "GET", null, true)


export const getMovieById = (movieId) =>
    apiRequest(`${movieUrl}/${movieId}`, "GET", null, true)


export const updateMovie = (movieId, updatedData) =>
    apiRequest(`${movieUrl}/${movieId}`, "PUT", updatedData, true)


export const deleteMovie = (movieId) =>
    apiRequest(`${movieUrl}/${movieId}`, "DELETE", null, true)
