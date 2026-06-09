import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyEmail } from "../api/auth";
import { Input, Button } from "../components";
import logoLarger from "../assets/logo-larger.png";

function OTP() {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState(location.state?.email || "");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = "Email address is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Invalid email format";
        }

        if (!otp.trim()) {
            newErrors.otp = "OTP code is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setErrors({});
        try {
            const response = await verifyEmail(otp.trim(), email.trim());
            if (response && response.success !== false) {
                toast.success("Email verified successfully! You can now login.");
                navigate("/login");
            } else {
                toast.error("Invalid or expired OTP.");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to verify OTP.");
            setErrors({ api: err.message || "Verification failed. Check the code." });
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
                    We have sent a verification code to your email. Check your inbox (or backend logs in dev mode) and enter the details below.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.api && (
                        <div className="p-3 bg-red-100 border-2 border-red-500 rounded text-red-700 text-sm font-poppins">
                            {errors.api}
                        </div>
                    )}

                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        placeholder="Enter email address"
                        error={errors.email}
                        inputClass="border-[#4E361E] text-[#4E361E] h-11 text-sm shadow-[2px_2px_0px_0px_#4E361E]"
                        labelClass="text-[#4E361E] text-xs font-bold font-outfit uppercase"
                    />

                    <Input
                        label="One-Time Password (OTP)"
                        name="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => {
                            setOtp(e.target.value);
                            setErrors((prev) => ({ ...prev, otp: "" }));
                        }}
                        placeholder="Enter OTP code"
                        error={errors.otp}
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