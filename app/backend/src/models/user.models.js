import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
        },
        otp: {
            type: String,
        },
        otpExpiry: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
    )
}

userSchema.methods.generateOTP = function () {
    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // hash the OTP before saving
    const hashedOTP = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

    // expiry (5–10 mins is standard)
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins

    return { otp, hashedOTP, otpExpiry };
};

export const User = mongoose.model("User", userSchema);