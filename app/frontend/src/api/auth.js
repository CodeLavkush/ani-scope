import { apiRequest } from "../utils/apiRequest";


const authURL = "/api/v1/auth"

export const register = (user) =>
    apiRequest(`${authURL}/register`, "POST", user);

export const login = (user) =>
    apiRequest(`${authURL}/login`, "POST", user);

export const verifyEmail = (otp) =>
    apiRequest(`${authURL}/verify-email`, "POST", { otp });

export const refreshToken = () =>
    apiRequest(`${authURL}/refresh-token`, "POST");

export const getCurrentUser = () =>
    apiRequest(`${authURL}/current-user`, "POST", null, true);

export const logout = () =>
    apiRequest(`${authURL}/logout`, "POST", null, true);

export const resendVerificationEmail = () =>
    apiRequest(`${authURL}/resend-email-verification`, "POST", null, true);