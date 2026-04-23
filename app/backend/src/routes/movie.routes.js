import { Router } from "express";
import {
    createMovie,
    getMovieById,
    getMovies,
    updateMovieById,
    deleteMovieById,
} from "../controllers/movie.controllers.js"
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
    movieValidator,
} from "../validators/index.js";

const router = Router()
router.use(verifyJWT)


router
    .route("/")
    .post(upload.single("poster"), movieValidator(), validate, createMovie)
    .get(getMovies)

router
    .route("/:movieId")
    .get(getMovieById)
    .put(movieValidator(), validate, updateMovieById)
    .delete(deleteMovieById)


export default router