import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Edit, Save, Trash2, X, Upload, Calendar, Mail, User as UserIcon, Loader as LoadingIcon } from "lucide-react";
import toast from "react-hot-toast";
import { updateUserProfile, deleteUserProfile } from "../api/auth";
import { login as loginRedux, logout as logoutRedux } from "../store/authSlice";
import { ToggleMenu, Input, Button } from "../components";
import logoSmaller from "../assets/logo-smaller.png";

export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.auth);

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: userData?.username || "",
        age: userData?.age || "",
        gender: userData?.gender || "male",
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.age) {
            newErrors.age = "Age is required";
        } else if (isNaN(formData.age) || parseInt(formData.age) <= 0) {
            newErrors.age = "Please enter a valid age";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const data = new FormData();
            data.append("username", formData.username.trim());
            data.append("age", formData.age);
            data.append("gender", formData.gender);
            if (avatarFile) {
                data.append("avatar", avatarFile);
            }

            const response = await updateUserProfile(data);
            if (response && response.data) {
                toast.success("Profile updated successfully!");
                dispatch(loginRedux(response.data));
                setIsEditing(false);
                setAvatarFile(null);
                setAvatarPreview(null);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to update profile.");
            setErrors({ api: error.message || "Update failed." });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("WARNING: Are you absolutely sure you want to delete your account? This action is permanent and will delete all your watchlist entries and reviews.")) {
            return;
        }

        try {
            await deleteUserProfile();
            toast.success("Your account has been deleted.");
            dispatch(logoutRedux());
            navigate("/login");
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to delete account.");
        }
    };

    return (
        <div className="min-h-screen bg-[#FFEBB8] text-[#4E361E] pb-24 font-poppins">
            {/* Header section */}
            <header className="px-6 py-6 max-w-7xl mx-auto flex justify-between items-center border-b-4 border-[#4E361E] mb-12">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
                    <img src={logoSmaller} alt="Logo" className="h-10 w-auto" />
                    <span className="font-extrabold text-2xl font-outfit uppercase tracking-tight hidden sm:inline">My Profile</span>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#4E361E] bg-[#FFD059] flex items-center justify-center shadow-[2px_2px_0px_0px_#4E361E]">
                    <ToggleMenu iconClass="text-[#4E361E] hover:text-[#4E361E]/80" />
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6">
                <div className="bg-white border-4 border-[#4E361E] rounded-xl p-8 shadow-[8px_8px_0px_0px_#4E361E] relative">
                    {/* Mode Toggles */}
                    <div className="absolute top-6 right-6">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-[#FFD059] hover:bg-[#F5C23E] border-2 border-[#4E361E] font-bold font-outfit uppercase text-xs px-3 py-1.5 rounded shadow-[2px_2px_0px_0px_#4E361E] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1 cursor-pointer"
                            >
                                <Edit size={14} /> Edit Details
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({
                                        username: userData?.username || "",
                                        age: userData?.age || "",
                                        gender: userData?.gender || "male",
                                    });
                                    setAvatarFile(null);
                                    setAvatarPreview(null);
                                }}
                                className="bg-white hover:bg-gray-100 border-2 border-[#4E361E] font-bold font-outfit uppercase text-xs px-3 py-1.5 rounded shadow-[2px_2px_0px_0px_#4E361E] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1 cursor-pointer"
                            >
                                <X size={14} /> Cancel
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        /* EDIT MODE */
                        <form onSubmit={handleSave} className="space-y-6 pt-4">
                            <h2 className="text-2xl font-extrabold font-outfit uppercase tracking-tight mb-6">
                                Edit Profile Settings
                            </h2>

                            {errors.api && (
                                <div className="p-3 bg-red-100 border-2 border-red-500 rounded text-red-700 text-sm">
                                    {errors.api}
                                </div>
                            )}

                            {/* Avatar selector */}
                            <div className="flex flex-col items-center gap-3 py-2">
                                <div className="w-24 h-24 rounded-full border-4 border-[#4E361E] overflow-hidden bg-[#FFEBB8] shadow-[4px_4px_0px_0px_#4E361E] relative group">
                                    <img
                                        src={avatarPreview || userData?.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${userData?.username}`}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Upload className="text-white" size={20} />
                                    </div>
                                </div>
                                <label className="cursor-pointer bg-[#FFD059] hover:bg-[#F5C23E] border-2 border-[#4E361E] text-[#4E361E] font-bold font-poppins text-xs px-3 py-2 rounded shadow-[2px_2px_0px_0px_#4E361E] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none mt-1">
                                    Upload New Picture
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <Input
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Edit username"
                                error={errors.username}
                                inputClass="border-[#4E361E] h-12"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Age"
                                    name="age"
                                    type="number"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="Age"
                                    error={errors.age}
                                    inputClass="border-[#4E361E] h-12"
                                />

                                <div className="flex flex-col gap-1">
                                    <label className="font-bold font-outfit uppercase text-sm">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="border-4 border-[#4E361E] h-12 w-full rounded-md shadow-[4px_4px_0px_0px_#4E361E] outline-none px-2 font-poppins bg-white text-[#4E361E]"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                loading={loading}
                                buttonClass="bg-[#F5C23E] hover:bg-[#FFD059] text-[#4E361E] border-4 border-[#4E361E] shadow-[4px_4px_0px_0px_#4E361E] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer h-12 text-base font-outfit uppercase tracking-wider"
                            >
                                Save Profile Settings
                            </Button>
                        </form>
                    ) : (
                        /* VIEW MODE */
                        <div className="space-y-8">
                            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b-4 border-[#4E361E]/10">
                                {/* Avatar */}
                                <div className="w-24 h-24 rounded-full border-4 border-[#4E361E] overflow-hidden bg-[#FFEBB8] shadow-[4px_4px_0px_0px_#4E361E]">
                                    <img
                                        src={userData?.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${userData?.username}`}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-center sm:text-left space-y-1">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <h2 className="text-3xl font-extrabold font-outfit uppercase tracking-tight">
                                            {userData?.username}
                                        </h2>
                                        <span className="bg-[#FFD059] border-2 border-[#4E361E] text-[10px] font-bold px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#4E361E] uppercase">
                                            {userData?.role || "user"}
                                        </span>
                                    </div>
                                    <p className="text-sm font-poppins text-[#4E361E]/60 flex items-center gap-1.5 justify-center sm:justify-start">
                                        <Mail size={14} /> {userData?.email}
                                    </p>
                                </div>
                            </div>

                            {/* User details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="border-2 border-[#4E361E] rounded-lg p-4 bg-[#FFEBB8]/10 flex items-center gap-3">
                                    <Calendar className="text-[#F5C23E]" size={24} />
                                    <div>
                                        <p className="text-xs text-[#4E361E]/50 font-bold uppercase tracking-wider">Age</p>
                                        <p className="font-extrabold text-lg">{userData?.age || "N/A"} years old</p>
                                    </div>
                                </div>
                                <div className="border-2 border-[#4E361E] rounded-lg p-4 bg-[#FFEBB8]/10 flex items-center gap-3">
                                    <UserIcon className="text-[#F5C23E]" size={24} />
                                    <div>
                                        <p className="text-xs text-[#4E361E]/50 font-bold uppercase tracking-wider">Gender</p>
                                        <p className="font-extrabold text-lg uppercase">{userData?.gender || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Extra warning actions */}
                            <div className="pt-8 border-t-4 border-[#4E361E]/10 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm text-red-600 uppercase">Danger Zone</p>
                                    <p className="text-xs text-[#4E361E]/60">Permanently delete your account and data.</p>
                                </div>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="bg-red-100 hover:bg-red-200 border-2 border-red-600 text-red-600 font-bold font-outfit uppercase text-xs px-4 py-2.5 rounded shadow-[2px_2px_0px_0px_#991b1b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer flex items-center gap-1.5 transition-colors"
                                >
                                    <Trash2 size={14} /> Delete Account
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}