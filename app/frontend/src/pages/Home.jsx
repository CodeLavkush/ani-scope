import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { getAnimeList } from "../api/anime";
import { addToWatchlist, removeFromWatchlist, getWatchlist } from "../api/watchlist";
import { createReview } from "../api/review";
import posterFallback from "../assets/dummy/poster.jpg";
import largerlogo from "../assets/logo-larger.png";
import smallerlogo from "../assets/logo-smaller.png";
import ToggleMenu from "../components/ToggleMenu";
import Input from "../components/Input";

export default function Home() {
    const navigate = useNavigate();
    const [featuredAnime, setFeaturedAnime] = useState(null);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [reviewContent, setReviewContent] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);

    // Default static data if database is empty
    const defaultData = {
        _id: "your_name_fallback",
        year: "2016",
        genre: "Romance",
        isSeries: false,
        title: "Your Name",
        description:
            "Two teenagers share a profound, magical connection upon discovering they are swapping bodies. Things manage to become even more complicated when the boy and girl decide to meet in person.",
        tags: ["Magical", "Teenage", "High School"],
        trailer: "x7uLutVRBfI", // Youtube video ID
        poster: posterFallback,
    };

    const data = featuredAnime || defaultData;

    useEffect(() => {
        // Fetch first anime from database
        getAnimeList(1)
            .then((res) => {
                if (res && res.data && res.data.data && res.data.data.length > 0) {
                    const anime = res.data.data[0];
                    setFeaturedAnime({
                        _id: anime._id,
                        year: anime.releaseYear || "N/A",
                        genre: anime.genre || "N/A",
                        isSeries: anime.isSeries,
                        title: anime.title,
                        description: anime.description || "",
                        tags: anime.tags || [],
                        trailer: parseYoutubeId(anime.trailer) || "x7uLutVRBfI",
                        poster: anime.poster || posterFallback,
                    });
                }
            })
            .catch((err) => {
                console.error("Failed to load featured anime:", err);
            });
    }, []);

    useEffect(() => {
        if (!data._id || data._id === "your_name_fallback") return;

        // Check if featured anime is in watchlist
        getWatchlist(50)
            .then((res) => {
                if (res && res.data && res.data.items) {
                    const found = res.data.items.some((item) => item.anime?._id === data._id);
                    setInWatchlist(found);
                }
            })
            .catch((err) => {
                console.error("Failed to check watchlist status:", err);
            });
    }, [data._id]);

    const parseYoutubeId = (url) => {
        if (!url) return "";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 12 ? match[2] : match && match[2].length === 11 ? match[2] : url;
    };

    const handleWatchlistToggle = async () => {
        if (data._id === "your_name_fallback") {
            toast.error("Sign in or add anime to database to save watchlists!");
            return;
        }

        try {
            if (inWatchlist) {
                await removeFromWatchlist(data._id);
                setInWatchlist(false);
                toast.success("Removed from watchlist!");
            } else {
                await addToWatchlist(data._id);
                setInWatchlist(true);
                toast.success("Added to watchlist!");
            }
        } catch (err) {
            toast.error(err.message || "Failed to update watchlist.");
        }
    };

    const handleReviewSubmit = async (e) => {
        if (e.key === "Enter" || e.type === "click") {
            if (!reviewContent.trim()) return;
            if (data._id === "your_name_fallback") {
                toast.error("Cannot review default fallback banner anime.");
                return;
            }

            setReviewLoading(true);
            try {
                await createReview(data._id, reviewContent.trim());
                toast.success("Review posted successfully!");
                setReviewContent("");
            } catch (err) {
                toast.error(err.message || "Failed to submit review.");
            } finally {
                setReviewLoading(false);
            }
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden text-white bg-black">
            {/* Background Video */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <iframe
                    className="absolute top-1/2 left-1/2 w-[125%] h-[125%] -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none opacity-60 scale-110"
                    src={`https://www.youtube.com/embed/${data.trailer}?autoplay=1&mute=1&loop=1&controls=0&playlist=${data.trailer}&showinfo=0&rel=0`}
                    title="Background trailer"
                    allow="autoplay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
            </div>

            {/* MOBILE LAYOUT */}
            <div className="md:hidden relative z-10 flex flex-col h-full justify-between pb-6 pt-4">
                {/* Mobile Header */}
                <div className="flex justify-between items-center px-6">
                    <img src={smallerlogo} alt="Logo" className="w-24 object-contain" />
                    <ToggleMenu iconClass="text-white hover:text-[#F5C23E]" />
                </div>

                {/* Floating poster like design */}
                <div className="absolute top-20 left-6 z-20">
                    <div 
                        onClick={() => data._id !== "your_name_fallback" && navigate(`/anime/${data._id}`)}
                        className="cursor-pointer group relative rounded-xl border-2 border-white/20 overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        <img
                            src={data.poster}
                            alt={data.title}
                            className="w-32 h-44 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-xs font-bold font-outfit uppercase bg-white/20 backdrop-blur-md px-2 py-1 rounded">View</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Panel */}
                <div className="w-full px-4 mt-auto">
                    <div className="rounded-2xl backdrop-blur-xl bg-black/50 border border-white/20 p-5 pt-8 space-y-3 relative shadow-2xl">
                        {/* Meta Info */}
                        <div className="flex items-center gap-3 text-xs">
                            <span className="font-bold text-[#FFD059]">{data.year}</span>
                            <span className="text-white/80">{data.genre}</span>
                            <span className="bg-[#FFD059] text-[#4E361E] px-2 py-[2px] rounded text-[10px] font-bold uppercase">
                                {data.isSeries ? "Series" : "Movie"}
                            </span>

                            <div className="ml-auto flex gap-2">
                                <button
                                    onClick={handleWatchlistToggle}
                                    className={`w-9 h-9 flex items-center justify-center rounded-full border border-white/20 transition-all ${
                                        inWatchlist ? "bg-[#FFD059] text-[#4E361E] border-[#FFD059]" : "bg-white/10 text-white hover:bg-white/20"
                                    } cursor-pointer`}
                                    aria-label="Add to watchlist"
                                >
                                    <Star size={16} fill={inWatchlist ? "currentColor" : "none"} />
                                </button>
                                <button
                                    onClick={() => data._id !== "your_name_fallback" && navigate(`/anime/${data._id}`)}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 cursor-pointer"
                                    aria-label="View reviews"
                                >
                                    <MessageSquare size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Title Display */}
                        <h2 
                            onClick={() => data._id !== "your_name_fallback" && navigate(`/anime/${data._id}`)}
                            className="text-2xl font-extrabold font-outfit uppercase tracking-wide text-white cursor-pointer hover:text-[#FFD059] transition-colors"
                        >
                            {data.title}
                        </h2>

                        {/* Description */}
                        <p className="text-xs text-white/80 leading-snug line-clamp-3">
                            {data.description}
                        </p>

                        {/* Review Input */}
                        <div className="relative">
                            <input
                                type="text"
                                name="review"
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                                onKeyDown={handleReviewSubmit}
                                placeholder="Write your review and press enter..."
                                disabled={reviewLoading}
                                className="w-full bg-white/10 text-white border border-white/20 h-10 px-3 pr-10 text-xs rounded-lg outline-none focus:border-[#FFD059] focus:bg-white/20 transition-all"
                            />
                            {reviewContent.trim() && (
                                <button
                                    onClick={handleReviewSubmit}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-[#FFD059]"
                                >
                                    Post
                                </button>
                            )}
                        </div>

                        {/* Tags */}
                        {data.tags && data.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {data.tags.map((tag, idx) => (
                                    <span key={idx} className="bg-white/10 text-white/70 px-2 py-0.5 rounded-full text-[9px] font-medium">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* DESKTOP LAYOUT */}
            <div className="hidden md:flex flex-col justify-between h-full relative z-10 px-12 py-8">
                {/* Desktop Top Bar */}
                <div className="flex justify-between items-center">
                    <img 
                        src={largerlogo} 
                        alt="AniScope" 
                        onClick={() => navigate("/home")} 
                        className="w-32 object-contain cursor-pointer transition-transform hover:scale-105" 
                    />

                    {/* Filter categories linking to explore page */}
                    <div className="flex items-center gap-8 text-sm font-bold tracking-[0.2em] text-white/70">
                        {["ADVENTURE", "ACTION", "SWORDSMAN", "COURAGE"].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => navigate(`/explore?search=${cat.toLowerCase()}`)}
                                className="hover:text-[#FFD059] transition-colors cursor-pointer relative group py-1"
                            >
                                {cat}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD059] transition-all group-hover:w-full"></span>
                            </button>
                        ))}
                    </div>

                    {/* Right Icons Stack */}
                    <div className="flex flex-col gap-4 items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-black/30 hover:border-[#FFD059] flex items-center justify-center transition-all">
                            <ToggleMenu iconClass="text-white hover:text-[#FFD059]" />
                        </div>
                        <button
                            onClick={handleWatchlistToggle}
                            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                                inWatchlist 
                                    ? "bg-[#FFD059] border-[#FFD059] text-[#4E361E]" 
                                    : "bg-black/30 border-white/20 hover:border-[#FFD059]"
                            }`}
                            title="Add to Watchlist"
                        >
                            <Star size={18} fill={inWatchlist ? "currentColor" : "none"} />
                        </button>
                        <button
                            onClick={() => data._id !== "your_name_fallback" && navigate(`/anime/${data._id}`)}
                            className="w-12 h-12 rounded-full border-2 border-white/20 bg-black/30 hover:border-[#FFD059] flex items-center justify-center transition-all cursor-pointer"
                            title="Reviews & Ratings"
                        >
                            <MessageSquare size={18} />
                        </button>
                    </div>
                </div>

                {/* Main Featured Content Block */}
                <div className="flex items-end justify-between mb-8">
                    {/* Left Details Panel */}
                    <div className="max-w-xl space-y-6">
                        <div className="flex items-center gap-4 text-sm font-bold">
                            <span className="text-[#FFD059]">{data.year}</span>
                            <span className="text-white/60">|</span>
                            <span>{data.genre}</span>
                            <span className="text-white/60">|</span>
                            <span className="bg-[#FFD059] text-[#4E361E] px-3 py-0.5 rounded text-xs font-extrabold uppercase tracking-wide">
                                {data.isSeries ? "Series" : "Movie"}
                            </span>
                        </div>

                        <h1 
                            onClick={() => data._id !== "your_name_fallback" && navigate(`/anime/${data._id}`)}
                            className="text-7xl font-extrabold tracking-wider leading-tight uppercase font-outfit select-none cursor-pointer hover:text-[#FFD059] transition-all duration-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                        >
                            {data.title}
                        </h1>

                        <p className="text-white/80 leading-relaxed text-sm max-w-lg font-poppins drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] line-clamp-4">
                            {data.description}
                        </p>

                        {/* Tags */}
                        {data.tags && data.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {data.tags.map((tag, idx) => (
                                    <span 
                                        key={idx} 
                                        onClick={() => navigate(`/explore?search=${tag.toLowerCase()}`)}
                                        className="bg-white/10 hover:bg-[#FFD059] hover:text-[#4E361E] text-white/85 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all border border-white/10"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Poster Showcase Card */}
                    <div 
                        onClick={() => data._id !== "your_name_fallback" && navigate(`/anime/${data._id}`)}
                        className="w-56 h-80 rounded-2xl overflow-hidden border-4 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer group relative transition-all duration-500 hover:scale-105 hover:border-[#FFD059]"
                    >
                        <img 
                            src={data.poster} 
                            alt={data.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition-opacity duration-300">
                            <span className="text-[#FFD059] font-outfit uppercase font-bold text-sm">View Details</span>
                            <span className="text-white/70 text-xs font-poppins">Reviews & Ratings</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
