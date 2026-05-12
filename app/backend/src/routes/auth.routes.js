import { Router } from "express";
import { createAdmin, deleteProfile, getCurrentUser, getProfiles, login, logoutUser, refreshAccessToken, registerUser, resendEmailVerification, updateProfile, verifyEmail } from "../controllers/auth.controllers.js"
import { validate } from "../middlewares/validator.middleware.js";
import { createAdminValidator, userLoginValidator, userRegisterValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/role.middleware.js"
import { USER_ROLES } from "../config/constant.js";

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

router
    .route("/create-admin")
    .post(createAdminValidator(), validate, createAdmin)

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

router
    .route("/:userId")
    .patch(verifyJWT, updateProfile)
    .delete(verifyJWT, deleteProfile)

router
    .route("/")
    .get(verifyJWT, authorizeRoles(USER_ROLES.ADMIN), getProfiles)

export default router;