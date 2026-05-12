import { Router } from "express"
import { healthCheck } from "../controllers/healthcheck.controllers.js"

const router = Router()


/**
 * @swagger
 * tags:
 *   name: Healthcheck
 *   description: Server health APIs
 */

/**
 * @swagger
 * /api/v1/healthcheck:
 *   get:
 *     summary: Check server health
 *     tags: [Healthcheck]
 *
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Server is running
 */
router.route('/').get(healthCheck)

export default router