"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaEye, FaCheckCircle } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { FavoritesAPI } from "@/app/lib/api-helpers";
import { PropertyNewsWhiteSection } from "@/components/ui/property-news-white";

// Types
interface Project {
  _id: string;
  name: string;
  location: string;
  status: "Completed" | "Ongoing";
  type: string;
  images: string[];
  tagline?: string;
  amenities?: string[];
  unitTypes?: any[];
  possessionDate?: string;
}

interface Review {
  _id?: string;
  user: string;
  rating: number;
  date: string;
  text: string;
}

interface Builder {
  _id: string;
  title: string;
  name: string;
  image: string;
  logo: string;
  projects: number;
  description: string;
  established: string;
  headquarters: string;
  specialization: string;
  rating: number;
  completed: number;
  ongoing: number;
  about?: string;
  projects_list?: Project[];
  reviews?: Review[];
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
  };
  experience: number;
  verified: boolean;
}

export default function BuilderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [builder, setBuilder] = useState<Builder | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [userName, setUserName] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Builder[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [builderId, setBuilderId] = useState<string>('');
  const [otherBuilders, setOtherBuilders] = useState<Builder[]>([]);
  const [currentBuilderIndex, setCurrentBuilderIndex] = useState(0);

  // Resolve params
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setBuilderId(resolvedParams.id);
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
        const buildersData = await FavoritesAPI.getBuilders();
        setFavorites(buildersData.favorites);

        // Check if current builder is in favorites
        if (
          builder &&
          buildersData.favorites.some((fav: Builder) => fav._id === builder._id)
        ) {
          setIsFavorited(true);
        } else {
          setIsFavorited(false);
        }
      } catch (_error) {
        toast.error("Failed to fetch favorites");
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchFavorite();
    }
  }, [token]);

  // Update isFavorited when builder or favorites change
  useEffect(() => {
    if (builder && favorites.length > 0) {
      setIsFavorited(favorites.some((fav) => fav._id === builder._id));
    }
  }, [builder, favorites]);

  useEffect(() => {
    const fetchBuilder = async () => {
      if (!builderId) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/builders/${builderId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Builder not found");
          }
          throw new Error("Failed to fetch builder details");
        }

        const data = await response.json();
        setBuilder(data.builder);
        setReviews(data.builder.reviews || []);
        
        // Fetch other builders for carousel
        fetchOtherBuilders(builderId);
      } catch (_err) {
        setError((_err as Error).message || "Failed to load builder details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuilder();
  }, [builderId]);

  // Fetch other builders for carousel
  const fetchOtherBuilders = async (currentBuilderId: string) => {
    try {
      const response = await fetch('/api/builders');
      if (response.ok) {
        const data = await response.json();
        // Filter out current builder and take first 6
        const filtered = data.builders.filter((b: Builder) => b._id !== currentBuilderId).slice(0, 6);
        setOtherBuilders(filtered);
      }
    } catch (error) {
      console.error('Failed to fetch other builders:', error);
    }
  };

  // Carousel navigation functions
  const nextBuilder = () => {
    setCurrentBuilderIndex((prev) => 
      prev + 3 >= otherBuilders.length ? 0 : prev + 3
    );
  };

  const prevBuilder = () => {
    setCurrentBuilderIndex((prev) => 
      prev - 3 < 0 ? Math.max(0, otherBuilders.length - 3) : prev - 3
    );
  };

  const handleSubmitReview = async (_e: React.FormEvent) => {
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
      setIsSubmitting(true);

      const reviewData = {
        user: userName,
        rating: userRating,
        text: reviewText,
      };

      const response = await fetch(`/api/builders/${builderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const data = await response.json();

      // Update the builder and reviews with the response data
      setBuilder(data.builder);
      setReviews(data.builder.reviews || []);

      // Reset form
      setUserRating(0);
      setReviewText("");
      setUserName("");
      setShowReviewForm(false);
    } catch (_err) {
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle favorite status for builder
  const toggleFavorite = async (builderId: string) => {
    if (!token) {
      toast.error("Please login to add favorites");
      return;
    }

    try {
      // Optimistically update UI first for responsive feedback
      setIsFavorited((prev) => !prev);

      if (isFavorited) {
        // Remove from favorites
        await FavoritesAPI.removeBuilder(builderId);
        toast.success("Builder removed from favorites");
        // Update local state
        setFavorites(favorites.filter((builder) => builder._id !== builderId));
      } else {
        // Add to favorites
        await FavoritesAPI.addBuilder(builderId);
        toast.success("Builder added to favorites");
        // Refresh favorites to get the updated list
        fetchFavorite();
      }
    } catch (_error) {
      // Revert UI state if operation fails
      setIsFavorited((prev) => !prev);
      toast.error("Failed to update favorites");
    }
  };

  // Function to render stars based on rating
  const renderStars = (rating: number, interactive = false) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        stars.push(
          <button
            key={i}
            type="button"
            onClick={() => setUserRating(i)}
            onMouseEnter={() => setHoveredRating(i)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none transition-colors duration-200"
          >
            {i <= (hoveredRating || userRating) ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-orange-500"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            )}
          </button>,
        );
      } else {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        if (i <= fullStars) {
          stars.push(
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-orange-500"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>,
          );
        } else if (i === fullStars + 1 && hasHalfStar) {
          stars.push(
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-orange-500"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>,
          );
        } else {
          stars.push(
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>,
          );
        }
      }
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white items-center justify-center">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-2 border-orange-100 border-t-orange-300 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <p className="mt-6 text-gray-600 text-lg">Loading builder information...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {error}
            </h2>
            <p className="mt-4 text-gray-600 text-xl mb-8">
              The builder you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/builders"
              className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              Back to Builders
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!builder) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Builder not found
            </h2>
            <p className="mt-4 text-gray-600 text-xl mb-8">
              The builder you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/builders"
              className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              Back to Builders
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
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
            {/* Builder Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white"
                >
                  <Image
                    src={builder.logo}
                    alt={`${builder.title} logo`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </motion.div>
                {builder.verified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full border border-green-200"
                  >
                    <FaCheckCircle className="text-green-600 text-sm" />
                    <span className="text-green-700 text-sm font-medium">Verified Builder</span>
                  </motion.div>
                )}
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              >
                {builder.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl text-gray-600 mb-6"
              >
                {builder.specialization} • Established {builder.established}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="flex items-center gap-2">
                  {renderStars(builder.rating)}
                  <span className="text-gray-900 font-bold text-lg">{builder.rating}</span>
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <span className="text-gray-600">
                  {reviews.length} reviews
                </span>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="flex items-center gap-1 text-gray-600">
                  <IoLocationOutline className="text-orange-500" />
                  <span>{builder.headquarters}</span>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              >
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{builder.projects}</div>
                  <div className="text-gray-600 text-sm">Total Projects</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{builder.experience}+</div>
                  <div className="text-gray-600 text-sm">Years Experience</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{builder.completed}</div>
                  <div className="text-gray-600 text-sm">Completed</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{builder.ongoing}</div>
                  <div className="text-gray-600 text-sm">Ongoing</div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Contact Builder
                </Link>
                <button
                  onClick={() => toggleFavorite(builder._id)}
                  className={`px-8 py-4 rounded-xl border-2 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 ${
                    isFavorited
                      ? "bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100"
                      : "bg-white border-gray-200 text-gray-600 hover:border-orange-200 hover:text-orange-600"
                  }`}
                >
                  {isFavorited ? <FaHeart /> : <FaRegHeart />}
                  {isFavorited ? "Saved" : "Save"}
                </button>
              </motion.div>
            </motion.div>

            {/* Builder Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
                >
                  <Image
                    src={builder.image}
                    alt={builder.title}
                    fill
                    className="object-cover"
                  />
                </motion.div>
                
                {/* Floating elements */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="absolute -top-4 -right-4 bg-orange-500 text-white p-4 rounded-full shadow-lg"
                >
                  <FaBuilding className="text-2xl" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Builder Info */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="py-16 relative"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Enhanced About Section */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 hover:shadow-xl hover:border-orange-300 transition-all duration-500 group"
              >
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-3xl font-bold text-gray-900 mb-6"
                >
                  About {builder.title}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="text-gray-700 mb-8 leading-relaxed text-lg"
                >
                  {builder.about || builder.description}
                </motion.p>
                
                {/* Enhanced Stats Grid */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 border border-gray-200 p-6 rounded-xl group hover:border-orange-300 hover:shadow-lg text-center"
                  >
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-orange-600 font-medium mb-2 text-sm">
                      Established
                    </div>
                    <div className="text-gray-900 font-bold text-xl group-hover:text-orange-600 transition-colors">
                      {builder.established}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 border border-gray-200 p-6 rounded-xl group hover:border-blue-300 hover:shadow-lg text-center"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-blue-600 font-medium mb-2 text-sm">
                      Headquarters
                    </div>
                    <div className="text-gray-900 font-bold text-xl group-hover:text-blue-600 transition-colors">
                      {builder.headquarters}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 border border-gray-200 p-6 rounded-xl group hover:border-green-300 hover:shadow-lg text-center"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-green-600 font-medium mb-2 text-sm">
                      Total Projects
                    </div>
                    <div className="text-gray-900 font-bold text-xl group-hover:text-green-600 transition-colors">
                      {builder.projects}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 border border-gray-200 p-6 rounded-xl group hover:border-purple-300 hover:shadow-lg text-center"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-purple-600 font-medium mb-2 text-sm">
                      Specialization
                    </div>
                    <div className="text-gray-900 font-bold text-lg group-hover:text-purple-600 transition-colors">
                      {builder.specialization}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Enhanced Projects Gallery */}
              {builder.projects_list && builder.projects_list.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 mb-8"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex justify-between items-center mb-8"
                  >
                    <h2 className="text-3xl font-bold text-gray-900">
                      Featured Projects
                    </h2>
                    <div className="text-sm text-gray-600 bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
                      {builder.projects_list.length} Projects
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                  >
                    {builder.projects_list.map((project, index) => (
                      <motion.div
                        key={project._id || index}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-orange-300 hover:shadow-xl transition-all duration-500 group cursor-pointer"
                        onClick={() => {
                          if (project._id) {
                            window.open(`/projects/${project._id}`, '_blank');
                          }
                        }}
                      >
                        {/* Project Image */}
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={project.images?.[0] || "/placeholder-project.jpg"}
                            alt={project.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Status Badge */}
                          <div className="absolute top-4 left-4">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg ${
                              project.status === "Completed" 
                                ? "bg-green-500/90 text-white border border-green-400" 
                                : "bg-orange-500/90 text-white border border-orange-400"
                            }`}>
                              <span className={`w-2 h-2 rounded-full mr-2 ${
                                project.status === "Completed" ? "bg-green-300" : "bg-orange-300"
                              }`}></span>
                              {project.status}
                            </span>
                          </div>

                          {/* Project Type Badge */}
                          <div className="absolute top-4 right-4">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-gray-800 backdrop-blur-md shadow-lg border border-white/50">
                              <FaBuilding className="w-3 h-3 mr-1" />
                              {project.type}
                            </span>
                          </div>
                          
                          {/* View Project Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300 border border-white/30">
                              <FaEye className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="bg-white/90 backdrop-blur-md rounded-lg p-3 border border-white/50">
                                <div className="text-gray-900 font-semibold text-sm">View Project Details</div>
                                <div className="text-gray-600 text-xs mt-1">Click to explore this project</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Project Details */}
                        <div className="p-6 space-y-4">
                          {/* Project Title & Location */}
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 line-clamp-1">
                              {project.name}
                            </h3>
                            <div className="flex items-center text-gray-600 text-sm">
                              <FaMapMarkerAlt className="w-4 h-4 mr-2 text-orange-500" />
                              <span className="line-clamp-1">{project.location}</span>
                            </div>
                          </div>

                          {/* Project Info Grid */}
                          <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                            {project.unitTypes && project.unitTypes.length > 0 && (
                              <div className="text-center">
                                <div className="text-lg font-bold text-orange-600">{project.unitTypes.length}</div>
                                <div className="text-xs text-gray-600">Unit Types</div>
                              </div>
                            )}
                            {project.amenities && project.amenities.length > 0 && (
                              <div className="text-center">
                                <div className="text-lg font-bold text-blue-600">{project.amenities.length}+</div>
                                <div className="text-xs text-gray-600">Amenities</div>
                              </div>
                            )}
                          </div>
                          
                          {/* Project Tagline */}
                          {project.tagline && (
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 group-hover:text-gray-900 transition-colors duration-300">
                                {project.tagline}
                              </p>
                            </div>
                          )}
                          
                          {/* Key Amenities */}
                          {project.amenities && project.amenities.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-gray-800">Key Amenities</div>
                              <div className="flex flex-wrap gap-2">
                                {project.amenities.slice(0, 3).map((amenity, amenityIndex) => (
                                  <span
                                    key={amenityIndex}
                                    className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 text-xs rounded-lg border border-orange-200 font-medium"
                                  >
                                    {amenity}
                                  </span>
                                ))}
                                {project.amenities.length > 3 && (
                                  <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs rounded-lg border border-gray-300 font-medium">
                                    +{project.amenities.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Possession Date */}
                          {project.possessionDate && (
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                              <div className="flex items-center text-blue-700">
                                <FaCalendarAlt className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium">Possession</span>
                              </div>
                              <div className="text-blue-800 font-semibold text-sm">
                                {new Date(project.possessionDate).toLocaleDateString('en-IN', { 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}
                              </div>
                            </div>
                          )}

                          {/* View Project Button */}
                          <div className="pt-2">
                            <Link
                              href={`/projects/${project._id}`}
                              className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-orange-500/25 group-hover:shadow-xl"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaEye className="w-4 h-4 mr-2" />
                              View Project Details
                              <svg 
                                className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  {/* View All Projects Button */}
                  {builder.projects_list.length > 6 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                      className="text-center mt-10 pt-8 border-t border-gray-200"
                    >
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Explore All Projects
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Discover all {builder.projects_list.length} projects by {builder.title}
                        </p>
                        <Link
                          href={`/builders/${builder._id}/projects`}
                          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-orange-500/25 transform hover:scale-105"
                        >
                          View All {builder.projects_list.length} Projects
                          <svg 
                            className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                /* No Projects Fallback */
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 mb-8"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Projects by {builder.title}
                  </h2>
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaBuilding className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      No Projects Available
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      This builder hasn&apos;t added any projects yet. Check back later or contact them directly for more information about their upcoming projects.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold"
                    >
                      Contact Builder
                      <svg 
                        className="w-4 h-4 ml-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Property News Section */}
              <PropertyNewsWhiteSection />

              {/* Other Builders Carousel */}
              {otherBuilders.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 mb-8"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                      Other Featured Builders
                    </h2>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={prevBuilder}
                        className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-orange-100 hover:text-orange-600 transition-all duration-300"
                      >
                        <FaChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextBuilder}
                        className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-orange-100 hover:text-orange-600 transition-all duration-300"
                      >
                        <FaChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherBuilders.slice(currentBuilderIndex, currentBuilderIndex + 3).map((otherBuilder, index) => (
                      <motion.div
                        key={otherBuilder._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-orange-300 hover:shadow-xl transition-all duration-500 group cursor-pointer"
                        onClick={() => window.open(`/builders/${otherBuilder._id}`, '_blank')}
                      >
                        {/* Builder Image */}
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={otherBuilder.image || "/placeholder-property.jpg"}
                            alt={otherBuilder.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* View Profile Overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-white/20 backdrop-blur-md rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        {/* Builder Details */}
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 line-clamp-1 mb-2">
                            {otherBuilder.title}
                          </h3>
                          
                          <div className="flex items-center text-gray-600 text-sm mb-3">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="line-clamp-1">{otherBuilder.headquarters || 'Multiple Locations'}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium text-orange-600">
                                {otherBuilder.projects || 0} Projects
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {otherBuilder.established}
                            </div>
                          </div>
                          
                          {otherBuilder.specialization && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200">
                                {otherBuilder.specialization}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Achievements & Certifications */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 mb-8"
              >
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="text-3xl font-bold text-gray-900 mb-6"
                >
                  Achievements & Certifications
                </motion.h2>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-orange-300 hover:shadow-lg group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                          Industry Recognition
                        </h3>
                        <p className="text-gray-600 text-sm">Excellence Awards</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Recognized as a leading developer in the NCR region with multiple awards for quality construction and timely delivery.
                    </p>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-green-300 hover:shadow-lg group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                          ISO Certified
                        </h3>
                        <p className="text-gray-600 text-sm">Quality Management</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      ISO 9001:2015 certified for quality management systems ensuring highest standards in construction.
                    </p>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          RERA Compliance
                        </h3>
                        <p className="text-gray-600 text-sm">100% Registered</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      All projects are RERA registered ensuring transparency and customer protection in every transaction.
                    </p>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-lg group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                          Green Building
                        </h3>
                        <p className="text-gray-600 text-sm">Sustainable Development</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Committed to sustainable construction practices with multiple green building certified projects.
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Enhanced Reviews */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="bg-white border border-gray-200 rounded-xl shadow-lg p-8"
              >
                <div className="flex justify-between items-center mb-8">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="text-3xl font-bold text-gray-900"
                  >
                    Customer Reviews
                  </motion.h2>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (!token) {
                        toast.error("Please login to write a review");
                      } else {
                        setShowReviewForm(!showReviewForm);
                      }
                    }}
                    className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-300 shadow-lg font-semibold"
                  >
                    {showReviewForm ? "Cancel Review" : "Write a Review"}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showReviewForm && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 overflow-hidden"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        Share Your Experience
                      </h3>
                      <form onSubmit={handleSubmitReview} className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        >
                          <label className="block text-orange-600 font-medium mb-2">
                            Your Name
                          </label>
                          <input
                            type="text"
                            value={userName}
                            onChange={(_e) => setUserName(_e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                            placeholder="Enter your name"
                            required
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          <label className="block text-orange-600 font-medium mb-2">
                            Your Rating
                          </label>
                          <div className="flex gap-1">{renderStars(0, true)}</div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                        >
                          <label className="block text-orange-600 font-medium mb-2">
                            Your Review
                          </label>
                          <textarea
                            value={reviewText}
                            onChange={(_e) => setReviewText(_e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 h-32 resize-none"
                            placeholder="Share your experience with this builder..."
                            required
                          />
                        </motion.div>
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-8 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-300 shadow-lg font-semibold ${
                            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <motion.svg
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </motion.svg>
                              Submitting...
                            </span>
                          ) : (
                            "Submit Review"
                          )}
                        </motion.button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {reviews.length > 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    className="space-y-6"
                  >
                    {reviews.map((review, index) => (
                      <motion.div
                        key={review._id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.8 + index * 0.1 }}
                        className="border-b border-gray-200 pb-6 last:border-0 p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="font-semibold text-orange-600 group-hover:text-orange-700 transition-colors">
                            {review.user}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {review.date}
                          </div>
                        </div>
                        <div className="flex items-center mb-4">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-gray-600 text-sm font-medium">
                            {review.rating}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                          {review.text}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    className="text-center py-12"
                  >
                    <div className="text-gray-500 text-lg mb-4">No reviews yet</div>
                    <div className="text-gray-400">Be the first to leave a review!</div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Enhanced Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-8"
            >
              {/* Quick Actions Card */}
              <motion.div 
                className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 hover:shadow-xl hover:border-orange-300 transition-all duration-500 group"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  Quick Actions
                </motion.h3>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="space-y-4"
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/contact"
                      className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-orange-500/25 font-semibold group"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                      Contact Builder
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <button
                      onClick={() => toggleFavorite(builder._id)}
                      className={`w-full px-6 py-4 border-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 font-semibold group ${
                        isFavorited
                          ? "bg-orange-50 border-orange-300 text-orange-600 hover:bg-orange-100"
                          : "bg-gray-50 border-gray-300 text-gray-700 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50"
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={isFavorited ? "currentColor" : "none"}
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      </motion.div>
                      {isFavorited ? "Saved to Favorites" : "Add to Favorites"}
                    </button>
                  </motion.div>
                  
                </motion.div>
              </motion.div>

              {/* Contact Information Card */}
              <motion.div 
                className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 hover:shadow-xl hover:border-orange-300 transition-all duration-500 group"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  Contact Information
                </motion.h3>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="space-y-6"
                >
                  <motion.div 
                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-orange-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                        />
                      </svg>
                    </motion.div>
                    <div>
                      <div className="font-semibold text-orange-600 mb-1">
                        Corporate Office
                      </div>
                      <div className="text-gray-700 leading-relaxed">
                        {builder.title} Tower, {builder.headquarters}
                        <br />
                        India - 110001
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-blue-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                        />
                      </svg>
                    </motion.div>
                    <div>
                      <div className="font-semibold text-blue-600 mb-1">Phone</div>
                      <div className="text-gray-700">
                        {builder.contact?.phone || "+91-11-42102030"}
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-green-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                    </motion.div>
                    <div>
                      <div className="font-semibold text-green-600 mb-1">Email</div>
                      <div className="text-gray-700">
                        {builder.contact?.email ||
                          `info@${builder.title.toLowerCase().replace(/\s+/g, "")}.com`}
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-purple-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                        />
                      </svg>
                    </motion.div>
                    <div>
                      <div className="font-semibold text-purple-600 mb-1">Website</div>
                      <div className="text-gray-700">
                        {builder.contact?.website ||
                          `www.${builder.title.toLowerCase().replace(/\s+/g, "")}.com`}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </main>
  );
}
