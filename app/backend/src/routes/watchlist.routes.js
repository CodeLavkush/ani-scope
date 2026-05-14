import { Router } from "express";
import {
    addAnime,
    getAnime,
    removeAnime,
} from "../controllers/watchlist.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.use(verifyJWT)

router
    .route("/")
    .get(getAnime)

router
    .route("/:animeId")
    .post(addAnime)
    .delete(removeAnime)


export default router