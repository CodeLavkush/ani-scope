import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { register as registerAPI } from "../api/auth";
import { Input, Button } from "../components";
import registerCharacter from "../assets/register_character.png";
import logoLarger from "../assets/logo-larger.png";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        age: "",
        gender: "male",
    });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
            setErrors((prev) => ({ ...prev, avatar: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (!formData.age) {
            newErrors.age = "Age is required";
        } else if (isNaN(formData.age) || parseInt(formData.age) <= 0) {
            newErrors.age = "Please enter a valid age";
        }
        if (!avatar) {
            newErrors.avatar = "Avatar image is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fix all form validation errors.");
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            data.append("username", formData.username.trim());
            data.append("email", formData.email.trim());
            data.append("password", formData.password);
            data.append("age", formData.age);
            data.append("gender", formData.gender.toUpperCase());
            data.append("avatar", avatar);

            const response = await registerAPI(data);
            if (response) {
                toast.success("Registration successful! Verify your email.");
                navigate("/verification");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to register.");
            setErrors({ api: error.message || "Failed to register. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#FFEBB8]">
            <div className="max-w-4xl w-full flex flex-col md:flex-row bg-white border-4 border-[#4E361E] rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_#4E361E] min-h-[600px] my-6">
                {/* Left Side: Register Form */}
                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex justify-center mb-4">
                        <img src={logoLarger} alt="AniScope Logo" className="h-12 object-contain" />
                    </div>

                    <h2 className="text-3xl font-extrabold text-[#4E361E] font-outfit uppercase tracking-tight mb-1 text-center md:text-left">
                        Join AniScope
                    </h2>
                    <p className="text-sm text-[#4E361E]/70 font-poppins mb-4 text-center md:text-left">
                        Create an account to track, rate and review your favorite anime.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {errors.api && (
                            <div className="p-3 bg-red-100 border-2 border-red-500 rounded text-red-700 text-sm font-poppins">
                                {errors.api}
                            </div>
                        )}

                        <div className="flex flex-col items-center md:items-start gap-2 py-1">
                            <span className="font-bold font-outfit uppercase text-sm text-[#4E361E]">Avatar</span>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full border-4 border-[#4E361E] overflow-hidden bg-[#FFEBB8] shadow-[2px_2px_0px_0px_#4E361E] flex items-center justify-center">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[#4E361E]/50 text-xs font-bold font-poppins">No file</span>
                                    )}
                                </div>
                                <label className="cursor-pointer bg-[#FFD059] hover:bg-[#F5C23E] border-2 border-[#4E361E] text-[#4E361E] font-bold font-poppins text-xs px-3 py-2 rounded-md shadow-[2px_2px_0px_0px_#4E361E] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
                                    Choose Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            {errors.avatar && (
                                <span className="text-red-500 text-xs font-poppins">{errors.avatar}</span>
                            )}
                        </div>

                        <Input
                            label="Username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            error={errors.username}
                            inputClass="border-[#4E361E] text-[#4E361E] h-11 text-sm shadow-[2px_2px_0px_0px_#4E361E]"
                            labelClass="text-[#4E361E] text-xs"
                        />

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            error={errors.email}
                            inputClass="border-[#4E361E] text-[#4E361E] h-11 text-sm shadow-[2px_2px_0px_0px_#4E361E]"
                            labelClass="text-[#4E361E] text-xs"
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            error={errors.password}
                            inputClass="border-[#4E361E] text-[#4E361E] h-11 text-sm shadow-[2px_2px_0px_0px_#4E361E]"
                            labelClass="text-[#4E361E] text-xs"
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Age"
                                error={errors.age}
                                inputClass="border-[#4E361E] text-[#4E361E] h-11 text-sm shadow-[2px_2px_0px_0px_#4E361E]"
                                labelClass="text-[#4E361E] text-xs"
                            />

                            <div className="flex flex-col gap-1">
                                <label className="font-bold font-outfit uppercase text-xs text-[#4E361E]">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="border-4 border-[#4E361E] h-11 w-full rounded-md shadow-[2px_2px_0px_0px_#4E361E] outline-none px-2 font-poppins text-sm bg-white text-[#4E361E]"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-3">
                            <Button
                                type="submit"
                                loading={loading}
                                buttonClass="bg-[#F5C23E] hover:bg-[#FFD059] text-[#4E361E] border-4 border-[#4E361E] shadow-[4px_4px_0px_0px_#4E361E] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-100 cursor-pointer text-lg h-12"
                            >
                                Register
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm font-poppins text-[#4E361E]">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-bold underline decoration-2 hover:text-[#F5C23E] transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Right Side: Illustration */}
                <div className="hidden md:flex w-1/2 bg-[#FFD059] border-l-4 border-[#4E361E] items-center justify-center p-8 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4E361E_2px,transparent_2px)] [background-size:16px_16px]"></div>
                    <img
                        src={registerCharacter}
                        alt="Anime register character"
                        className="w-full max-w-[320px] object-contain drop-shadow-[8px_8px_0px_rgba(78,54,30,0.15)] relative z-10 animate-pulse-slow"
                        style={{ animationDuration: "6s" }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Register;