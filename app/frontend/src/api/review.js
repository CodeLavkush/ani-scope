import { apiRequest } from "../utils/apiRequest";

const reviewUrl = `/api/v1/review`;

export const getReviews = (animeId, limit = 10, cursor = "") =>
    apiRequest(`${reviewUrl}/${animeId}?limit=${limit}&cursor=${cursor}`, "GET", null, true);

export const createReview = (animeId, content) =>
    apiRequest(`${reviewUrl}/${animeId}`, "POST", { content }, true);

export const updateReview = (reviewId, content) =>
    apiRequest(`${reviewUrl}/${reviewId}`, "PATCH", { content }, true);

export const deleteReview = (reviewId) =>
    apiRequest(`${reviewUrl}/${reviewId}`, "DELETE", null, true);
