"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheckCircle, FaStar, FaBuilding, FaCalendarAlt, FaEye } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { FavoritesAPI } from "@/app/lib/api-helpers";
import { useRouter } from "next/navigation";
// Sample reviews - we'll keep these for now since the API doesn't include reviews yet
// const sampleReviews = [
//   {
//     id: 1,
//     user: "Amit Patel",
//     rating: 4.9,
//     date: "2023-05-15",
//     text: "Helped me find my dream home within a week! Knowledge of the local market is exceptional.",
//   },
//   {
//     id: 2,
//     user: "Priya Singh",
//     rating: 4.7,
//     date: "2023-04-22",
//     text: "Very professional and responsive. Made the process of buying our first home smooth and stress-free.",
//   },
//   {
//     id: 3,
//     user: "Vikram Malhotra",
//     rating: 4.8,
//     date: "2023-03-10",
//     text: "Great negotiation skills. Got us a great deal on our property.",
//   },
// ];
export default function AgentDetailPage({ params, }) {
    var _a, _b, _c, _d, _f;
    const router = useRouter();
    const [agent, setAgent] = useState(null);
    const [stats, setStats] = useState(null);
    const [properties, setProperties] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        pages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [agentId, setAgentId] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [userName, setUserName] = useState("");
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [token, setToken] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [isFavorited, setIsFavorited] = useState(false);
    // Resolve params
    useEffect(() => {
        async function resolveParams() {
            const resolvedParams = await params;
            setAgentId(resolvedParams.id);
        }
        resolveParams();
    }, [params]);
    useEffect(() => {
        // Only run this on the client side
        if (typeof window !== "undefined") {
            const authToken = sessionStorage.getItem("authToken");
            if (authToken) {
                setToken(authToken);
            }
        }
    }, []);
    const fetchFavorite = async () => {
        if (token) {
            try {
                const agentsData = await FavoritesAPI.getAgents();
                setFavorites(agentsData.favorites);
                // Check if current agent is in favorites
                if (agent &&
                    agentsData.favorites.some((fav) => fav._id === agent._id)) {
                    setIsFavorited(true);
                }
                else {
                    setIsFavorited(false);
                }
            }
            catch (_error) {
                toast.error("Failed to fetch favorites");
            }
        }
    };
    useEffect(() => {
        if (token) {
            fetchFavorite();
        }
    }, [token]);
    const fetchReviews = async () => {
        if (!agentId)
            return;
        try {
            const response = await fetch(`/api/agents/${agentId}/reviews`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data.reviews);
            }
        }
        catch (_error) {
        }
    };
    useEffect(() => {
        // Fetch agent details when component mounts
        if (agentId) {
            fetchAgentDetails();
            fetchReviews();
        }
    }, [agentId]);
    // Update isFavorited when agent or favorites change
    useEffect(() => {
        if (agent && favorites.length > 0) {
            setIsFavorited(favorites.some((fav) => fav._id === agent._id));
        }
    }, [agent, favorites]);
    const fetchAgentDetails = async (page = 1) => {
        if (!agentId)
            return;
        setLoading(true);
        try {
            const response = await fetch(`/api/agents/${agentId}?page=${page}&limit=6`);
            if (!response.ok) {
                throw new Error("Failed to fetch agent details");
            }
            const data = await response.json();
            setAgent(data.agent);
            setStats(data.stats);
            setProperties(data.properties);
            setPagination(data.pagination);
            setError(null);
        }
        catch (_err) {
            setError("Failed to load agent details");
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmitReview = async (_e) => {
        _e.preventDefault();
        if (userRating === 0) {
            alert("Please select a rating");
            return;
        }
        if (userName.trim() === "") {
            alert("Please enter your name");
            return;
        }
        try {
            const response = await fetch(`/api/agents/${agentId}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userName,
                    rating: userRating,
                    comment: reviewText,
                    title: "Review",
                }),
            });
            if (response.ok) {
                // Reset form fields
                setUserRating(0);
                setReviewText("");
                setUserName("");
                setShowReviewForm(false);
                // Fetch updated reviews and agent data (for updated rating)
                fetchReviews();
                fetchAgentDetails();
            }
            else {
                const data = await response.json();
                alert(`Error: ${data.error || "Failed to submit review"}`);
            }
        }
        catch (error) {
            toast.error(error);
            alert("Failed to submit review. Please try again.");
        }
        finally {
            setShowReviewForm(false);
        }
    };
    // Function to render stars based on rating
    const renderStars = (rating, interactive = false) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (interactive) {
                stars.push(<button key={i} type="button" onClick={() => setUserRating(i)} onMouseEnter={() => setHoveredRating(i)} onMouseLeave={() => setHoveredRating(0)} className="focus:outline-none">
            {i <= (hoveredRating || userRating) ? (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"/>
              </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
              </svg>)}
          </button>);
            }
            else {
                const fullStars = Math.floor(rating);
                const hasHalfStar = rating % 1 >= 0.5;
                if (i <= fullStars) {
                    stars.push(<svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-500">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"/>
            </svg>);
                }
                else if (i === fullStars + 1 && hasHalfStar) {
                    stars.push(<svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-500">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"/>
            </svg>);
                }
                else {
                    stars.push(<svg key={i} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
            </svg>);
                }
            }
        }
        return stars;
    };
    const toggleFavorite = async (agentId) => {
        if (!token) {
            toast.error("Please login to add favorites");
            return;
        }
        try {
            // Optimistically update UI first for responsive feedback
            setIsFavorited((prev) => !prev);
            if (isFavorited) {
                // Remove from favorites
                await FavoritesAPI.removeAgent(agentId);
                toast.success("Agent removed from favorites");
                // Update local state
                setFavorites(favorites.filter((agent) => agent._id !== agentId));
            }
            else {
                // Add to favorites
                await FavoritesAPI.addAgent(agentId);
                toast.success("Agent added to favorites");
                // Refresh favorites to get the updated list
                fetchFavorite();
            }
        }
        catch (_error) {
            // Revert UI state if operation fails
            setIsFavorited((prev) => !prev);
            toast.error("Failed to update favorites");
        }
    };
    if (loading) {
        return (<div className="min-h-screen bg-white items-center justify-center">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-2 border-orange-100 border-t-orange-300 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <p className="mt-6 text-gray-600 text-lg">Loading agent information...</p>
        </div>
        <Footer />
      </div>);
    }
    if (error || !agent) {
        return (<div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Agent not found
            </h2>
            <p className="mt-4 text-gray-600 text-xl mb-8">
              {error ||
                "The agent you're looking for doesn't exist or has been removed."}
            </p>
            <Link href="/agents" className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold">
              Back to Agents
            </Link>
          </div>
        </div>
        <Footer />
      </div>);
    }
    return (<main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Enhanced Hero Section with modern styling */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-blue-50"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-100 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-100 rounded-full opacity-50 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-orange-100 to-blue-100 rounded-full opacity-30 animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            {/* Agent Info */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="order-2 lg:order-1">
              <div className="flex items-center gap-4 mb-6">
                {agent.agentInfo.verified && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                    <FaCheckCircle className="text-green-600 text-sm"/>
                    <span className="text-green-700 text-sm font-medium">Verified Agent</span>
                  </motion.div>)}
              </div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {agent.name}
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="text-xl text-gray-600 mb-6">
                {agent.agentInfo.role || "Real Estate Agent"} • {agent.agentInfo.experience} years experience
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  {renderStars(agent.agentInfo.rating)}
                  <span className="text-gray-900 font-bold text-lg">{agent.agentInfo.rating.toFixed(1)}</span>
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <span className="text-gray-600">
                  {reviews.length} reviews
                </span>
                {((_a = agent.address) === null || _a === void 0 ? void 0 : _a.city) && (<>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <IoLocationOutline className="text-orange-500"/>
                      <span>{agent.address.city}</span>
                    </div>
                  </>)}
              </motion.div>

              {/* Quick Stats */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{(stats === null || stats === void 0 ? void 0 : stats.activeListings) || 0}</div>
                  <div className="text-gray-600 text-sm">Active Listings</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{(stats === null || stats === void 0 ? void 0 : stats.soldProperties) || 0}</div>
                  <div className="text-gray-600 text-sm">Properties Sold</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{(stats === null || stats === void 0 ? void 0 : stats.rentedProperties) || 0}</div>
                  <div className="text-gray-600 text-sm">Properties Rented</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{agent.agentInfo.experience}+</div>
                  <div className="text-gray-600 text-sm">Years Experience</div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex flex-wrap gap-4">
                <button onClick={() => router.push("/contact")} className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                  Contact Agent
                </button>
                <button onClick={() => toggleFavorite(agent._id)} className={`px-8 py-4 rounded-xl border-2 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 ${isFavorited
            ? "bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100"
            : "bg-white border-gray-200 text-gray-600 hover:border-orange-200 hover:text-orange-600"}`}>
                  {isFavorited ? <FaHeart /> : <FaRegHeart />}
                  {isFavorited ? "Saved" : "Save"}
                </button>
              </motion.div>
            </motion.div>

            {/* Agent Image */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="order-1 lg:order-2">
              <div className="relative">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <Image src={agent.image || "/placeholder-agent.png"} alt={agent.name} fill className="object-cover"/>
                </motion.div>
                
                {/* Floating elements */}
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 1 }} className="absolute -top-4 -right-4 bg-orange-500 text-white p-4 rounded-full shadow-lg">
                  <FaBuilding className="text-2xl"/>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Agent Info */}
      <motion.section initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Enhanced About Section */}
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 hover:shadow-xl hover:border-orange-300 transition-all duration-500 group">
                <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="text-3xl font-bold text-gray-900 mb-6">
                  About {agent.name}
                </motion.h2>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1 }} className="text-gray-700 mb-8 leading-relaxed text-lg">
                  {agent.bio ||
            `Experienced ${agent.agentInfo.role || "real estate agent"} specializing in ${((_b = agent.agentInfo.specializations) === null || _b === void 0 ? void 0 : _b.join(", ")) || "property sales and acquisition"}.`}
                </motion.p>
                
                {/* Enhanced Details Grid */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.2 }} className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ duration: 0.3 }} className="bg-gray-50 border border-gray-200 p-6 rounded-xl group hover:border-orange-300 hover:shadow-lg text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <FaBuilding className="w-6 h-6 text-orange-600"/>
                    </div>
                    <div className="text-orange-600 font-medium mb-2 text-sm">
                      Experience
                    </div>
                    <div className="text-gray-900 font-bold text-xl group-hover:text-orange-600 transition-colors">
                      {agent.agentInfo.experience} years
                    </div>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ duration: 0.3 }} className="bg-gray-50 border border-gray-200 p-6 rounded-xl group hover:border-blue-300 hover:shadow-lg text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <FaMapMarkerAlt className="w-6 h-6 text-blue-600"/>
                    </div>
                    <div className="text-blue-600 font-medium mb-2 text-sm">
                      Specialization
                    </div>
                    <div className="text-gray-900 font-bold text-lg group-hover:text-blue-600 transition-colors">
                      {((_c = agent.agentInfo.specializations) === null || _c === void 0 ? void 0 : _c.join(", ")) || "Residential"}
                    </div>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ duration: 0.3 }} className="bg-gray-50 border border-gray-200 p-6 rounded-xl group hover:border-green-300 hover:shadow-lg text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <FaStar className="w-6 h-6 text-green-600"/>
                    </div>
                    <div className="text-green-600 font-medium mb-2 text-sm">
                      Languages
                    </div>
                    <div className="text-gray-900 font-bold text-lg group-hover:text-green-600 transition-colors">
                      {((_d = agent.agentInfo.languages) === null || _d === void 0 ? void 0 : _d.join(", ")) || "English"}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Enhanced Properties Gallery */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Properties Listed by {agent.name}
                  </h2>
                  <div className="text-sm text-gray-600 bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
                    {properties.length} Properties
                  </div>
                </motion.div>
                
                {properties.length > 0 ? (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {properties.map((property, index) => {
                var _a, _b;
                return (<motion.div key={property._id} initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, delay: 1 + index * 0.1 }} whileHover={{ y: -8, scale: 1.02 }} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-orange-300 hover:shadow-xl transition-all duration-500 group cursor-pointer">
                        {/* Property Image */}
                        <div className="relative h-56 overflow-hidden">
                          <Image src={property.images[0] || "/placeholder-property.jpg"} alt={property.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500"/>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                          
                          {/* Property Type Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-gray-800 backdrop-blur-md shadow-lg border border-white/50">
                              <FaBuilding className="w-3 h-3 mr-1"/>
                              {property.propertyType}
                            </span>
                          </div>

                          {/* Listing Type Badge */}
                          <div className="absolute top-4 right-4">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg ${property.listingType === 'sale'
                        ? "bg-green-500/90 text-white border border-green-400"
                        : "bg-blue-500/90 text-white border border-blue-400"}`}>
                              {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                            </span>
                          </div>
                          
                          {/* View Property Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300 border border-white/30">
                              <FaEye className="w-6 h-6 text-white"/>
                            </div>
                          </div>
                        </div>
                        
                        {/* Property Details */}
                        <div className="p-6 space-y-4">
                          {/* Property Title & Location */}
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 line-clamp-1">
                              {property.title}
                            </h3>
                            <div className="flex items-center text-gray-600 text-sm">
                              <FaMapMarkerAlt className="w-4 h-4 mr-2 text-orange-500"/>
                              <span className="line-clamp-1">
                                {(_a = property.address) === null || _a === void 0 ? void 0 : _a.city}
                                {((_b = property.address) === null || _b === void 0 ? void 0 : _b.state) ? `, ${property.address.state}` : ""}
                              </span>
                            </div>
                          </div>

                          {/* Property Info Grid */}
                          <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100">
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-600">{property.bedrooms}</div>
                              <div className="text-xs text-gray-600">Bedrooms</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">{property.bathrooms}</div>
                              <div className="text-xs text-gray-600">Bathrooms</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600">{property.area}</div>
                              <div className="text-xs text-gray-600">Sq.ft</div>
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                            <div className="text-orange-700 font-medium text-sm">Price</div>
                            <div className="text-orange-800 font-bold text-lg">
                              ₹{property.price.toLocaleString()}
                            </div>
                          </div>

                          {/* View Property Button */}
                          <div className="pt-2">
                            <Link href={`/search/${property._id}`} className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-orange-500/25 group-hover:shadow-xl">
                              <FaEye className="w-4 h-4 mr-2"/>
                              View Details
                              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </motion.div>);
            })}
                  </motion.div>) : (
        /* No Properties Fallback */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaBuilding className="w-10 h-10 text-gray-400"/>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      No Properties Listed
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      This agent hasn&apos;t listed any properties yet. Contact them directly for assistance with your property needs.
                    </p>
                    <button onClick={() => router.push("/contact")} className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold">
                      Contact Agent
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </motion.div>)}

                {/* Pagination */}
                {pagination.pages > 1 && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.2 }} className="flex justify-center mt-10 pt-8 border-t border-gray-200">
                    <div className="flex space-x-2">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (<button key={page} onClick={() => fetchAgentDetails(page)} className={`px-4 py-2 rounded-lg transition-all duration-300 ${pagination.page === page
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-white border border-gray-300 text-gray-700 hover:border-orange-300 hover:text-orange-600"}`}>
                            {page}
                          </button>))}
                    </div>
                  </motion.div>)}
              </motion.div>
            </div>

            {/* Enhanced Sidebar */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="space-y-8">
              {/* Quick Actions Card */}
              <motion.div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 hover:shadow-xl hover:border-orange-300 transition-all duration-500 group" whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="text-2xl font-bold text-gray-900 mb-6">
                  Quick Actions
                </motion.h3>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1 }} className="space-y-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <button onClick={() => router.push("/contact")} className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-orange-500/25 font-semibold group">
                      <FaEnvelope className="w-5 h-5 group-hover:scale-110 transition-transform"/>
                      Contact Agent
                    </button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <button onClick={() => router.push("/contact")} className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-500/25 font-semibold group">
                      <FaCalendarAlt className="w-5 h-5 group-hover:scale-110 transition-transform"/>
                      Schedule Meeting
                    </button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <button onClick={() => toggleFavorite(agent._id)} className={`w-full px-6 py-4 border-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 font-semibold group ${isFavorited
            ? "bg-orange-50 border-orange-300 text-orange-600 hover:bg-orange-100"
            : "bg-gray-50 border-gray-300 text-gray-700 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50"}`}>
                      <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
                        {isFavorited ? <FaHeart /> : <FaRegHeart />}
                      </motion.div>
                      {isFavorited ? "Saved to Favorites" : "Add to Favorites"}
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Contact Information Card */}
              <motion.div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 hover:shadow-xl hover:border-orange-300 transition-all duration-500 group" whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.2 }} className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </motion.h3>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.4 }} className="space-y-6">
                  {agent.phone && (<motion.div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 group" whileHover={{ scale: 1.02 }}>
                      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }} className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaPhone className="w-6 h-6 text-blue-600"/>
                      </motion.div>
                      <div>
                        <div className="font-semibold text-blue-600 mb-1">Phone</div>
                        <div className="text-gray-700">{agent.phone}</div>
                      </div>
                    </motion.div>)}
                  
                  <motion.div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 group" whileHover={{ scale: 1.02 }}>
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }} className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaEnvelope className="w-6 h-6 text-green-600"/>
                    </motion.div>
                    <div>
                      <div className="font-semibold text-green-600 mb-1">Email</div>
                      <div className="text-gray-700">{agent.email}</div>
                    </div>
                  </motion.div>
                  
                  {((_f = agent.address) === null || _f === void 0 ? void 0 : _f.city) && (<motion.div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 group" whileHover={{ scale: 1.02 }}>
                      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }} className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaMapMarkerAlt className="w-6 h-6 text-orange-600"/>
                      </motion.div>
                      <div>
                        <div className="font-semibold text-orange-600 mb-1">Location</div>
                        <div className="text-gray-700">
                          {agent.address.city}
                          {agent.address.state ? `, ${agent.address.state}` : ""}
                        </div>
                      </div>
                    </motion.div>)}

                  {agent.agentInfo.agency && (<motion.div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 group" whileHover={{ scale: 1.02 }}>
                      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }} className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaBuilding className="w-6 h-6 text-purple-600"/>
                      </motion.div>
                      <div>
                        <div className="font-semibold text-purple-600 mb-1">Agency</div>
                        <div className="text-gray-700">{agent.agentInfo.agency}</div>
                      </div>
                    </motion.div>)}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Enhanced Reviews Section */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1 }} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.2 }}>
            <div className="flex justify-between items-center mb-8">
              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.4 }} className="text-3xl font-bold text-gray-900">
                Client Reviews
              </motion.h2>
              <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 1.6 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {
            if (!token) {
                toast.error("Please login to write a review");
            }
            else {
                setShowReviewForm(!showReviewForm);
            }
        }} className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-300 shadow-lg font-semibold">
                {showReviewForm ? "Cancel Review" : "Write a Review"}
              </motion.button>
            </div>

            <AnimatePresence>
              {showReviewForm && (<motion.div initial={{ opacity: 0, height: 0, y: -20 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -20 }} transition={{ duration: 0.5 }} className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 overflow-hidden">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Share Your Experience
                  </h3>
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Your Name</label>
                      <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900" required/>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Your Rating
                      </label>
                      <div className="flex gap-1">{renderStars(0, true)}</div>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Your Review
                      </label>
                      <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent h-32 text-gray-900 resize-none" placeholder="Share your experience working with this agent..." required></textarea>
                    </div>
                    <button type="submit" className="px-8 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-300 font-semibold shadow-lg">
                      Submit Review
                    </button>
                  </form>
                </motion.div>)}
            </AnimatePresence>

            {reviews.length > 0 ? (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.8 }} className="space-y-6">
                {reviews.map((review, index) => (<motion.div key={review._id || index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 2 + index * 0.1 }} className="border-b border-gray-200 pb-6 last:border-0 p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-semibold text-gray-900 text-lg">
                        {review.user || review.userName || "Anonymous"}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {new Date(review.createdAt || review.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-gray-600 text-sm font-medium">
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                      {review.comment || review.text}
                    </p>
                  </motion.div>))}
              </motion.div>) : (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.8 }} className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">No reviews yet</div>
                <div className="text-gray-400">Be the first to leave a review!</div>
              </motion.div>)}
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </main>);
}
