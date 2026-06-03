import { apiRequest } from "../utils/apiRequest";

const ratingUrl = `/api/v1/rating`;

export const getRatingsStats = (animeId) =>
    apiRequest(`${ratingUrl}/${animeId}`, "GET", null, true);

export const getMyRating = (animeId) =>
    apiRequest(`${ratingUrl}/${animeId}/my-rating`, "GET", null, true);

export const createRating = (animeId, rate) =>
    apiRequest(`${ratingUrl}/${animeId}`, "POST", { rate }, true);

export const updateRating = (ratingId, rate) =>
    apiRequest(`${ratingUrl}/${ratingId}`, "PATCH", { rate }, true);

export const deleteRating = (ratingId) =>
    apiRequest(`${ratingUrl}/${ratingId}`, "DELETE", null, true);
