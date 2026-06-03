import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Star, MessageSquare, Trash2, Edit, ArrowLeft, Send, Check, Play, Loader as LoadingIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import { getAnimeById, updateAnime, deleteAnime } from "../api/anime";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "../api/watchlist";
import { getReviews, createReview, deleteReview } from "../api/review";
import { getRatingsStats, getMyRating, createRating, updateRating } from "../api/rating";
import { ToggleMenu, Input, Button } from "../components";
import logoSmaller from "../assets/logo-smaller.png";
import posterFallback from "../assets/dummy/poster.jpg";

export default function Anime() {
    const { animeId } = useParams();
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.auth);
    const isAdmin = userData?.role === "admin";

    // State
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [inWatchlist, setInWatchlist] = useState(false);
    
    // Reviews
    const [reviews, setReviews] = useState([]);
    const [reviewsNextCursor, setReviewsNextCursor] = useState(null);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [newReviewText, setNewReviewText] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    // Ratings
    const [ratingsStats, setRatingsStats] = useState({ avgRating: 0, totalRatings: 0 });
    const [myRating, setMyRating] = useState(null); // { _id, rate } | null
    const [submittingRate, setSubmittingRate] = useState(false);

    // Admin Edit Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({
        title: "",
        description: "",
        releaseYear: "",
        genre: "",
        tags: "",
        trailer: "",
        isSeries: false,
    });
    const [editErrors, setEditErrors] = useState({});
    const [editLoading, setEditLoading] = useState(false);

    const parseYoutubeId = (url) => {
        if (!url) return "";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 12 ? match[2] : match && match[2].length === 11 ? match[2] : url;
    };

    // Load all data
    const loadAnimeData = async () => {
        setLoading(true);
        try {
            // 1. Fetch details
            const detailRes = await getAnimeById(animeId);
            if (detailRes && detailRes.data) {
                setAnime(detailRes.data);
                setEditData({
                    title: detailRes.data.title || "",
                    description: detailRes.data.description || "",
                    releaseYear: detailRes.data.releaseYear || "",
                    genre: detailRes.data.genre || "",
                    tags: detailRes.data.tags?.join(", ") || "",
                    trailer: detailRes.data.trailer || "",
                    isSeries: detailRes.data.isSeries || false,
                });
            }

            // 2. Fetch watchlist status
            const watchlistRes = await getWatchlist(50);
            if (watchlistRes && watchlistRes.data && watchlistRes.data.items) {
                const found = watchlistRes.data.items.some(
                    (item) => item.anime?._id === animeId
                );
                setInWatchlist(found);
            }

            // 3. Fetch ratings stats + user's own rating
            const [ratingRes, myRatingRes] = await Promise.all([
                getRatingsStats(animeId),
                getMyRating(animeId).catch(() => null),
            ]);
            if (ratingRes && ratingRes.data) {
                setRatingsStats(ratingRes.data);
            }
            if (myRatingRes && myRatingRes.data) {
                setMyRating(myRatingRes.data);
            }

            // 4. Fetch reviews list
            setReviewsLoading(true);
            const reviewRes = await getReviews(animeId, 20);
            if (reviewRes && reviewRes.data) {
                setReviews(reviewRes.data.items || []);
                setReviewsNextCursor(reviewRes.data.nextCursor);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load anime details.");
        } finally {
            setLoading(false);
            setReviewsLoading(false);
        }
    };

    useEffect(() => {
        loadAnimeData();
    }, [animeId]);

    const handleWatchlistToggle = async () => {
        try {
            if (inWatchlist) {
                await removeFromWatchlist(animeId);
                setInWatchlist(false);
                toast.success("Removed from watchlist!");
            } else {
                await addToWatchlist(animeId);
                setInWatchlist(true);
                toast.success("Added to watchlist!");
            }
        } catch (err) {
            toast.error(err.message || "Failed to update watchlist.");
        }
    };

    // Review Actions
    const handlePostReview = async (e) => {
        e.preventDefault();
        if (!newReviewText.trim()) return;

        setSubmittingReview(true);
        try {
            await createReview(animeId, newReviewText.trim());
            toast.success("Review posted successfully!");
            setNewReviewText("");
            
            // Reload reviews list
            const reviewRes = await getReviews(animeId, 20);
            if (reviewRes && reviewRes.data) {
                setReviews(reviewRes.data.items || []);
                setReviewsNextCursor(reviewRes.data.nextCursor);
            }
        } catch (err) {
            toast.error(err.message || "Failed to submit review.");
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            await deleteReview(reviewId);
            toast.success("Review deleted.");
            setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        } catch (err) {
            toast.error(err.message || "Failed to delete review.");
        }
    };

    // Rating Actions
    const handleRateSubmit = async (rate) => {
        if (submittingRate) return;
        // Don't re-submit same rating
        if (myRating && myRating.rate === rate) return;

        setSubmittingRate(true);
        try {
            if (myRating) {
                // Update existing rating
                await updateRating(myRating._id, rate);
                setMyRating((prev) => ({ ...prev, rate }));
                toast.success(`Rating updated to ${rate}/10!`);
            } else {
                // Create new rating
                const res = await createRating(animeId, rate);
                if (res && res.data) setMyRating(res.data);
                toast.success(`You rated this anime ${rate}/10!`);
            }
            // Refresh average stats
            const ratingRes = await getRatingsStats(animeId);
            if (ratingRes && ratingRes.data) {
                setRatingsStats(ratingRes.data);
            }
        } catch (err) {
            toast.error(err.message || "Failed to submit rating.");
        } finally {
            setSubmittingRate(false);
        }
    };

    // Admin Actions
    const handleAnimeDelete = async () => {
        if (!window.confirm(`Are you absolutely sure you want to delete "${anime?.title}"? This cannot be undone.`)) return;

        try {
            await deleteAnime(animeId);
            toast.success("Anime deleted successfully!");
            navigate("/explore");
        } catch (err) {
            toast.error(err.message || "Failed to delete anime.");
        }
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setEditErrors((prev) => ({ ...prev, name: "" }));
    };

    const validateEdit = () => {
        const errors = {};
        if (!editData.title.trim()) errors.title = "Title is required";
        if (!editData.genre.trim()) errors.genre = "Genre is required";
        if (!editData.releaseYear) {
            errors.releaseYear = "Release Year is required";
        } else if (isNaN(editData.releaseYear)) {
            errors.releaseYear = "Must be a valid year number";
        }
        setEditErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!validateEdit()) return;

        setEditLoading(true);
        try {
            const updated = {
                title: editData.title.trim(),
                description: editData.description.trim(),
                releaseYear: editData.releaseYear,
                genre: editData.genre.trim(),
                tags: editData.tags,
                isSeries: editData.isSeries,
                trailer: editData.trailer.trim(),
            };

            const response = await updateAnime(animeId, updated);
            if (response && response.data) {
                toast.success("Anime details updated!");
                setAnime(response.data);
                setIsEditModalOpen(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to update details.");
        } finally {
            setEditLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-[#FFEBB8]">
                <div className="animate-spin text-[#4E361E]"><LoadingIcon size={60} /></div>
            </div>
        );
    }

    if (!anime) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#FFEBB8]">
                <h1 className="text-3xl font-extrabold uppercase font-outfit mb-4">Anime Not Found</h1>
                <button
                    onClick={() => navigate("/explore")}
                    className="bg-[#F5C23E] border-4 border-[#4E361E] font-bold font-outfit uppercase px-6 py-3 rounded-md shadow-[4px_4px_0px_0px_#4E361E]"
                >
                    Back to Explore
                </button>
            </div>
        );
    }

    const trailerId = parseYoutubeId(anime.trailer);

    return (
        <div className="min-h-screen bg-[#FFEBB8] text-[#4E361E] pb-24 font-poppins">
            {/* Header section */}
            <header className="px-6 py-6 max-w-7xl mx-auto flex justify-between items-center border-b-4 border-[#4E361E] mb-8">
                <button
                    onClick={() => navigate("/explore")}
                    className="flex items-center gap-2 font-bold uppercase text-sm border-2 border-[#4E361E] px-3 py-1.5 bg-[#FFD059] hover:bg-[#F5C23E] rounded shadow-[2px_2px_0px_0px_#4E361E] cursor-pointer"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
                    <img src={logoSmaller} alt="Logo" className="h-8 w-auto" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#4E361E] bg-[#FFD059] flex items-center justify-center shadow-[2px_2px_0px_0px_#4E361E]">
                    <ToggleMenu iconClass="text-[#4E361E] hover:text-[#4E361E]/80" />
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 space-y-8">
                {/* Main details banner: Poster + metadata */}
                <div className="bg-white border-4 border-[#4E361E] rounded-xl p-6 md:p-8 shadow-[8px_8px_0px_0px_#4E361E] flex flex-col md:flex-row gap-8">
                    {/* Left: Poster */}
                    <div className="w-full md:w-1/3 max-w-[280px] mx-auto md:mx-0">
                        <div className="border-4 border-[#4E361E] rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#4E361E] aspect-[3/4]">
                            <img
                                src={anime.poster || posterFallback}
                                alt={anime.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                                <span className="bg-[#FFD059] border-2 border-[#4E361E] px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#4E361E] uppercase">
                                    {anime.isSeries ? "Series" : "Movie"}
                                </span>
                                {anime.releaseYear && (
                                    <span className="bg-[#FFEBB8]/50 border-2 border-[#4E361E] px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#4E361E]">
                                        Released: {anime.releaseYear}
                                    </span>
                                )}
                                <span className="text-[#F5C23E]">{anime.genre}</span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-extrabold font-outfit uppercase tracking-tight leading-none text-[#4E361E]">
                                {anime.title}
                            </h1>

                            <p className="text-sm md:text-base leading-relaxed text-[#4E361E]/80">
                                {anime.description || "No description provided yet."}
                            </p>

                            {/* Tags */}
                            {anime.tags && anime.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {anime.tags.map((tag, idx) => (
                                        <span key={idx} className="bg-[#FFEBB8]/50 border-2 border-[#4E361E] rounded-md px-2 py-1 text-xs font-bold text-[#4E361E]">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Watchlist & Admin Controls */}
                        <div className="flex flex-wrap gap-4 pt-6 border-t-2 border-[#4E361E]/10 items-center">
                            <button
                                onClick={handleWatchlistToggle}
                                className={`font-bold font-outfit uppercase text-sm border-4 border-[#4E361E] px-6 py-3 rounded-md transition-all flex items-center gap-2 cursor-pointer ${
                                    inWatchlist
                                        ? "bg-[#4E361E] text-white shadow-none"
                                        : "bg-[#FFD059] hover:bg-[#F5C23E] text-[#4E361E] shadow-[4px_4px_0px_0px_#4E361E] active:translate-x-1 active:translate-y-1 active:shadow-none"
                                }`}
                            >
                                <Star size={16} fill={inWatchlist ? "currentColor" : "none"} />
                                {inWatchlist ? "Saved in Watchlist" : "Add to Watchlist"}
                            </button>

                            {isAdmin && (
                                <div className="flex items-center gap-3 ml-auto">
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="bg-white hover:bg-gray-100 border-4 border-[#4E361E] text-[#4E361E] font-bold font-outfit uppercase p-3 rounded-md shadow-[3px_3px_0px_0px_#4E361E] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer flex items-center justify-center"
                                        title="Edit Anime Details"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={handleAnimeDelete}
                                        className="bg-red-100 hover:bg-red-200 border-4 border-red-600 text-red-600 font-bold font-outfit uppercase p-3 rounded-md shadow-[3px_3px_0px_0px_#991b1b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer flex items-center justify-center"
                                        title="Delete Anime Entry"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ratings & Video player Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Trailer Video Player */}
                    <div className="md:col-span-2 bg-white border-4 border-[#4E361E] rounded-xl p-4 shadow-[6px_6px_0px_0px_#4E361E] flex flex-col justify-center min-h-[300px]">
                        <h3 className="font-extrabold font-outfit uppercase text-lg mb-3 flex items-center gap-2">
                            <Play size={16} fill="currentColor" /> Official Trailer
                        </h3>
                        {trailerId ? (
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden border-2 border-[#4E361E]">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${trailerId}`}
                                    title="YouTube trailer player"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div className="bg-[#FFEBB8]/20 border-2 border-dashed border-[#4E361E]/40 rounded-lg p-12 text-center text-sm font-medium text-[#4E361E]/60 flex flex-col items-center justify-center flex-grow">
                                No official trailer linked for this entry.
                            </div>
                        )}
                    </div>

                    {/* Ratings Scoreboard */}
                    <div className="bg-white border-4 border-[#4E361E] rounded-xl p-6 shadow-[6px_6px_0px_0px_#4E361E] flex flex-col gap-5">
                        {/* Header */}
                        <h3 className="font-extrabold font-outfit uppercase text-lg border-b-2 border-[#4E361E]/10 pb-2">
                            Ratings
                        </h3>

                        {/* Average score block */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-[#FFD059] border-4 border-[#4E361E] rounded-lg shadow-[3px_3px_0px_0px_#4E361E] flex flex-col items-center justify-center select-none font-outfit shrink-0">
                                <span className="text-xl font-black leading-none">
                                    {ratingsStats.avgRating ? Number(ratingsStats.avgRating).toFixed(1) : "—"}
                                </span>
                                <span className="text-[9px] font-bold">/ 10</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm">Average Score</p>
                                <p className="text-xs text-[#4E361E]/60 font-poppins mb-1.5">
                                    {ratingsStats.totalRatings || 0} {ratingsStats.totalRatings === 1 ? "rating" : "ratings"}
                                </p>
                                {/* Average fill bar */}
                                <div className="w-full h-2.5 bg-[#FFEBB8] border-2 border-[#4E361E] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#FFD059] rounded-full transition-all duration-700"
                                        style={{ width: `${((ratingsStats.avgRating || 0) / 10) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Your rating badge */}
                        {myRating ? (
                            <div className="flex items-center gap-2 bg-[#FFD059]/30 border-2 border-[#FFD059] rounded-lg px-3 py-2">
                                <Star size={14} className="text-[#4E361E]" fill="currentColor" />
                                <span className="text-xs font-extrabold font-outfit uppercase text-[#4E361E]">
                                    Your Rating: {myRating.rate}/10
                                </span>
                                <span className="ml-auto text-[10px] text-[#4E361E]/60 font-poppins">Tap to change</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 bg-[#FFEBB8]/40 border-2 border-dashed border-[#4E361E]/30 rounded-lg px-3 py-2">
                                <Star size={14} className="text-[#4E361E]/40" />
                                <span className="text-xs font-bold font-outfit uppercase text-[#4E361E]/50">
                                    Not rated yet
                                </span>
                            </div>
                        )}

                        {/* Rating buttons 1–10 */}
                        <div className="space-y-2">
                            <span className="font-bold font-outfit uppercase text-xs text-[#4E361E]/70">
                                {myRating ? "Change Your Rating" : "Rate This Anime"}
                            </span>
                            <div className="grid grid-cols-5 gap-1.5">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rate) => {
                                    const isSelected = myRating?.rate === rate;
                                    const isLoading = submittingRate;
                                    return (
                                        <button
                                            key={rate}
                                            onClick={() => handleRateSubmit(rate)}
                                            disabled={isLoading}
                                            title={isSelected ? `Your current rating: ${rate}` : `Rate ${rate}/10`}
                                            className={`w-full aspect-square border-2 rounded-md font-extrabold text-xs flex items-center justify-center transition-all ${
                                                isSelected
                                                    ? "bg-[#FFD059] border-[#4E361E] shadow-[2px_2px_0px_0px_#4E361E] scale-110 text-[#4E361E]"
                                                    : "border-[#4E361E] bg-[#FFEBB8]/10 hover:bg-[#FFD059]/60 active:bg-[#F5C23E] cursor-pointer"
                                            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            {isSelected && !isLoading ? (
                                                <Check size={12} />
                                            ) : (
                                                rate
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Discussion Feed */}
                <div className="bg-white border-4 border-[#4E361E] rounded-xl p-6 shadow-[6px_6px_0px_0px_#4E361E]">
                    <h3 className="font-extrabold font-outfit uppercase text-lg mb-4 border-b-2 border-[#4E361E]/10 pb-2 flex items-center gap-2">
                        <MessageSquare size={16} /> Reviews & Discussion
                    </h3>

                    {/* Post Review Form */}
                    <form onSubmit={handlePostReview} className="flex flex-col gap-2 mb-6">
                        <div className="relative">
                            <textarea
                                value={newReviewText}
                                onChange={(e) => setNewReviewText(e.target.value)}
                                placeholder="Share your thoughts about this anime..."
                                disabled={submittingReview}
                                rows="3"
                                className="w-full border-4 border-[#4E361E] rounded-xl shadow-[3px_3px_0px_0px_#4E361E] outline-none p-3 pr-12 font-medium bg-[#FFEBB8]/10 focus:bg-white"
                            />
                            <button
                                type="submit"
                                disabled={submittingReview || !newReviewText.trim()}
                                className="absolute right-4 bottom-4 bg-[#FFD059] hover:bg-[#F5C23E] border-2 border-[#4E361E] p-2 rounded shadow-[2px_2px_0px_0px_#4E361E] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>

                    {/* Reviews List */}
                    {reviewsLoading && reviews.length === 0 ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin text-[#4E361E]"><LoadingIcon size={24} /></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="bg-[#FFEBB8]/15 border-2 border-dashed border-[#4E361E]/30 rounded-xl p-10 text-center font-medium text-[#4E361E]/60 text-sm">
                            No reviews posted yet. Be the first to share your opinion!
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                            {reviews.map((review) => {
                                const isOwnReview = review.user?._id === userData?._id;
                                const showDelete = isOwnReview || isAdmin;
                                return (
                                    <div
                                        key={review._id}
                                        className="bg-[#FFEBB8]/20 border-2 border-[#4E361E] rounded-xl p-4 shadow-[3px_3px_0px_0px_#4E361E] flex flex-col justify-between"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-extrabold font-outfit uppercase text-xs tracking-wide text-[#F5C23E]">
                                                        {review.user?.username || "Anonymous"}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 font-poppins">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm leading-relaxed text-[#4E361E]">
                                                    {review.content}
                                                </p>
                                            </div>

                                            {showDelete && (
                                                <button
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    className="bg-red-50 hover:bg-red-100 border border-red-500 p-1.5 rounded-md text-red-500 cursor-pointer flex items-center justify-center transition-colors shadow-[1px_1px_0px_0px_#ef4444]"
                                                    title="Delete review"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* Admin Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white border-4 border-[#4E361E] rounded-xl max-w-lg w-full p-6 shadow-[8px_8px_0px_0px_#4E361E] relative my-8">
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-4 right-4 bg-[#FFEBB8] hover:bg-[#FFD059] border-2 border-[#4E361E] rounded p-1 cursor-pointer"
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
                                value={editData.title}
                                onChange={handleEditChange}
                                placeholder="Anime Title"
                                error={editErrors.title}
                                inputClass="border-[#4E361E] text-sm h-11"
                                labelClass="text-xs"
                            />

                            <div className="flex flex-col gap-1">
                                <label className="font-bold font-outfit uppercase text-xs">Description</label>
                                <textarea
                                    name="description"
                                    value={editData.description}
                                    onChange={handleEditChange}
                                    placeholder="Enter details summary..."
                                    rows="3"
                                    className="border-4 border-[#4E361E] w-full rounded-md shadow-[2px_2px_0px_0px_#4E361E] outline-none p-2 font-poppins text-sm bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Release Year"
                                    name="releaseYear"
                                    value={editData.releaseYear}
                                    onChange={handleEditChange}
                                    placeholder="e.g. 2021"
                                    error={editErrors.releaseYear}
                                    inputClass="border-[#4E361E] text-sm h-11"
                                    labelClass="text-xs"
                                />
                                <Input
                                    label="Genre"
                                    name="genre"
                                    value={editData.genre}
                                    onChange={handleEditChange}
                                    placeholder="e.g. Romance"
                                    error={editErrors.genre}
                                    inputClass="border-[#4E361E] text-sm h-11"
                                    labelClass="text-xs"
                                />
                            </div>

                            <Input
                                label="Tags (comma separated)"
                                name="tags"
                                value={editData.tags}
                                onChange={handleEditChange}
                                placeholder="e.g. Action, Romance"
                                inputClass="border-[#4E361E] text-sm h-11"
                                labelClass="text-xs"
                            />

                            <Input
                                label="Youtube Trailer URL"
                                name="trailer"
                                value={editData.trailer}
                                onChange={handleEditChange}
                                placeholder="Youtube watch link..."
                                inputClass="border-[#4E361E] text-sm h-11"
                                labelClass="text-xs"
                            />

                            <div className="flex items-center gap-3 py-1">
                                <input
                                    type="checkbox"
                                    id="editIsSeries"
                                    name="isSeries"
                                    checked={editData.isSeries}
                                    onChange={handleEditChange}
                                    className="w-5 h-5 rounded border-2 border-[#4E361E] text-[#F5C23E] focus:ring-0 cursor-pointer"
                                />
                                <label htmlFor="editIsSeries" className="font-bold font-outfit uppercase text-xs cursor-pointer select-none">
                                    Is TV Series
                                </label>
                            </div>

                            <Button
                                type="submit"
                                loading={editLoading}
                                buttonClass="bg-[#F5C23E] hover:bg-[#FFD059] text-[#4E361E] border-4 border-[#4E361E] shadow-[4px_4px_0px_0px_#4E361E] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer text-base h-12 mt-4"
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