import { Router } from "express";
import { getCurrentUser, login, logoutUser, refreshAccessToken, registerUser, resendEmailVerification, verifyEmail } from "../controllers/auth.controllers.js"
import { validate } from "../middlewares/validator.middleware.js";
import { userLoginValidator, userRegisterValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

// unsecured routes
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *
 *             properties:
 *               username:
 *                 type: string
 *                 example: lavkush
 *
 *               email:
 *                 type: string
 *                 example: lavkush@gmail.com
 *
 *               password:
 *                 type: string
 *                 example: password123
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 *
 *       409:
 *         description: User already exists
 */
router
    .route("/register")
    .post(userRegisterValidator(), validate, registerUser)

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               username:
 *                 type: string
 *                 example: lavkush
 *
 *               email:
 *                 type: string
 *                 example: lavkush@gmail.com
 *
 *               password:
 *                 type: string
 *                 example: password123
 *
 *     responses:
 *       200:
 *         description: Login successful
 *
 *       400:
 *         description: Invalid credentials
 */
router
    .route("/login")
    .post(userLoginValidator(), validate, login)

/**
* @swagger
* /api/v1/auth/verify-email:
*   post:
*     summary: Verify email with OTP
*     tags: [Auth]
*
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*
*             required:
*               - otp
*
*             properties:
*               otp:
*                 type: string
*                 example: 123456
*
*     responses:
*       200:
*         description: Email verified successfully
*
*       400:
*         description: Invalid or expired OTP
*/
router
    .route("/verify-email")
    .post(verifyEmail)

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *
 *     responses:
 *       200:
 *         description: Access token refreshed
 *
 *       401:
 *         description: Invalid refresh token
 */
router
    .route("/refresh-token")
    .post(refreshAccessToken)

//secure routes
/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: User logged out
 *
 *       401:
 *         description: Unauthorized
 */
router
    .route("/logout")
    .post(verifyJWT, logoutUser)

/**
* @swagger
* /api/v1/auth/current-user:
*   post:
*     summary: Get current logged in user
*     tags: [Auth]
*     security:
*       - bearerAuth: []
*
*     responses:
*       200:
*         description: Current user fetched
*
*       401:
*         description: Unauthorized
*/
router
    .route("/current-user")
    .post(verifyJWT, getCurrentUser)

/**
 * @swagger
 * /api/v1/auth/resend-email-verification:
 *   post:
 *     summary: Resend email verification OTP
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Verification email sent
 *
 *       401:
 *         description: Unauthorized
 */
router
    .route("/resend-email-verification")
    .post(verifyJWT, resendEmailVerification)

export default router;