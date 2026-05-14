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
    .route("/add-anime/:animeId")
    .post(addAnime)

router
    .route("/remove-anime/:animeId")
    .delete(removeAnime)


export default router