import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    Plus,
    Edit2,
    Trash2,
    Tv,
    Film,
    ArrowLeft,
    LogOut,
    Users,
    CheckCircle2,
    AlertTriangle,
    X,
    Clock,
    Database,
    Search,
    Loader as LoadingIcon
} from "lucide-react";
import toast from "react-hot-toast";

// APIs & Redux
import { getAnimeList, createAnime, updateAnime, deleteAnime } from "../api/anime";
import { getUserProfiles, logout as logoutAPI } from "../api/auth";
import { logout as logoutRedux } from "../store/authSlice";

// Components
import { Input, Button } from "../components";
import logoSmaller from "../assets/logo-smaller.png";
import posterFallback from "../assets/poster-fallback.jpg";

function AdminDashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.auth);

    // Navigation Tabs
    const [activeTab, setActiveTab] = useState("anime"); // 'anime' or 'users'

    // Anime List States
    const [animeList, setAnimeList] = useState([]);
    const [cursor, setCursor] = useState("");
    const [nextCursor, setNextCursor] = useState(null);
    const [animeLoading, setAnimeLoading] = useState(false);
    const [animeLoadingMore, setAnimeLoadingMore] = useState(false);
    const [animeSearch, setAnimeSearch] = useState("");

    // Users List States
    const [usersList, setUsersList] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [userSearch, setUserSearch] = useState("");

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAnimeId, setSelectedAnimeId] = useState(null);

    // Form States
    const [animeForm, setAnimeForm] = useState({
        title: "",
        description: "",
        releaseYear: "",
        genre: "",
        tags: "",
        trailer: "",
        isSeries: false,
    });
    const [posterFile, setPosterFile] = useState(null);
    const [posterPreview, setPosterPreview] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);

    // Fetch Anime Directory
    const fetchAnime = async (reset = false) => {
        const currentCursor = reset ? "" : cursor;
        if (reset) {
            setAnimeLoading(true);
        } else {
            setAnimeLoadingMore(true);
        }

        try {
            const response = await getAnimeList(10, currentCursor);
            if (response && response.data) {
                const fetched = response.data.data || [];
                const next = response.data.cursor;

                if (reset) {
                    setAnimeList(fetched);
                } else {
                    setAnimeList((prev) => [...prev, ...fetched]);
                }
                setNextCursor(next);
                setCursor(next || "");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to load anime entries.");
        } finally {
            setAnimeLoading(false);
            setAnimeLoadingMore(false);
        }
    };

    // Fetch User Profiles
    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const response = await getUserProfiles();
            if (response && response.data) {
                setUsersList(response.data);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to fetch user accounts.");
        } finally {
            setUsersLoading(false);
        }
    };

    useEffect(() => {
        fetchAnime(true);
    }, []);

    useEffect(() => {
        if (activeTab === "users") {
            fetchUsers();
        }
    }, [activeTab]);

    // Handle Logout
    const handleLogout = async () => {
        const loadingToast = toast.loading("Logging out...");
        try {
            await logoutAPI();
            dispatch(logoutRedux());
            toast.success("Logged out successfully!", { id: loadingToast });
            navigate("/login");
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to log out.", { id: loadingToast });
        }
    };

    // Form inputs change handlers
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAnimeForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handlePosterChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPosterFile(file);
            setPosterPreview(URL.createObjectURL(file));
            setFormErrors((prev) => ({ ...prev, poster: "" }));
        }
    };

    const validateForm = (isEdit = false) => {
        const errors = {};
        if (!animeForm.title.trim()) errors.title = "Title is required";
        if (!animeForm.genre.trim()) errors.genre = "Genre is required";
        if (!animeForm.releaseYear) {
            errors.releaseYear = "Release Year is required";
        } else if (isNaN(animeForm.releaseYear)) {
            errors.releaseYear = "Must be a valid year number";
        }
        if (!isEdit && !posterFile) {
            errors.poster = "Poster file is required";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // CRUD: CREATE
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm(false)) return;

        setSubmitLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", animeForm.title.trim());
            formData.append("description", animeForm.description.trim());
            formData.append("releaseYear", animeForm.releaseYear);
            formData.append("genre", animeForm.genre.trim());
            formData.append("tags", animeForm.tags);
            formData.append("isSeries", animeForm.isSeries);
            formData.append("trailer", animeForm.trailer.trim());
            formData.append("poster", posterFile);

            await createAnime(formData);
            toast.success("Anime entry created successfully! background optimizing poster.");
            setIsAddModalOpen(false);

            // Reset
            setAnimeForm({
                title: "",
                description: "",
                releaseYear: "",
                genre: "",
                tags: "",
                trailer: "",
                isSeries: false,
            });
            setPosterFile(null);
            setPosterPreview(null);

            // Reload
            fetchAnime(true);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to create anime entry.");
        } finally {
            setSubmitLoading(false);
        }
    };

    // Open Edit Modal & Populate Form
    const openEditModal = (anime) => {
        setSelectedAnimeId(anime._id);
        setAnimeForm({
            title: anime.title || "",
            description: anime.description || "",
            releaseYear: anime.releaseYear || "",
            genre: anime.genre || "",
            tags: anime.tags ? anime.tags.join(", ") : "",
            trailer: anime.trailer || "",
            isSeries: anime.isSeries || false,
        });
        setPosterPreview(anime.poster || null);
        setFormErrors({});
        setIsEditModalOpen(true);
    };

    // CRUD: UPDATE
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm(true)) return;

        setSubmitLoading(true);
        try {
            const updatedData = {
                title: animeForm.title.trim(),
                description: animeForm.description.trim(),
                releaseYear: animeForm.releaseYear,
                genre: animeForm.genre.trim(),
                tags: animeForm.tags,
                isSeries: animeForm.isSeries,
                trailer: animeForm.trailer.trim(),
            };

            await updateAnime(selectedAnimeId, updatedData);
            toast.success("Anime information updated successfully!");
            setIsEditModalOpen(false);
            fetchAnime(true);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to update anime info.");
        } finally {
            setSubmitLoading(false);
        }
    };

    // CRUD: DELETE
    const handleDelete = async (animeId, animeTitle) => {
        if (!window.confirm(`Are you sure you want to permanently delete "${animeTitle}"?`)) return;

        const deleteToast = toast.loading("Deleting entry...");
        try {
            await deleteAnime(animeId);
            toast.success("Anime deleted successfully!", { id: deleteToast });
            setAnimeList((prev) => prev.filter((item) => item._id !== animeId));
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to delete anime entry.", { id: deleteToast });
        }
    };

    // Render Processing Status Badge
    const renderProcessingStatus = (status, errorMsg) => {
        switch (status) {
            case "processed":
                return (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-100 border border-green-400 px-2 py-0.5 rounded-full w-fit">
                        <CheckCircle2 size={12} /> Processed
                    </span>
                );
            case "processing":
                return (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 border border-amber-400 px-2 py-0.5 rounded-full w-fit animate-pulse">
                        <LoadingIcon size={12} className="animate-spin" /> Optimizing
                    </span>
                );
            case "failed":
                return (
                    <span
                        className="flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100 border border-red-400 px-2 py-0.5 rounded-full w-fit cursor-help"
                        title={errorMsg || "Image conversion failed"}
                    >
                        <AlertTriangle size={12} /> Failed
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-gray-700 bg-gray-150 border border-gray-400 px-2 py-0.5 rounded-full w-fit">
                        <Clock size={12} /> Pending
                    </span>
                );
        }
    };

    // Local Search Filtering
    const filteredAnimeList = animeList.filter((anime) =>
        anime.title.toLowerCase().includes(animeSearch.toLowerCase()) ||
        (anime.genre && anime.genre.toLowerCase().includes(animeSearch.toLowerCase()))
    );

    const filteredUsersList = usersList.filter((user) =>
        user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        (user.role && user.role.toLowerCase().includes(userSearch.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#FFEBB8] text-[#4E361E] pb-24 font-poppins relative">
            {/* Admin Header */}
            <header className="px-6 py-6 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center border-b-4 border-[#4E361E] gap-4">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
                    <img src={logoSmaller} alt="Logo" className="h-10 w-auto" />
                    <span className="font-extrabold text-2xl font-outfit uppercase tracking-tight">Admin Console</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        onClick={() => navigate("/home")}
                        className="font-bold uppercase text-xs border-2 border-[#4E361E] px-4 py-2.5 bg-white hover:bg-gray-100 rounded-md shadow-[2px_2px_0px_0px_#4E361E] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        <ArrowLeft size={14} /> Back to App
                    </button>
                    <button
                        onClick={handleLogout}
                        className="font-bold uppercase text-xs border-2 border-[#4E361E] px-4 py-2.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md shadow-[2px_2px_0px_0px_#4E361E] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        <LogOut size={14} /> Log Out
                    </button>
                </div>
            </header>

            {/* Dashboard Container */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                
                {/* Admin Overview banner */}
                <div className="bg-white border-4 border-[#4E361E] rounded-xl p-6 mb-8 shadow-[6px_6px_0px_0px_#4E361E] flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold font-outfit uppercase tracking-wide mb-1">
                            System Control Center
                        </h1>
                        <p className="text-sm text-[#4E361E]/70 font-medium">
                            Logged in as: <strong className="text-[#4E361E] underline">{userData?.username}</strong> ({userData?.email})
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab("anime")}
                            className={`font-bold font-outfit uppercase px-6 py-3 border-4 border-[#4E361E] rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                                activeTab === "anime"
                                    ? "bg-[#FFD059] shadow-none translate-x-[2px] translate-y-[2px]"
                                    : "bg-white hover:bg-[#FFEBB8]/20 shadow-[4px_4px_0px_0px_#4E361E]"
                            }`}
                        >
                            <Database size={18} /> Anime Directory
                        </button>
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`font-bold font-outfit uppercase px-6 py-3 border-4 border-[#4E361E] rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                                activeTab === "users"
                                    ? "bg-[#FFD059] shadow-none translate-x-[2px] translate-y-[2px]"
                                    : "bg-white hover:bg-[#FFEBB8]/20 shadow-[4px_4px_0px_0px_#4E361E]"
                            }`}
                        >
                            <Users size={18} /> User Accounts
                        </button>
                    </div>
                </div>

                {/* TAB 1: ANIME DIRECTORY */}
                {activeTab === "anime" && (
                    <div className="bg-white border-4 border-[#4E361E] rounded-xl p-6 shadow-[6px_6px_0px_0px_#4E361E] space-y-6">
                        
                        {/* Directory Controls */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full md:w-96">
                                <input
                                    type="text"
                                    value={animeSearch}
                                    onChange={(e) => setAnimeSearch(e.target.value)}
                                    placeholder="Quick filter by title or genre..."
                                    className="w-full h-11 pl-10 pr-4 rounded-md border-4 border-[#4E361E] outline-none font-medium bg-[#FFEBB8]/10 focus:bg-white"
                                />
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E361E]/60" />
                            </div>

                            <button
                                onClick={() => {
                                    setAnimeForm({
                                        title: "",
                                        description: "",
                                        releaseYear: "",
                                        genre: "",
                                        tags: "",
                                        trailer: "",
                                        isSeries: false,
                                    });
                                    setPosterFile(null);
                                    setPosterPreview(null);
                                    setFormErrors({});
                                    setIsAddModalOpen(true);
                                }}
                                className="bg-[#FFD059] hover:bg-[#F5C23E] text-[#4E361E] border-4 border-[#4E361E] font-bold font-outfit uppercase px-6 h-11 rounded-md shadow-[3px_3px_0px_0px_#4E361E] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto"
                            >
                                <Plus size={18} /> Add New Anime
                            </button>
                        </div>

                        {/* Table */}
                        {animeLoading ? (
                            <div className="py-20 flex justify-center items-center">
                                <div className="animate-spin text-[#4E361E]"><LoadingIcon size={40} /></div>
                            </div>
                        ) : filteredAnimeList.length === 0 ? (
                            <div className="py-16 text-center border-4 border-dashed border-[#4E361E]/20 rounded-lg">
                                <p className="font-bold text-lg">No anime records match your filter.</p>
                                <p className="text-sm text-gray-500 font-poppins mt-1">Add a new entry or clear the search criteria.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b-4 border-[#4E361E] bg-[#FFEBB8]/30">
                                            <th className="p-3 font-bold font-outfit uppercase text-xs w-20">Poster</th>
                                            <th className="p-3 font-bold font-outfit uppercase text-xs">Title</th>
                                            <th className="p-3 font-bold font-outfit uppercase text-xs">Genre</th>
                                            <th className="p-3 font-bold font-outfit uppercase text-xs">Year</th>
                                            <th className="p-3 font-bold font-outfit uppercase text-xs">Format</th>
                                            <th className="p-3 font-bold font-outfit uppercase text-xs">Processing</th>
                                            <th className="p-3 font-bold font-outfit uppercase text-xs text-center w-28">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-[#4E361E]/10">
                                        {filteredAnimeList.map((anime) => (
                                            <tr key={anime._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-3">
                                                    <div className="w-12 h-16 rounded border-2 border-[#4E361E] overflow-hidden bg-[#FFEBB8] shadow-[1px_1px_0px_0px_#4E361E]">
                                                        <img
                                                            src={anime.poster || posterFallback}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-3 font-semibold font-poppins text-sm max-w-xs truncate">
                                                    {anime.title}
                                                </td>
                                                <td className="p-3 text-xs font-bold text-gray-600">
                                                    {anime.genre || "N/A"}
                                                </td>
                                                <td className="p-3 text-xs font-bold font-poppins">
                                                    {anime.releaseYear || "N/A"}
                                                </td>
                                                <td className="p-3">
                                                    <span className="flex items-center gap-1 text-[11px] font-bold text-gray-700 bg-gray-100 border border-gray-300 px-2 py-0.5 rounded w-fit">
                                                        {anime.isSeries ? <Tv size={12} /> : <Film size={12} />}
                                                        {anime.isSeries ? "Series" : "Movie"}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    {renderProcessingStatus(anime.processing?.status, anime.processing?.error)}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => openEditModal(anime)}
                                                            className="p-1.5 border-2 border-[#4E361E] bg-[#FFD059]/40 hover:bg-[#FFD059] rounded cursor-pointer transition-colors shadow-[1px_1px_0px_0px_#4E361E]"
                                                            title="Edit Info"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(anime._id, anime.title)}
                                                            className="p-1.5 border-2 border-[#4E361E] bg-red-50 hover:bg-red-200 text-red-700 rounded cursor-pointer transition-colors shadow-[1px_1px_0px_0px_#4E361E]"
                                                            title="Delete Entry"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Paginate */}
                        {nextCursor && (
                            <div className="flex justify-center pt-4 border-t-2 border-[#4E361E]/5">
                                <button
                                    onClick={() => fetchAnime(false)}
                                    disabled={animeLoadingMore}
                                    className="bg-white hover:bg-gray-50 text-[#4E361E] border-4 border-[#4E361E] font-bold font-outfit uppercase px-6 py-2 rounded-md shadow-[3px_3px_0px_0px_#4E361E] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer text-sm"
                                >
                                    {animeLoadingMore && <LoadingIcon size={14} className="animate-spin" />}
                                    Load More Records
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: USER ACCOUNTS */}
                {activeTab === "users" && (
                    <div className="bg-white border-4 border-[#4E361E] rounded-xl p-6 shadow-[6px_6px_0px_0px_#4E361E] space-y-6">
                        
                        {/* User search controls */}
                        <div className="flex justify-between items-center">
                            <div className="relative w-full md:w-96">
                                <input
                                    type="text"
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    placeholder="Search by username, email or role..."
                                    className="w-full h-11 pl-10 pr-4 rounded-md border-4 border-[#4E361E] outline-none font-medium bg-[#FFEBB8]/10 focus:bg-white"
                                />
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E361E]/60" />
                            </div>
                        </div>

                        {/* Table */}
                        {usersLoading ? (
                            <div className="py-20 flex justify-center items-center">
                                <div className="animate-spin text-[#4E361E]"><LoadingIcon size={40} /></div>
                            </div>
                        ) : filteredUsersList.length === 0 ? (
                            <div className="py-16 text-center border-4 border-dashed border-[#4E361E]/20 rounded-lg">
                                <p className="font-bold text-lg">No user accounts found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b-4 border-[#4E361E] bg-[#FFEBB8]/30">
                                            <th className="p-3 font-bold font-outfit uppercase text-xs w-16">Avatar</th>
                                            <th className="p-3 font-bold font-outfit uppercase text-xs">Username</th>
                                            <th className="p-3 font-bold font-outfit uppercase text-xs">Email</th>
                                            <th className="p-3 font-bold font-outfit uppercase text-xs">Role</th>
                                            <th className="p-3 font-bold font-outfit uppercase text-xs">Verified</th>
                                            <th className="p-3 font-bold font-outfit uppercase text-xs">Member Since</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-[#4E361E]/10">
                                        {filteredUsersList.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-3">
                                                    <div className="w-10 h-10 rounded-full border-2 border-[#4E361E] overflow-hidden bg-white shadow-[1px_1px_0px_0px_#4E361E] flex items-center justify-center font-bold text-xs">
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            user.username[0]?.toUpperCase()
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3 font-semibold font-poppins text-sm uppercase">
                                                    {user.username}
                                                </td>
                                                <td className="p-3 text-sm font-poppins text-gray-600">
                                                    {user.email}
                                                </td>
                                                <td className="p-3 text-xs">
                                                    <span className={`font-bold border-2 border-[#4E361E] px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#4E361E] ${
                                                        user.role === "admin" ? "bg-[#FFD059]" : "bg-gray-100"
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-xs">
                                                    {user.isEmailVerified ? (
                                                        <span className="text-green-700 font-bold">Yes</span>
                                                    ) : (
                                                        <span className="text-red-500 font-bold">No</span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-xs font-poppins text-gray-500">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* ADD ANIME DIALOG MODAL */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white border-4 border-[#4E361E] rounded-xl max-w-lg w-full p-6 shadow-[8px_8px_0px_0px_#4E361E] relative my-8">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-4 right-4 bg-[#FFEBB8] hover:bg-[#FFD059] border-2 border-[#4E361E] rounded p-1 cursor-pointer transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <h2 className="text-2xl font-extrabold text-[#4E361E] font-outfit uppercase tracking-tight mb-4">
                            Create New Anime Entry
                        </h2>

                        <form onSubmit={handleAddSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                            <Input
                                label="Title"
                                name="title"
                                value={animeForm.title}
                                onChange={handleInputChange}
                                placeholder="e.g. Hunter x Hunter"
                                error={formErrors.title}
                                inputClass="border-[#4E361E] text-sm h-11"
                                labelClass="text-xs"
                            />

                            <div className="flex flex-col gap-1">
                                <label className="font-bold font-outfit uppercase text-xs">Description</label>
                                <textarea
                                    name="description"
                                    value={animeForm.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter details..."
                                    rows="3"
                                    className="border-4 border-[#4E361E] w-full rounded-md shadow-[2px_2px_0px_0px_#4E361E] outline-none p-2 font-poppins text-sm bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Release Year"
                                    name="releaseYear"
                                    value={animeForm.releaseYear}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 2011"
                                    error={formErrors.releaseYear}
                                    inputClass="border-[#4E361E] text-sm h-11"
                                    labelClass="text-xs"
                                />
                                <Input
                                    label="Genre"
                                    name="genre"
                                    value={animeForm.genre}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Adventure"
                                    error={formErrors.genre}
                                    inputClass="border-[#4E361E] text-sm h-11"
                                    labelClass="text-xs"
                                />
                            </div>

                            <Input
                                label="Tags (comma separated)"
                                name="tags"
                                value={animeForm.tags}
                                onChange={handleInputChange}
                                placeholder="e.g. Magic, Action, Fighting"
                                inputClass="border-[#4E361E] text-sm h-11"
                                labelClass="text-xs"
                            />

                            <Input
                                label="Youtube Trailer URL"
                                name="trailer"
                                value={animeForm.trailer}
                                onChange={handleInputChange}
                                placeholder="e.g. https://www.youtube.com/watch?v=..."
                                inputClass="border-[#4E361E] text-sm h-11"
                                labelClass="text-xs"
                            />

                            {/* isSeries Toggle */}
                            <div className="flex items-center gap-3 py-1">
                                <input
                                    type="checkbox"
                                    id="isSeries"
                                    name="isSeries"
                                    checked={animeForm.isSeries}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 rounded border-2 border-[#4E361E] text-[#F5C23E] focus:ring-0 cursor-pointer"
                                />
                                <label htmlFor="isSeries" className="font-bold font-outfit uppercase text-xs cursor-pointer select-none">
                                    Is TV Series (Check if Series, leave unchecked if Movie)
                                </label>
                            </div>

                            {/* File Upload */}
                            <div className="flex flex-col gap-1 py-1">
                                <span className="font-bold font-outfit uppercase text-xs">Poster Poster (Image File)</span>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-16 rounded border-2 border-[#4E361E] overflow-hidden bg-[#FFEBB8] shadow-[2px_2px_0px_0px_#4E361E] flex items-center justify-center">
                                        {posterPreview ? (
                                            <img src={posterPreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[#4E361E]/50 text-[10px] font-bold font-poppins">No File</span>
                                        )}
                                    </div>
                                    <label className="cursor-pointer bg-[#FFD059] hover:bg-[#F5C23E] border-2 border-[#4E361E] text-[#4E361E] font-bold font-poppins text-xs px-3 py-2 rounded-md shadow-[2px_2px_0px_0px_#4E361E] transition-all">
                                        Choose File
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePosterChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                {formErrors.poster && (
                                    <span className="text-red-500 text-xs font-poppins">{formErrors.poster}</span>
                                )}
                            </div>

                            <Button
                                type="submit"
                                loading={submitLoading}
                                buttonClass="bg-[#FFD059] hover:bg-[#F5C23E] text-[#4E361E] border-4 border-[#4E361E] shadow-[4px_4px_0px_0px_#4E361E] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer text-base h-12 mt-4"
                            >
                                Submit Record
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT ANIME DIALOG MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white border-4 border-[#4E361E] rounded-xl max-w-lg w-full p-6 shadow-[8px_8px_0px_0px_#4E361E] relative my-8">
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-4 right-4 bg-[#FFEBB8] hover:bg-[#FFD059] border-2 border-[#4E361E] rounded p-1 cursor-pointer transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <h2 className="text-2xl font-extrabold text-[#4E361E] font-outfit uppercase tracking-tight mb-4">
                            Edit Anime Details
                        </h2>

                        <form onSubmit={handleEditSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                            <Input
                                label="Title"
                                name="title"
                                value={animeForm.title}
                                onChange={handleInputChange}
                                placeholder="e.g. Hunter x Hunter"
                                error={formErrors.title}
                                inputClass="border-[#4E361E] text-sm h-11"
                                labelClass="text-xs"
                            />

                            <div className="flex flex-col gap-1">
                                <label className="font-bold font-outfit uppercase text-xs">Description</label>
                                <textarea
                                    name="description"
                                    value={animeForm.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter details..."
                                    rows="3"
                                    className="border-4 border-[#4E361E] w-full rounded-md shadow-[2px_2px_0px_0px_#4E361E] outline-none p-2 font-poppins text-sm bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Release Year"
                                    name="releaseYear"
                                    value={animeForm.releaseYear}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 2011"
                                    error={formErrors.releaseYear}
                                    inputClass="border-[#4E361E] text-sm h-11"
                                    labelClass="text-xs"
                                />
                                <Input
                                    label="Genre"
                                    name="genre"
                                    value={animeForm.genre}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Adventure"
                                    error={formErrors.genre}
                                    inputClass="border-[#4E361E] text-sm h-11"
                                    labelClass="text-xs"
                                />
                            </div>

                            <Input
                                label="Tags (comma separated)"
                                name="tags"
                                value={animeForm.tags}
                                onChange={handleInputChange}
                                placeholder="e.g. Magic, Action, Fighting"
                                inputClass="border-[#4E361E] text-sm h-11"
                                labelClass="text-xs"
                            />

                            <Input
                                label="Youtube Trailer URL"
                                name="trailer"
                                value={animeForm.trailer}
                                onChange={handleInputChange}
                                placeholder="e.g. https://www.youtube.com/watch?v=..."
                                inputClass="border-[#4E361E] text-sm h-11"
                                labelClass="text-xs"
                            />

                            {/* isSeries Toggle */}
                            <div className="flex items-center gap-3 py-1">
                                <input
                                    type="checkbox"
                                    id="isSeriesEdit"
                                    name="isSeries"
                                    checked={animeForm.isSeries}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 rounded border-2 border-[#4E361E] text-[#F5C23E] focus:ring-0 cursor-pointer"
                                />
                                <label htmlFor="isSeriesEdit" className="font-bold font-outfit uppercase text-xs cursor-pointer select-none">
                                    Is TV Series (Check if Series, leave unchecked if Movie)
                                </label>
                            </div>

                            {/* Readonly Poster display */}
                            <div className="flex flex-col gap-1 py-1">
                                <span className="font-bold font-outfit uppercase text-xs">Current Poster</span>
                                <div className="w-14 h-16 rounded border-2 border-[#4E361E] overflow-hidden bg-[#FFEBB8] shadow-[2px_2px_0px_0px_#4E361E] flex items-center justify-center">
                                    {posterPreview ? (
                                        <img src={posterPreview} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[#4E361E]/50 text-[10px] font-bold">No Image</span>
                                    )}
                                </div>
                                <span className="text-[10px] text-gray-500 font-poppins mt-1">Updating poster file via edit is currently disabled. Delete and recreate if poster update is required.</span>
                            </div>

                            <Button
                                type="submit"
                                loading={submitLoading}
                                buttonClass="bg-[#FFD059] hover:bg-[#F5C23E] text-[#4E361E] border-4 border-[#4E361E] shadow-[4px_4px_0px_0px_#4E361E] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer text-base h-12 mt-4"
                            >
                                Save Changes
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
