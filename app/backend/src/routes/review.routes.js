import { Router } from "express";
import {
    createReview,
    getReviews,
    deleteReview,
    updateReview,
} from "../controllers/review.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.use(verifyJWT)

router
    .route("/:animeId")
    .get(getReviews)
    .post(createReview)

router
    .route("/:id")
    .patch(updateReview)
    .delete(deleteReview)


export default router