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

router
    .route("/")
    .post(authorizeRoles(USER_ROLES.ADMIN), upload.single("poster"), animeValidator(), validate, createAnime)
    .get(getAnime)

router
    .route("/:animeId")
    .get(getAnimeById)
    .patch(authorizeRoles(USER_ROLES.ADMIN), animeValidator(), validate, updateAnimeById)
    .delete(authorizeRoles(USER_ROLES.ADMIN), deleteAnimeById)


export default router