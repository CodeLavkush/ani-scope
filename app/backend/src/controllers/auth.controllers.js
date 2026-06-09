import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { USER_ROLES } from "../config/constant.js"
import { uploadBufferToSupabase, deleteImageFromSupbase } from "../services/storage.service.js"
import { connection } from "../queues/connection.js"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return {
            accessToken,
            refreshToken,
        }
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access token"
        )
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, gender, age } = req.body;

    let avatarImageUrl = ""

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists", []);
    }

    if (req.file) {
        avatarImageUrl = await uploadBufferToSupabase(req.file)
    }

    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false,
        avatar: avatarImageUrl || "",
        gender,
        age,
    })

    const { otp, otpExpiry } = user.generateOTP()

    console.log(`[DEV ONLY] Generated OTP for ${user.email} is: ${otp}`);

    await connection.set(user.otpKey(), otp, "EX", otpExpiry)


    await user.save({ validateBeforeSave: false })

    await sendEmail(
        {
            email: user?.email,
            subject: "Please verify your email",
            mailgenContent: emailVerificationMailgenContent(
                user?.username,
                `${otp}`
            )
        }
    )

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken",
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering a user")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { user: createdUser },
                "User registered successfully and verification email has been sent on your email"
            )
        )
})

const login = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOne({
        $or: [
            { email },
            { username },
        ]
    })

    if (!user) {
        throw new ApiError(400, "User does not exists")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken",
    )

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: "",
            },
        },
        {
            returnDocument: "after",
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out")
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched successfully"
            )
        )
})

const verifyEmail = asyncHandler(async (req, res) => {
    const { otp, email } = req.body

    const user = await User.findOne({ email }).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User does not exists")
    }

    if (!otp) {
        throw new ApiError(400, "Email Verification OTP is missing")
    }

    const savedOtp = await connection.get(user.otpKey())

    if (!savedOtp) {
        throw new ApiError(400, "OTP is expired or not found")
    }

    if (savedOtp !== otp) {
        throw new ApiError(400, "Invalid OTP")
    }

    user.isEmailVerified = true

    await connection.del(user.otpKey())

    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    isEmailVerified: user.isEmailVerified,
                },
                "Email is verified"
            )
        )
})

const resendEmailVerification = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id)

    if (!user) {
        throw new ApiError(404, "User does not exists")
    }
    if (user.isEmailVerified) {
        throw new ApiError(409, "Email is already verified")
    }


    const { otp, otpExpiry } = user.generateOTP()
    console.log(`[DEV ONLY] Generated OTP for ${user.email} is: ${otp}`);
    await connection.set(user.otpKey(), otp, "EX", otpExpiry)


    await user.save({ validateBeforeSave: false })

    await sendEmail(
        {
            email: user?.email,
            subject: "Please verify your email",
            mailgenContent: emailVerificationMailgenContent(
                user.username,
                `${otp}`
            )
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Mail has been sent to your email ID"
            )
        )
})
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    console.log(incomingRefreshToken)

    if (!incomingRefreshToken) {
        throw new ApiResponse(401, "Unauthorized access")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired")
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        user.refreshToken = newRefreshToken
        await user.save()

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken,
                    },
                    "Access Token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, "Invalid refresh Token")
    }
})

const getProfiles = asyncHandler(async (req, res) => {
    const profiles = await User.find().select("-refreshToken -password")

    if (profiles.length === 0) {
        throw new ApiError(404, "Profiles not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                profiles,
                "Profiles fetched successfully",
            )
        )
})

const createAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(400, "User does not exists")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInAdmin = await User.findByIdAndUpdate(
        user._id,
        {
            role: USER_ROLES.ADMIN,
        },
        {
            returnDocument: "after",
        }
    ).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInAdmin,
                    accessToken,
                    refreshToken,
                },
                "Admin logged in successfully"
            )
        )
})

const updateProfile = asyncHandler(async (req, res) => {
    const userId = String(req.user._id)

    if (!userId) {
        throw new ApiError(404, "User id not found")
    }

    const { username, gender, age, email } = req?.body

    const updatedUserData = {}

    if (username) updatedUserData.username = username;
    if (gender) updatedUserData.gender = gender;
    if (age) updatedUserData.age = age;
    if (email) updatedUserData.email = email;


    if (req.file) {
        const user = await User.findById(userId).select("-password -refreshToken")

        await deleteImageFromSupbase(user?.avatar)

        const avatarImageUrl = await uploadBufferToSupabase(req?.file)
        updatedUserData.avatar = avatarImageUrl
    }


    const updatedUser = await User.findByIdAndUpdate(
        userId,
        updatedUserData,
        {
            returnDocument: "after",
        }
    ).select("-password -refreshToken")

    if (!updatedUser) {
        throw new ApiError(404, "User not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedUser,
                "Profile updated successfully",
            )
        )
})

const deleteProfile = asyncHandler(async (req, res) => {
    const userId = String(req.user._id)

    if (!userId) {
        throw new ApiError(404, "User id not found")
    }


    const user = await User.findById(userId).select("-password -refreshToken")

    await deleteImageFromSupbase(user?.avatar)

    const deletedUser = await User.findByIdAndDelete(userId).select("-password -refreshToken")

    if (!deletedUser) {
        throw new ApiError(404, "User not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedUser,
                "Profile deleted successfully"
            )
        )
})

export {
    registerUser,
    login,
    logoutUser,
    getCurrentUser,
    verifyEmail,
    refreshAccessToken,
    resendEmailVerification,
    createAdmin,
    updateProfile,
    deleteProfile,
    getProfiles,
}