import { apiRequest } from "../utils/apiRequest";

const movieUrl = "/api/v1/movies"

export const createMovie = (movieData) => {
    apiRequest(movieUrl, "POST", movieData, true)
}
export const getMovies = (limit = 6, cursor = "") => {
    apiRequest(`${movieUrl}?limit=${limit}&cursor=${cursor}`, "GET", null, true)
}

export const getMovieById = (movieId) => {
    apiRequest(`${movieUrl}/${movieId}`, "GET", null, true)
}

export const updateMovie = (movieId, updatedData) => {
    apiRequest(`${movieUrl}/${movieId}`, "PUT", updatedData, true)
}

export const deleteMovie = (movieId) => {
    apiRequest(`${movieUrl}/${movieId}`, "DELETE", null, true)
}