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
import { USER_ROLES } from "../config/constant.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";


const router = Router()

router.use(verifyJWT)

router.use(authorizeRoles(USER_ROLES.ADMIN))

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