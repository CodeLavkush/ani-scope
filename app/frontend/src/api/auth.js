import { apiRequest } from "../utils/apiRequest";

const authURL = `/api/v1/auth`;

export const register = async (userFormData) => {
    try {
        const response = await fetch(`${authURL}/register`, {
            method: "POST",
            body: userFormData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || `Request failed: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};

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

export const updateUserProfile = async (profileFormData) => {
    try {
        const response = await fetch(`${authURL}`, {
            method: "PATCH",
            credentials: "include",
            body: profileFormData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || `Request failed: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};

export const deleteUserProfile = () =>
    apiRequest(`${authURL}`, "DELETE", null, true);

export const loginAdmin = (credentials) =>
    apiRequest(`${authURL}/create-admin`, "POST", credentials);

export const getUserProfiles = () =>
    apiRequest(`${authURL}`, "GET", null, true);