import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Film, Bookmark, Loader as LoadingIcon } from "lucide-react";
import toast from "react-hot-toast";
import { getWatchlist, removeFromWatchlist } from "../api/watchlist";
import { ToggleMenu } from "../components";
import logoSmaller from "../assets/logo-smaller.png";
import posterFallback from "../assets/poster-fallback.jpg";

export default function Watchlist() {
    const navigate = useNavigate();
    const [watchlist, setWatchlist] = useState([]);
    const [cursor, setCursor] = useState("");
    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchWatchlist = async (reset = false) => {
        const currentCursor = reset ? "" : cursor;
        if (reset) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const response = await getWatchlist(16, currentCursor);
            if (response && response.data) {
                const fetched = response.data.items || [];
                const next = response.data.nextCursor;

                if (reset) {
                    setWatchlist(fetched);
                } else {
                    setWatchlist((prev) => [...prev, ...fetched]);
                }
                setNextCursor(next);
                setCursor(next || "");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load watchlist.");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchWatchlist(true);
    }, []);

    const handleRemove = async (e, animeId) => {
        e.stopPropagation(); // Stop navigation trigger
        if (!window.confirm("Remove this anime from your watchlist?")) return;

        try {
            await removeFromWatchlist(animeId);
            toast.success("Removed from watchlist!");
            setWatchlist((prev) => prev.filter((item) => item.anime?._id !== animeId));
        } catch (error) {
            toast.error(error.message || "Failed to remove item.");
        }
    };

    return (
        <div className="min-h-screen bg-[#FFEBB8] text-[#4E361E] pb-24 font-poppins">
            {/* Header section */}
            <header className="px-6 py-6 max-w-7xl mx-auto flex justify-between items-center border-b-4 border-[#4E361E] mb-12">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
                    <img src={logoSmaller} alt="Logo" className="h-10 w-auto" />
                    <span className="font-extrabold text-2xl font-outfit uppercase tracking-tight hidden sm:inline">My Watchlist</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/explore")}
                        className="hidden md:block font-bold uppercase text-sm border-2 border-[#4E361E] px-4 py-2 bg-[#FFD059] hover:bg-[#F5C23E] rounded-md shadow-[2px_2px_0px_0px_#4E361E] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    >
                        Explore Feed
                    </button>
                    <div className="w-10 h-10 rounded-full border-2 border-[#4E361E] bg-[#FFD059] flex items-center justify-center shadow-[2px_2px_0px_0px_#4E361E]">
                        <ToggleMenu iconClass="text-[#4E361E] hover:text-[#4E361E]/80" />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6">
                {loading ? (
                    <div className="w-full py-20 flex justify-center items-center">
                        <div className="animate-spin text-[#4E361E]"><LoadingIcon size={48} /></div>
                    </div>
                ) : watchlist.length === 0 ? (
                    <div className="bg-white border-4 border-[#4E361E] rounded-xl p-16 text-center shadow-[6px_6px_0px_0px_#4E361E] max-w-md mx-auto">
                        <Bookmark size={48} className="mx-auto text-[#F5C23E] mb-4" />
                        <p className="text-xl font-bold font-outfit uppercase mb-2">Watchlist is Empty</p>
                        <p className="text-sm text-gray-500 font-poppins mb-6">
                            Start explore animes and add your favorite ones to the watchlist!
                        </p>
                        <button
                            onClick={() => navigate("/explore")}
                            className="bg-[#F5C23E] hover:bg-[#FFD059] text-[#4E361E] border-4 border-[#4E361E] font-bold font-outfit uppercase px-6 py-3 rounded-md shadow-[4px_4px_0px_0px_#4E361E] cursor-pointer"
                        >
                            Explore Anime List
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {watchlist.map((item) => {
                                const anime = item.anime;
                                if (!anime) return null;
                                return (
                                    <div
                                        key={item._id}
                                        onClick={() => navigate(`/anime/${anime._id}`)}
                                        className="bg-white border-4 border-[#4E361E] rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_#4E361E] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#4E361E] transition-all duration-200 cursor-pointer group relative flex flex-col"
                                    >
                                        {/* Image Showcase */}
                                        <div className="relative aspect-[3/4] border-b-4 border-[#4E361E] overflow-hidden bg-[#FFEBB8]">
                                            <img
                                                src={anime.poster || posterFallback}
                                                alt={anime.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />

                                            {/* Type Badge */}
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-[#FFD059] text-[#4E361E] border-2 border-[#4E361E] font-extrabold uppercase text-[10px] px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#4E361E]">
                                                    {anime.isSeries ? "Series" : "Movie"}
                                                </span>
                                            </div>

                                            {/* Remove overlay button */}
                                            <button
                                                onClick={(e) => handleRemove(e, anime._id)}
                                                className="absolute top-3 right-3 bg-red-100 hover:bg-red-200 border-2 border-red-600 text-red-600 rounded p-1.5 shadow-[2px_2px_0px_0px_#991b1b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Remove from watchlist"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        {/* Content details */}
                                        <div className="p-4 flex-grow flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-base font-extrabold font-outfit uppercase leading-tight line-clamp-2 text-[#4E361E] group-hover:text-[#F5C23E] transition-colors">
                                                    {anime.title}
                                                </h3>
                                            </div>
                                            <div className="flex justify-between items-center mt-3 text-[10px] font-bold text-gray-500 font-poppins">
                                                <span>Added: {new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination load more */}
                        {nextCursor && (
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={() => fetchWatchlist(false)}
                                    disabled={loadingMore}
                                    className="bg-white hover:bg-[#FFEBB8] text-[#4E361E] border-4 border-[#4E361E] font-bold font-outfit uppercase px-8 py-3.5 rounded-md shadow-[4px_4px_0px_0px_#4E361E] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-100 cursor-pointer flex items-center gap-2"
                                >
                                    {loadingMore && <LoadingIcon size={16} className="animate-spin" />}
                                    Load More Saved Items
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}