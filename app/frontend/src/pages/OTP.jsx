import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyEmail } from "../api/auth";
import { Input, Button } from "../components";
import logoLarger from "../assets/logo-larger.png";

function OTP() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp.trim()) {
            setError("OTP code is required");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await verifyEmail(otp.trim());
            if (response && response.success !== false) {
                toast.success("Email verified successfully! You can now login.");
                navigate("/login");
            } else {
                toast.error("Invalid or expired OTP.");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to verify OTP.");
            setError(err.message || "Verification failed. Check the code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#FFEBB8]">
            <div className="max-w-md w-full bg-white border-4 border-[#4E361E] rounded-xl p-8 shadow-[8px_8px_0px_0px_#4E361E]">
                <div className="flex justify-center mb-6">
                    <img src={logoLarger} alt="AniScope Logo" className="h-14 object-contain" />
                </div>

                <h2 className="text-2xl font-extrabold text-[#4E361E] font-outfit uppercase tracking-tight text-center mb-2">
                    Verify Your Email
                </h2>
                <p className="text-sm text-[#4E361E]/70 font-poppins text-center mb-6">
                    We have sent a verification code to your email. Check your inbox (or backend logs in dev mode) and enter the OTP below.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="One-Time Password (OTP)"
                        name="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => {
                            setOtp(e.target.value);
                            setError("");
                        }}
                        placeholder="Enter OTP code"
                        error={error}
                        inputClass="border-[#4E361E] text-[#4E361E] tracking-widest text-center text-2xl h-14"
                        labelClass="text-[#4E361E] text-center"
                    />

                    <Button
                        type="submit"
                        loading={loading}
                        buttonClass="bg-[#F5C23E] hover:bg-[#FFD059] text-[#4E361E] border-4 border-[#4E361E] shadow-[4px_4px_0px_0px_#4E361E] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-100 cursor-pointer text-lg h-12 mt-2"
                    >
                        Verify Code
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm font-poppins text-[#4E361E]">
                    Know the credentials?{" "}
                    <Link
                        to="/login"
                        className="font-bold underline decoration-2 hover:text-[#F5C23E] transition-colors"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default OTP;