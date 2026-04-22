import { Router } from "express";
import { getCurrentUser, login, logoutUser, refreshAccessToken, registerUser, resendEmailVerification, verifyEmail } from "../controllers/auth.controllers.js"
import { validate } from "../middlewares/validator.middleware.js";
import { userLoginValidator, userRegisterValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

// unsecured routes
router
    .route("/register")
    .post(userRegisterValidator(), validate, registerUser)
router
    .route("/login")
    .post(userLoginValidator(), validate, login)
router
    .route("/verify-email")
    .post(verifyEmail)
router
    .route("/refresh-token")
    .post(refreshAccessToken)

//secure routes
router
    .route("/logout")
    .post(verifyJWT, logoutUser)
router
    .route("/current-user")
    .post(verifyJWT, getCurrentUser)
router
    .route("/resend-email-verification")
    .post(verifyJWT, resendEmailVerification)

export default router;