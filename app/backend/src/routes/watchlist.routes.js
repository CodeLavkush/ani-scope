import { Router } from "express";
import {
    addAnime,
    getWatchlist,
    removeAnime,
} from "../controllers/watchlist.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.use(verifyJWT)

router
    .route("/")
    .get(getWatchlist)

router
    .route("/:animeId")
    .post(addAnime)
    .delete(removeAnime)


export default router