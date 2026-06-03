import { Router } from "express";
import {
    createRating,
    getRatings,
    getMyRating,
    updateRating,
    deleteRating,
} from "../controllers/rating.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.use(verifyJWT)

// Must be before /:animeId to avoid route conflict
router
    .route("/:animeId/my-rating")
    .get(getMyRating)

router
    .route("/:animeId")
    .get(getRatings)
    .post(createRating)

router
    .route("/:id")
    .patch(updateRating)
    .delete(deleteRating)


export default router