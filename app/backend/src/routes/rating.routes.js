import { Router } from "express";
import {
    createRating,
    getRatings,
    updateRating,
    deleteRating,
} from "../controllers/rating.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.use(verifyJWT)

router
    .route("/")
    .get(getRatings)

router
    .route("/:animeId")
    .post(createRating)

router
    .route("/:id")
    .patch(updateRating)
    .delete(deleteRating)


export default router