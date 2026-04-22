import { Router } from "express";
import { createMovie } from "../controllers/movie.controllers.js"
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { createMovieValidator } from "../validators/index.js";

const router = Router()
router.use(verifyJWT)


router
    .route("/")
    .post(upload.single("poster"), createMovieValidator(), validate, createMovie)


export default router