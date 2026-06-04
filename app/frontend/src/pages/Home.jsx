import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MessageSquare, ChevronUp, ChevronDown, Loader as LoadingIcon } from "lucide-react";
import toast from "react-hot-toast";
import { getAnimeList } from "../api/anime";
import { addToWatchlist, removeFromWatchlist, getWatchlist } from "../api/watchlist";
import { createReview } from "../api/review";
import posterFallback from "../assets/poster-fallback.jpg";
import largerlogo from "../assets/logo-larger.png";
import smallerlogo from "../assets/logo-smaller.png";
import ToggleMenu from "../components/ToggleMenu";

function parseYoutubeId(url) {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 12 ? match[2] : match && match[2].length === 11 ? match[2] : url;
}

export default function Home() {
    const navigate = useNavigate();

    const [animeList, setAnimeList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [nextCursor, setNextCursor] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [watchlistIds, setWatchlistIds] = useState(new Set());
    const [reviewContent, setReviewContent] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);
    const [transitioning, setTransitioning] = useState(false);

    const touchStartY = useRef(null);
    const wheelLock = useRef(false);

    const currentAnime = animeList[currentIndex] || null;

    // ─── Data Fetching ─────────────────────────────────────────────────────────
    const fetchAnime = useCallback(async (cursor = "", reset = true) => {
        if (reset) setLoading(true);
        else setLoadingMore(true);

        try {
            const res = await getAnimeList(10, cursor);
            if (res?.data) {
                const fetched = res.data.data || [];
                const next = res.data.cursor || null;
                setAnimeList(prev => reset ? fetched : [...prev, ...fetched]);
                setNextCursor(next);
            }
        } catch (err) {
            console.error("Failed to load anime:", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => { fetchAnime(); }, [fetchAnime]);

    useEffect(() => {
        getWatchlist(50)
            .then(res => {
                if (res?.data?.items) {
                    setWatchlistIds(new Set(res.data.items.map(item => item.anime?._id).filter(Boolean)));
                }
            })
            .catch(() => { });
    }, []);

    // ─── Navigation ────────────────────────────────────────────────────────────
    const goToNext = useCallback(() => {
        if (transitioning || !animeList.length) return;
        if (currentIndex < animeList.length - 1) {
            setTransitioning(true);
            setCurrentIndex(i => i + 1);
            setReviewContent("");
            setTimeout(() => setTransitioning(false), 500);

            // Preload more when 3 slides from end
            if (currentIndex >= animeList.length - 3 && nextCursor && !loadingMore) {
                fetchAnime(nextCursor, false);
            }
        }
    }, [transitioning, currentIndex, animeList.length, nextCursor, loadingMore, fetchAnime]);

    const goToPrev = useCallback(() => {
        if (transitioning || currentIndex === 0) return;
        setTransitioning(true);
        setCurrentIndex(i => i - 1);
        setReviewContent("");
        setTimeout(() => setTransitioning(false), 500);
    }, [transitioning, currentIndex]);

    // Keyboard
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowDown") goToNext();
            if (e.key === "ArrowUp") goToPrev();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [goToNext, goToPrev]);

    // Mouse wheel (debounced)
    const handleWheel = useCallback((e) => {
        e.preventDefault();
        if (wheelLock.current) return;
        wheelLock.current = true;
        if (e.deltaY > 0) goToNext(); else goToPrev();
        setTimeout(() => { wheelLock.current = false; }, 900);
    }, [goToNext, goToPrev]);

    // Touch swipe
    const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
    const handleTouchEnd = (e) => {
        if (touchStartY.current === null) return;
        const delta = touchStartY.current - e.changedTouches[0].clientY;
        touchStartY.current = null;
        if (Math.abs(delta) < 50) return;
        if (delta > 0) goToNext(); else goToPrev();
    };

    // ─── Watchlist ──────────────────────────────────────────────────────────────
    const handleWatchlistToggle = async () => {
        if (!currentAnime) return;
        const id = currentAnime._id;
        const inList = watchlistIds.has(id);
        try {
            if (inList) {
                await removeFromWatchlist(id);
                setWatchlistIds(prev => { const s = new Set(prev); s.delete(id); return s; });
                toast.success("Removed from watchlist!");
            } else {
                await addToWatchlist(id);
                setWatchlistIds(prev => new Set([...prev, id]));
                toast.success("Added to watchlist!");
            }
        } catch (err) {
            toast.error(err.message || "Failed to update watchlist.");
        }
    };

    // ─── Review ─────────────────────────────────────────────────────────────────
    const handleReviewSubmit = async (e) => {
        if (e.key !== "Enter" && e.type !== "click") return;
        if (!reviewContent.trim() || !currentAnime) return;
        setReviewLoading(true);
        try {
            await createReview(currentAnime._id, reviewContent.trim());
            toast.success("Review posted!");
            setReviewContent("");
        } catch (err) {
            toast.error(err.message || "Failed to submit review.");
        } finally {
            setReviewLoading(false);
        }
    };

    const inWatchlist = currentAnime ? watchlistIds.has(currentAnime._id) : false;
    const trailer = currentAnime ? parseYoutubeId(currentAnime.trailer || "") : "";

    // ─── Loading state ──────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4">
                    <LoadingIcon size={48} className="animate-spin text-[#FFD059]" />
                    <p className="text-white/50 text-sm font-poppins uppercase tracking-widest">Loading...</p>
                </div>
            </div>
        );
    }

    // ─── Empty state ────────────────────────────────────────────────────────────
    if (animeList.length === 0) {
        return (
            <div className="relative w-screen h-screen overflow-hidden text-white bg-black flex flex-col">
                <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-6 md:px-12 py-6">
                    <img src={largerlogo} alt="AniScope" className="w-28 md:w-32 object-contain cursor-pointer" onClick={() => navigate("/home")} />
                    <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-black/30 flex items-center justify-center">
                        <ToggleMenu iconClass="text-white hover:text-[#FFD059]" />
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                    <h1 className="text-5xl md:text-7xl font-extrabold font-outfit uppercase tracking-wider mb-4 text-white/20">( __ )</h1>
                    <h2 className="text-3xl md:text-5xl font-extrabold font-outfit uppercase tracking-wide mb-4">Anime Not Found</h2>
                    <p className="text-white/60 font-poppins text-sm max-w-md leading-relaxed">
                        No anime entries have been added yet. Log in as an administrator to add content.
                    </p>
                    <button
                        onClick={() => navigate("/explore")}
                        className="mt-8 bg-[#FFD059] text-[#4E361E] font-bold font-outfit uppercase px-8 py-3 rounded-lg hover:bg-[#F5C23E] transition-colors cursor-pointer"
                    >
                        Explore Library
                    </button>
                </div>
            </div>
        );
    }

    // ─── Main Reel View ─────────────────────────────────────────────────────────
    return (
        <div
            className="relative w-screen h-screen overflow-hidden text-white bg-black select-none"
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* ── Background: Video or blurred poster ── */}
            <div className="absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-500">
                {trailer ? (
                    <iframe
                        key={`trailer-${currentAnime._id}`}
                        className="absolute top-1/2 left-1/2 w-[140%] h-[140%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60 scale-110"
                        src={`https://www.youtube.com/embed/${trailer}?autoplay=1&mute=1&loop=1&controls=0&playlist=${trailer}&showinfo=0&rel=0&enablejsapi=0`}
                        title="Background trailer"
                        allow="autoplay"
                    />
                ) : (
                    <img
                        key={`poster-${currentAnime?._id}`}
                        src={currentAnime?.poster || posterFallback}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-40 scale-110 blur-md"
                    />
                )}
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
            </div>

            {/* ── Right-side progress dots ── */}
            <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5 items-center">
                {animeList.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => { setCurrentIndex(i); setReviewContent(""); }}
                        className={`rounded-full transition-all duration-300 cursor-pointer ${i === currentIndex
                                ? "w-1.5 h-7 bg-[#FFD059] shadow-[0_0_8px_#FFD059]"
                                : i < currentIndex
                                    ? "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                                    : "w-1.5 h-1.5 bg-white/20 hover:bg-white/50"
                            }`}
                        title={animeList[i]?.title}
                    />
                ))}
                {loadingMore && (
                    <LoadingIcon size={12} className="animate-spin text-white/40 mt-1" />
                )}
            </div>

            {/* ── Up / Down nav arrows ── */}
            <div className="hidden md:flex absolute right-10 md:right-14 bottom-20 z-30 flex-col gap-2">
                <button
                    onClick={goToPrev}
                    disabled={currentIndex === 0}
                    className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/25 disabled:opacity-20 transition-all cursor-pointer"
                    title="Previous"
                >
                    <ChevronUp size={16} />
                </button>
                <button
                    onClick={goToNext}
                    disabled={currentIndex === animeList.length - 1 && !nextCursor}
                    className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/25 disabled:opacity-20 transition-all cursor-pointer"
                    title="Next"
                >
                    <ChevronDown size={16} />
                </button>
            </div>

            {/* ════════════ MOBILE LAYOUT ════════════ */}
            <div className="md:hidden relative z-10 flex flex-col h-full justify-between pb-6 pt-4">
                {/* Mobile Header */}
                <div className="flex justify-between items-center px-5">
                    <img src={smallerlogo} alt="Logo" className="w-24 object-contain" />
                    <ToggleMenu iconClass="text-white hover:text-[#F5C23E]" />
                </div>

                {/* Floating poster thumbnail */}
                <div className="absolute top-20 left-5 z-20">
                    <div
                        onClick={() => currentAnime && navigate(`/anime/${currentAnime._id}`)}
                        className="cursor-pointer group relative rounded-xl border-2 border-white/20 overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        <img
                            src={currentAnime?.poster || posterFallback}
                            alt={currentAnime?.title}
                            className="w-28 h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-xs font-bold font-outfit uppercase bg-white/20 backdrop-blur-md px-2 py-1 rounded">View</span>
                        </div>
                    </div>
                </div>

                {/* Swipe hint */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 opacity-20 pointer-events-none">
                    <ChevronUp size={14} className="animate-bounce" />
                    <span className="text-[8px] font-bold uppercase tracking-[0.3em]">Swipe</span>
                    <ChevronDown size={14} className="animate-bounce" style={{ animationDelay: "0.15s" }} />
                </div>

                {/* Bottom Info Panel */}
                <div className="w-full px-4 mt-auto">
                    <div className="rounded-2xl backdrop-blur-xl bg-black/55 border border-white/15 p-5 space-y-3 relative shadow-2xl">
                        {/* Slide counter */}
                        <div className="absolute -top-3.5 right-4 bg-[#FFD059] text-[#4E361E] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow">
                            {currentIndex + 1} / {animeList.length}
                        </div>

                        {/* Meta row */}
                        <div className="flex items-center gap-2.5 text-xs">
                            <span className="font-bold text-[#FFD059]">{currentAnime?.releaseYear || "N/A"}</span>
                            <span className="text-white/70">{currentAnime?.genre || "N/A"}</span>
                            <span className="bg-[#FFD059] text-[#4E361E] px-2 py-[2px] rounded text-[9px] font-bold uppercase">
                                {currentAnime?.isSeries ? "Series" : "Movie"}
                            </span>
                            <div className="ml-auto flex gap-2">
                                <button
                                    onClick={handleWatchlistToggle}
                                    className={`w-9 h-9 flex items-center justify-center rounded-full border border-white/20 transition-all cursor-pointer ${inWatchlist ? "bg-[#FFD059] text-[#4E361E] border-[#FFD059]" : "bg-white/10 hover:bg-white/20"
                                        }`}
                                    aria-label="Watchlist"
                                >
                                    <Star size={15} fill={inWatchlist ? "currentColor" : "none"} />
                                </button>
                                <button
                                    onClick={() => currentAnime && navigate(`/anime/${currentAnime._id}`)}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 cursor-pointer"
                                    aria-label="Reviews"
                                >
                                    <MessageSquare size={15} />
                                </button>
                            </div>
                        </div>

                        {/* Title */}
                        <h2
                            onClick={() => currentAnime && navigate(`/anime/${currentAnime._id}`)}
                            className="text-xl font-extrabold font-outfit uppercase tracking-wide cursor-pointer hover:text-[#FFD059] transition-colors line-clamp-1"
                        >
                            {currentAnime?.title || "Anime Not Found"}
                        </h2>

                        {/* Description */}
                        <p className="text-xs text-white/75 leading-relaxed line-clamp-2">
                            {currentAnime?.description || "No description available."}
                        </p>

                        {/* Review input */}
                        <div className="relative">
                            <input
                                type="text"
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                                onKeyDown={handleReviewSubmit}
                                placeholder="Write your review and press enter..."
                                disabled={reviewLoading}
                                className="w-full bg-white/10 text-white border border-white/20 h-9 px-3 pr-10 text-xs rounded-lg outline-none focus:border-[#FFD059] focus:bg-white/20 transition-all"
                            />
                            {reviewContent.trim() && (
                                <button onClick={handleReviewSubmit} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-[#FFD059]">
                                    Post
                                </button>
                            )}
                        </div>

                        {/* Tags */}
                        {currentAnime?.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {currentAnime.tags.slice(0, 5).map((tag, i) => (
                                    <span key={i} className="bg-white/10 text-white/70 px-2 py-0.5 rounded-full text-[9px] font-medium">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ════════════ DESKTOP LAYOUT ════════════ */}
            <div className="hidden md:flex flex-col justify-between h-full relative z-10 px-12 py-8">
                {/* Desktop Top Bar */}
                <div className="flex justify-between items-center">
                    <img
                        src={largerlogo}
                        alt="AniScope"
                        onClick={() => navigate("/home")}
                        className="w-32 object-contain cursor-pointer transition-transform hover:scale-105"
                    />

                    {/* Quick genre links */}
                    <div className="flex items-center gap-8 text-sm font-bold tracking-[0.2em] text-white/70">
                        {["ADVENTURE", "ACTION", "SWORDSMAN", "COURAGE"].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => navigate(`/explore?search=${cat.toLowerCase()}`)}
                                className="hover:text-[#FFD059] transition-colors cursor-pointer relative group py-1"
                            >
                                {cat}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD059] transition-all group-hover:w-full" />
                            </button>
                        ))}
                    </div>

                    {/* Action icons */}
                    <div className="flex flex-col gap-4 items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-black/30 hover:border-[#FFD059] flex items-center justify-center transition-all">
                            <ToggleMenu iconClass="text-white hover:text-[#FFD059]" />
                        </div>
                        <button
                            onClick={handleWatchlistToggle}
                            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${inWatchlist ? "bg-[#FFD059] border-[#FFD059] text-[#4E361E]" : "bg-black/30 border-white/20 hover:border-[#FFD059]"
                                }`}
                            title="Watchlist"
                        >
                            <Star size={18} fill={inWatchlist ? "currentColor" : "none"} />
                        </button>
                        <button
                            onClick={() => currentAnime && navigate(`/anime/${currentAnime._id}`)}
                            className="w-12 h-12 rounded-full border-2 border-white/20 bg-black/30 hover:border-[#FFD059] flex items-center justify-center transition-all cursor-pointer"
                            title="Reviews & Ratings"
                        >
                            <MessageSquare size={18} />
                        </button>
                    </div>
                </div>

                {/* Main Content Block */}
                <div className="flex items-end justify-between mb-8">
                    {/* Left panel */}
                    <div className="max-w-xl space-y-5">
                        {/* Meta badges */}
                        <div className="flex items-center gap-4 text-sm font-bold">
                            <span className="text-[#FFD059]">{currentAnime?.releaseYear || "N/A"}</span>
                            <span className="text-white/50">|</span>
                            <span>{currentAnime?.genre || "N/A"}</span>
                            <span className="text-white/50">|</span>
                            <span className="bg-[#FFD059] text-[#4E361E] px-3 py-0.5 rounded text-xs font-extrabold uppercase tracking-wide">
                                {currentAnime?.isSeries ? "Series" : "Movie"}
                            </span>
                            <span className="text-white/35 text-xs font-poppins ml-1">
                                {currentIndex + 1} / {animeList.length}
                            </span>
                        </div>

                        {/* Title */}
                        <h1
                            onClick={() => currentAnime && navigate(`/anime/${currentAnime._id}`)}
                            className="text-6xl xl:text-7xl font-extrabold tracking-wider leading-tight uppercase font-outfit cursor-pointer hover:text-[#FFD059] transition-all duration-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] line-clamp-2"
                        >
                            {currentAnime?.title || "Anime Not Found"}
                        </h1>

                        {/* Description */}
                        <p className="text-white/80 leading-relaxed text-sm max-w-lg font-poppins drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] line-clamp-3">
                            {currentAnime?.description || "No description available."}
                        </p>

                        {/* Tags */}
                        {currentAnime?.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {currentAnime.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        onClick={() => navigate(`/explore?search=${tag.toLowerCase()}`)}
                                        className="bg-white/10 hover:bg-[#FFD059] hover:text-[#4E361E] text-white/80 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all border border-white/10"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Review Input */}
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                                onKeyDown={handleReviewSubmit}
                                placeholder="Write a quick review and press enter..."
                                disabled={reviewLoading}
                                className="w-full bg-white/10 text-white border border-white/20 h-11 px-4 pr-14 text-sm rounded-xl outline-none focus:border-[#FFD059] focus:bg-white/20 transition-all font-poppins"
                            />
                            {reviewContent.trim() && (
                                <button onClick={handleReviewSubmit} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#FFD059] hover:text-white transition-colors">
                                    Post
                                </button>
                            )}
                        </div>

                        {/* Navigation hint */}
                        <div className="flex items-center gap-2 text-white/30 text-xs font-poppins">
                            <ChevronUp size={13} />
                            <ChevronDown size={13} />
                            <span>Scroll, swipe or use arrow keys to browse anime</span>
                        </div>
                    </div>

                    {/* Right poster card */}
                    <div
                        onClick={() => currentAnime && navigate(`/anime/${currentAnime._id}`)}
                        className="w-52 h-76 rounded-2xl overflow-hidden border-4 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer group relative transition-all duration-500 hover:scale-105 hover:border-[#FFD059]"
                        style={{ height: "304px" }}
                    >
                        <img
                            src={currentAnime?.poster || posterFallback}
                            alt={currentAnime?.title}
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
