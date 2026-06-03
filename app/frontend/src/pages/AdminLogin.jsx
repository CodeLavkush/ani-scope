import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { loginAdmin } from "../api/auth";
import { login as loginRedux } from "../store/authSlice";
import { Input, Button } from "../components";
import loginCharacter from "../assets/login_character.png";
import logoLarger from "../assets/logo-larger.png";

function AdminLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email address";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await loginAdmin(formData);
            if (response && response.data) {
                toast.success("Welcome, Admin!");
                dispatch(loginRedux(response.data.user));
                navigate("/admin/dashboard");
            } else {
                toast.error("Failed to log in as admin.");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Invalid credentials.");
            setErrors({
                api: error.message || "Failed to log in as admin. Please check your credentials.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#FFEBB8]">
            <div className="max-w-4xl w-full flex flex-col md:flex-row bg-white border-4 border-[#4E361E] rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_#4E361E] min-h-[550px]">
                {/* Left Side: Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex justify-center mb-6">
                        <img src={logoLarger} alt="AniScope Logo" className="h-16 object-contain" />
                    </div>

                    <h2 className="text-3xl font-extrabold text-[#4E361E] font-outfit uppercase tracking-tight mb-2 text-center md:text-left">
                        Admin Portal
                    </h2>
                    <p className="text-sm text-[#4E361E]/70 font-poppins mb-6 text-center md:text-left">
                        Enter your email and password. Standard accounts will be upgraded to <strong>Admin role</strong> upon signing in.
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
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="enter_admin_email@example.com"
                            error={errors.email}
                            inputClass="border-[#4E361E] text-[#4E361E] focus:bg-[#FFD059]/10"
                            labelClass="text-[#4E361E]"
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            error={errors.password}
                            inputClass="border-[#4E361E] text-[#4E361E] focus:bg-[#FFD059]/10"
                            labelClass="text-[#4E361E]"
                        />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                loading={loading}
                                buttonClass="bg-[#FFD059] hover:bg-[#F5C23E] text-[#4E361E] border-4 border-[#4E361E] shadow-[4px_4px_0px_0px_#4E361E] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-100 cursor-pointer text-lg h-14"
                            >
                                Access Admin Panel
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm font-poppins text-[#4E361E]">
                        Standard User?{" "}
                        <Link
                            to="/login"
                            className="font-bold underline decoration-2 hover:text-[#F5C23E] transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Right Side: Illustration */}
                <div className="hidden md:flex w-1/2 bg-[#4E361E] border-l-4 border-[#4E361E] items-center justify-center p-8 relative overflow-hidden">
                    {/* Retro background pattern elements */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFEBB8_2px,transparent_2px)] [background-size:16px_16px]"></div>
                    <div className="text-center text-[#FFEBB8] max-w-[280px] z-10 flex flex-col items-center gap-6">
                        <img
                            src={loginCharacter}
                            alt="Anime login character"
                            className="w-full max-w-[240px] object-contain drop-shadow-[8px_8px_0px_rgba(0,0,0,0.3)] animate-pulse-slow"
                            style={{ animationDuration: "6s" }}
                        />
                        <div>
                            <h3 className="text-xl font-bold font-outfit uppercase tracking-wider mb-2">CONTROL PANEL</h3>
                            <p className="text-xs opacity-80 leading-relaxed font-poppins">
                                Add new anime content, manage catalog updates, optimize images, and monitor user profiles.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
