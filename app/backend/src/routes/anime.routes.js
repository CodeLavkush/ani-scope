import { Router } from "express";
import {
    createAnime,
    getAnime,
    getAnimeById,
    updateAnimeById,
    deleteAnimeById,
} from "../controllers/anime.controllers.js"
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
    animeValidator,
} from "../validators/index.js";

const router = Router()
router.use(verifyJWT)


router
    .route("/")
    .post(upload.single("poster"), animeValidator(), validate, createAnime)
    .get(getAnime)

router
    .route("/:animeId")
    .get(getAnimeById)
    .put(animeValidator(), validate, updateAnimeById)
    .delete(deleteAnimeById)


export default router