import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search, Plus, Filter, X, Film, Tv, Loader as LoadingIcon } from "lucide-react";
import toast from "react-hot-toast";
import { getAnimeList, createAnime } from "../api/anime";
import { ToggleMenu, Input, Button } from "../components";
import logoSmaller from "../assets/logo-smaller.png";
import posterFallback from "../assets/dummy/poster.jpg";

export default function Explore() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { userData } = useSelector((state) => state.auth);
    const isAdmin = userData?.role === "admin";

    // State
    const [animeList, setAnimeList] = useState([]);
    const [cursor, setCursor] = useState("");
    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [typeFilter, setTypeFilter] = useState("all"); // 'all', 'series', 'movie'

    // Add Anime Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newAnimeData, setNewAnimeData] = useState({
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
    const [modalErrors, setModalErrors] = useState({});
    const [createLoading, setCreateLoading] = useState(false);

    // Available genres list for filter
    const genres = ["Action", "Adventure", "Romance", "Fantasy", "Sci-Fi", "Comedy", "Drama", "Thriller", "Horror", "Slice of Life"];

    // Fetch anime lists
    const fetchAnime = async (reset = false) => {
        const currentCursor = reset ? "" : cursor;
        if (reset) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            // Get 12 anime at a time
            const response = await getAnimeList(12, currentCursor);
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
            toast.error(error.message || "Failed to load anime feed.");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchAnime(true);
    }, []);

    // Filter local data (backend does not have direct query search filters implemented on simple cursor pagination endpoint,
    // so we apply standard filtering on client side for premium UI feel, combined with search query param)
    const filteredAnime = animeList.filter((anime) => {
        const matchesSearch = searchTerm 
            ? anime.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
              (anime.genre && anime.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (anime.tags && anime.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
            : true;
        const matchesGenre = selectedGenre 
            ? anime.genre && anime.genre.toLowerCase() === selectedGenre.toLowerCase()
            : true;
        const matchesType = typeFilter === "all"
            ? true
            : typeFilter === "series" ? anime.isSeries === true : anime.isSeries === false;

        return matchesSearch && matchesGenre && matchesType;
    });

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchParams({ search: searchTerm });
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedGenre("");
        setTypeFilter("all");
        setSearchParams({});
    };

    // Modal Handlers
    const handleModalChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewAnimeData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setModalErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handlePosterChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPosterFile(file);
            setPosterPreview(URL.createObjectURL(file));
            setModalErrors((prev) => ({ ...prev, poster: "" }));
        }
    };

    const validateModal = () => {
        const errors = {};
        if (!newAnimeData.title.trim()) errors.title = "Title is required";
        if (!newAnimeData.genre.trim()) errors.genre = "Genre is required";
        if (!newAnimeData.releaseYear) {
            errors.releaseYear = "Release Year is required";
        } else if (isNaN(newAnimeData.releaseYear)) {
            errors.releaseYear = "Must be a valid year number";
        }
        if (!posterFile) errors.poster = "Poster poster is required";
        setModalErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddAnimeSubmit = async (e) => {
        e.preventDefault();
        if (!validateModal()) return;

        setCreateLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", newAnimeData.title.trim());
            formData.append("description", newAnimeData.description.trim());
            formData.append("releaseYear", newAnimeData.releaseYear);
            formData.append("genre", newAnimeData.genre.trim());
            formData.append("tags", newAnimeData.tags);
            formData.append("isSeries", newAnimeData.isSeries);
            formData.append("trailer", newAnimeData.trailer.trim());
            formData.append("poster", posterFile);

            await createAnime(formData);
            toast.success("Anime entry created successfully! Image is being processed.");
            setIsAddModalOpen(false);
            
            // Reset modal inputs
            setNewAnimeData({
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
            
            // Reload list
            fetchAnime(true);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to create anime entry.");
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFEBB8] text-[#4E361E] pb-24 font-poppins relative">
            {/* Header section */}
            <header className="px-6 py-6 max-w-7xl mx-auto flex justify-between items-center border-b-4 border-[#4E361E]">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
                    <img src={logoSmaller} alt="Logo" className="h-10 w-auto" />
                    <span className="font-extrabold text-2xl font-outfit uppercase tracking-tight hidden sm:inline">Explore Feed</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/watchlist")}
                        className="hidden md:block font-bold uppercase text-sm border-2 border-[#4E361E] px-4 py-2 bg-[#FFD059] hover:bg-[#F5C23E] rounded-md shadow-[2px_2px_0px_0px_#4E361E] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    >
                        My Watchlist
                    </button>
                    <div className="w-10 h-10 rounded-full border-2 border-[#4E361E] bg-[#FFD059] flex items-center justify-center shadow-[2px_2px_0px_0px_#4E361E]">
                        <ToggleMenu iconClass="text-[#4E361E] hover:text-[#4E361E]/80" />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Search & Filters */}
                <div className="bg-white border-4 border-[#4E361E] rounded-xl p-6 mb-8 shadow-[6px_6px_0px_0px_#4E361E] space-y-4">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by title, genre, tags..."
                                className="w-full h-12 pl-11 pr-4 rounded-md border-4 border-[#4E361E] outline-none font-medium bg-[#FFEBB8]/20 focus:bg-white"
                            />
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4E361E]/60" />
                        </div>
                        <button
                            type="submit"
                            className="bg-[#F5C23E] hover:bg-[#FFD059] text-[#4E361E] border-4 border-[#4E361E] font-bold font-outfit uppercase px-6 h-12 rounded-md shadow-[2px_2px_0px_0px_#4E361E] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Search size={16} /> Search
                        </button>
                        {(searchTerm || selectedGenre || typeFilter !== "all") && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="bg-white border-4 border-[#4E361E] text-[#4E361E] font-bold font-outfit uppercase px-4 h-12 rounded-md hover:bg-[#FFEBB8] shadow-[2px_2px_0px_0px_#4E361E] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <X size={16} /> Clear
                            </button>
                        )}
                    </form>

                    {/* Filter Badges */}
                    <div className="flex flex-col gap-2 pt-2 border-t-2 border-[#4E361E]/10">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4E361E]/60">
                            <Filter size={12} /> Filter by Genre
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {genres.map((genre) => (
                                <button
                                    key={genre}
                                    onClick={() => setSelectedGenre(selectedGenre === genre ? "" : genre)}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 border-[#4E361E] transition-all cursor-pointer ${
                                        selectedGenre === genre
                                            ? "bg-[#4E361E] text-white shadow-none"
                                            : "bg-[#FFEBB8]/30 hover:bg-[#FFD059] shadow-[2px_2px_0px_0px_#4E361E]"
                                    }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Format filters (Series vs Movie) */}
                    <div className="flex gap-4 pt-2 border-t-2 border-[#4E361E]/10">
                        {/* Type Radio/Toggles */}
                        <div className="flex gap-2">
                            {[
                                { key: "all", label: "All Formats" },
                                { key: "series", label: "Series", icon: <Tv size={14} /> },
                                { key: "movie", label: "Movies", icon: <Film size={14} /> },
                            ].map((type) => (
                                <button
                                    key={type.key}
                                    type="button"
                                    onClick={() => setTypeFilter(type.key)}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-md border-2 border-[#4E361E] transition-all flex items-center gap-1.5 cursor-pointer ${
                                        typeFilter === type.key
                                            ? "bg-[#F5C23E] shadow-none"
                                            : "bg-white hover:bg-gray-50 shadow-[2px_2px_0px_0px_#4E361E]"
                                    }`}
                                >
                                    {type.icon}
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Loading Spinner */}
                {loading ? (
                    <div className="w-full py-20 flex justify-center items-center">
                        <div className="animate-spin text-[#4E361E]"><LoadingIcon size={48} /></div>
                    </div>
                ) : filteredAnime.length === 0 ? (
                    <div className="bg-white border-4 border-[#4E361E] rounded-xl p-16 text-center shadow-[6px_6px_0px_0px_#4E361E]">
                        <p className="text-xl font-bold font-outfit uppercase mb-2">No Anime Entries Found</p>
                        <p className="text-sm text-gray-500 font-poppins mb-6">
                            We couldn't find any entries matching your filters.
                        </p>
                        <button
                            onClick={handleClearFilters}
                            className="bg-[#F5C23E] hover:bg-[#FFD059] text-[#4E361E] border-4 border-[#4E361E] font-bold font-outfit uppercase px-6 py-3 rounded-md shadow-[4px_4px_0px_0px_#4E361E] cursor-pointer"
                        >
                            Reset Search Filters
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Anime Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredAnime.map((anime) => (
                                <div
                                    key={anime._id}
                                    onClick={() => navigate(`/anime/${anime._id}`)}
                                    className="bg-white border-4 border-[#4E361E] rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_#4E361E] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#4E361E] transition-all duration-200 cursor-pointer group flex flex-col"
                                >
                                    {/* Image Showcase */}
                                    <div className="relative aspect-[3/4] border-b-4 border-[#4E361E] overflow-hidden bg-[#FFEBB8]">
                                        <img
                                            src={anime.poster || posterFallback}
                                            alt={anime.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Status / Type badges */}
                                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                            <span className="bg-[#FFD059] text-[#4E361E] border-2 border-[#4E361E] font-extrabold uppercase text-[10px] px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#4E361E]">
                                                {anime.isSeries ? "Series" : "Movie"}
                                            </span>
                                            {anime.releaseYear && (
                                                <span className="bg-white text-[#4E361E] border-2 border-[#4E361E] font-bold text-[9px] px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#4E361E]">
                                                    {anime.releaseYear}
                                                </span>
                                            )}
                                        </div>

                                        {/* Image processing status overlay */}
                                        {anime.processing?.status === "processing" && (
                                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-3 text-center">
                                                <LoadingIcon size={24} className="animate-spin text-[#FFD059] mb-2" />
                                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Optimizing Poster...</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Information card details */}
                                    <div className="p-4 flex-grow flex flex-col justify-between">
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-bold text-[#F5C23E] uppercase tracking-wide">
                                                {anime.genre || "Genre: Unspecified"}
                                            </div>
                                            <h3 className="text-base font-extrabold font-outfit uppercase leading-tight line-clamp-2 text-[#4E361E] group-hover:text-[#F5C23E] transition-colors">
                                                {anime.title}
                                            </h3>
                                        </div>

                                        {/* Tags */}
                                        {anime.tags && anime.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {anime.tags.slice(0, 3).map((tag, idx) => (
                                                    <span key={idx} className="bg-[#FFEBB8]/40 border border-[#4E361E]/20 rounded px-1.5 py-0.5 text-[9px] font-medium text-[#4E361E]/80">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Paginate Load More */}
                        {nextCursor && (
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={() => fetchAnime(false)}
                                    disabled={loadingMore}
                                    className="bg-white hover:bg-[#FFEBB8] text-[#4E361E] border-4 border-[#4E361E] font-bold font-outfit uppercase px-8 py-3.5 rounded-md shadow-[4px_4px_0px_0px_#4E361E] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-100 cursor-pointer flex items-center gap-2"
                                >
                                    {loadingMore && <LoadingIcon size={16} className="animate-spin" />}
                                    Load More Anime
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Admin Add Anime Floating Action Button */}
            {isAdmin && (
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="fixed bottom-8 right-8 bg-[#FFD059] hover:bg-[#F5C23E] text-[#4E361E] border-4 border-[#4E361E] rounded-full p-4 shadow-[4px_4px_0px_0px_#4E361E] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer z-40 group"
                    title="Add new anime entry"
                >
                    <Plus size={32} className="group-hover:rotate-90 transition-transform duration-200" />
                </button>
            )}

            {/* Add Anime Modal Dialog */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white border-4 border-[#4E361E] rounded-xl max-w-lg w-full p-6 shadow-[8px_8px_0px_0px_#4E361E] relative my-8">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-4 right-4 bg-[#FFEBB8] hover:bg-[#FFD059] border-2 border-[#4E361E] rounded p-1 cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <h2 className="text-2xl font-extrabold text-[#4E361E] font-outfit uppercase tracking-tight mb-4">
                            Add Anime Entry
                        </h2>

                        <form onSubmit={handleAddAnimeSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                            <Input
                                label="Title"
                                name="title"
                                value={newAnimeData.title}
                                onChange={handleModalChange}
                                placeholder="e.g. Naruto Shippuden"
                                error={modalErrors.title}
                                inputClass="border-[#4E361E] text-sm h-11"
                                labelClass="text-xs"
                            />

                            <div className="flex flex-col gap-1">
                                <label className="font-bold font-outfit uppercase text-xs">Description</label>
                                <textarea
                                    name="description"
                                    value={newAnimeData.description}
                                    onChange={handleModalChange}
                                    placeholder="Enter summary..."
                                    rows="3"
                                    className="border-4 border-[#4E361E] w-full rounded-md shadow-[2px_2px_0px_0px_#4E361E] outline-none p-2 font-poppins text-sm bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Release Year"
                                    name="releaseYear"
                                    value={newAnimeData.releaseYear}
                                    onChange={handleModalChange}
                                    placeholder="e.g. 2007"
                                    error={modalErrors.releaseYear}
                                    inputClass="border-[#4E361E] text-sm h-11"
                                    labelClass="text-xs"
                                />
                                <Input
                                    label="Genre"
                                    name="genre"
                                    value={newAnimeData.genre}
                                    onChange={handleModalChange}
                                    placeholder="e.g. Action"
                                    error={modalErrors.genre}
                                    inputClass="border-[#4E361E] text-sm h-11"
                                    labelClass="text-xs"
                                />
                            </div>

                            <Input
                                label="Tags (comma separated)"
                                name="tags"
                                value={newAnimeData.tags}
                                onChange={handleModalChange}
                                placeholder="e.g. Ninja, Friendship, Fighting"
                                inputClass="border-[#4E361E] text-sm h-11"
                                labelClass="text-xs"
                            />

                            <Input
                                label="Youtube Trailer URL"
                                name="trailer"
                                value={newAnimeData.trailer}
                                onChange={handleModalChange}
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
                                    checked={newAnimeData.isSeries}
                                    onChange={handleModalChange}
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
                                {modalErrors.poster && (
                                    <span className="text-red-500 text-xs font-poppins">{modalErrors.poster}</span>
                                )}
                            </div>

                            <Button
                                type="submit"
                                loading={createLoading}
                                buttonClass="bg-[#F5C23E] hover:bg-[#FFD059] text-[#4E361E] border-4 border-[#4E361E] shadow-[4px_4px_0px_0px_#4E361E] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer text-base h-12 mt-4"
                            >
                                Submit Entry
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}