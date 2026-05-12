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
/**
 * @swagger
 * tags:
 *   name: Anime
 *   description: Anime management APIs
 */

router
    .route("/")
    /**
 * @swagger
 * /api/v1/anime:
 *   post:
 *     summary: Create anime
 *     tags: [Anime]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *
 *             required:
 *               - title
 *               - poster
 *
 *             properties:
 *               title:
 *                 type: string
 *                 example: Naruto
 *
 *               description:
 *                 type: string
 *                 example: Ninja anime series
 *
 *               releaseYear:
 *                 type: number
 *                 example: 2002
 *
 *               genre:
 *                 type: string
 *                 example: Action
 *
 *               tags:
 *                 type: string
 *                 example: ninja,shounen,adventure
 *
 *               trailer:
 *                 type: string
 *                 example: https://youtube.com/watch?v=example
 *
 *               isSeries:
 *                 type: boolean
 *                 example: true
 *
 *               poster:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       201:
 *         description: Anime created successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 */
    .post(upload.single("poster"), animeValidator(), validate, createAnime)
    /**
 * @swagger
 * /api/v1/anime:
 *   get:
 *     summary: Get anime list
 *     tags: [Anime]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         example: 10
 *
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         example: 684f4d61a90dff6f58f1f111
 *
 *     responses:
 *       200:
 *         description: Anime fetched successfully
 *
 *       401:
 *         description: Unauthorized
 */
    .get(getAnime)

router
    .route("/:animeId")
    /**
     * @swagger
     * /api/v1/anime/{animeId}:
     *   get:
     *     summary: Get anime by ID
     *     tags: [Anime]
     *     security:
     *       - bearerAuth: []
     *
     *     parameters:
     *       - in: path
     *         name: animeId
     *         required: true
     *         schema:
     *           type: string
     *
     *     responses:
     *       200:
     *         description: Anime fetched successfully
     *
     *       404:
     *         description: Anime not found
     */
    .get(getAnimeById)
    /**
 * @swagger
 * /api/v1/anime/{animeId}:
 *   put:
 *     summary: Update anime by ID
 *     tags: [Anime]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: animeId
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               title:
 *                 type: string
 *                 example: Naruto Shippuden
 *
 *               description:
 *                 type: string
 *                 example: Updated anime description
 *
 *               releaseYear:
 *                 type: number
 *                 example: 2007
 *
 *               genre:
 *                 type: string
 *                 example: Action
 *
 *               tags:
 *                 type: string
 *                 example: ninja,shounen
 *
 *               trailer:
 *                 type: string
 *                 example: https://youtube.com/watch?v=example
 *
 *               isSeries:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       200:
 *         description: Anime updated successfully
 *
 *       404:
 *         description: Anime not found
 */
    .put(animeValidator(), validate, updateAnimeById)
    /**
 * @swagger
 * /api/v1/anime/{animeId}:
 *   delete:
 *     summary: Delete anime by ID
 *     tags: [Anime]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: animeId
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Anime deleted successfully
 *
 *       404:
 *         description: Anime not found
 */
    .delete(deleteAnimeById)


export default router