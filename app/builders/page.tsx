"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Link from "next/link";
import Image from "next/image";

import {
  Star,
  Building,
  Search,
  AlertTriangle,
  Loader2,
  Award,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react";

// Define the Builder type
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
  email: string;
  projectsList?: Array<{
    _id: string;
    projectName: string;
    projectType: string;
    locality: string;
    city: string;
    projectImages: string[];
    createdAt: string;
    status: string;
  }>;
  experience: number;
  verified: boolean;
}

export default function BuildersPage() {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [filteredBuilders, setFilteredBuilders] = useState<Builder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Fetch builders from API
  useEffect(() => {
    const fetchBuilders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/builders");

        if (!response.ok) {
          throw new Error("Failed to fetch builders");
        }

        const data = await response.json();
        setBuilders(data.builders);
        setFilteredBuilders(data.builders);
      } catch (_err) {
        setError("Error loading builders. Please try again later.");

      } finally {
        setIsLoading(false);
      }
    };

    fetchBuilders();
  }, []);

  // Filter builders based on search term and active filter
  useEffect(() => {
    let filtered = builders;

    // Apply search term filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (builder) =>
          builder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          builder.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          builder.specialization
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Apply category filter
    if (activeFilter === "top-rated") {
      filtered = filtered.filter((builder) => builder.rating >= 4.5);
    } else if (activeFilter === "established") {
      // Assuming established means more than 10 completed projects
      filtered = filtered.filter((builder) => builder.completed > 10);
    }

    setFilteredBuilders(filtered);
  }, [searchTerm, builders, activeFilter]);

  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          size={16}
          fill="#FFD700"
          stroke="#FFD700"
          className="text-yellow-500"
        />,
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          size={16}
          fill="#FFD700"
          stroke="#FFD700"
          className="text-yellow-500"
        />,
      );
    }

    // Empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          size={16}
          stroke="#6B7280"
          className="text-gray-400"
        />,
      );
    }

    return stars;
  };

  // Filter buttons
  const filterButtons = [
    { id: "all", label: "All Builders", icon: Building },
    { id: "top-rated", label: "Top Rated", icon: Star },
    { id: "established", label: "Established", icon: Award },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[100vh] flex items-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        >
          <Image
            src="/hero.avif"
            alt="Luxury real estate"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black/70"></div>
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 rounded-full mb-6">
              <span className="text-white font-medium tracking-wider text-sm ">
                PREMIUM BUILDERS
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8">
              Find Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Dream Home
              </span>{" "}
              Builder
            </h1>

            <p className="text-xl text-gray-300 mb-10 max-w-2xl">
              Connect with India&apos;s most prestigious builders to create the
              home you&apos;ve always envisioned.
            </p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <a
                href="#builders-section"
                className="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition-all duration-300 shadow-lg shadow-orange-500/20"
              >
                <Building size={18} />
                Explore Builders
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300"
              >
                <MapPin size={18} />
                Request Consultation
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-orange-500"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.div>
      </section>

      {/* Builders Grid Section */}
      <section id="builders-section" className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-6 md:mb-0"
            >
              <h2 className="text-3xl font-bold mb-2">
                <span className="text-white">Premium </span>
                <span className="text-orange-500">Builders</span>
              </h2>
              <p className="text-gray-400">
                Discover the finest builders in the industry
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative w-full md:w-96"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search builders..."
                  value={searchTerm}
                  onChange={(_e) => setSearchTerm(_e.target.value)}
                  className="w-full px-5 py-3 pr-12 rounded-full border-2 border-orange-500/30 bg-black/80 focus:outline-none focus:border-orange-500 text-white placeholder-gray-500 transition-all duration-300"
                />
                <div className="absolute right-4 top-3 text-orange-500">
                  <Search size={20} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filter Buttons */}
          <motion.div
            className="flex flex-wrap gap-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {filterButtons.map((button) => {
              const Icon = button.icon;
              return (
                <button
                  key={button.id}
                  onClick={() => setActiveFilter(button.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${
                    activeFilter === button.id
                      ? "bg-orange-500 text-white"
                      : "bg-neutral-900 text-gray-300 hover:bg-neutral-800"
                  }`}
                >
                  <Icon size={16} />
                  {button.label}
                </button>
              );
            })}
          </motion.div>

          {/* Builders Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2
                size={40}
                className="animate-spin text-orange-500 mb-4"
              />
              <p className="text-gray-400">Loading premium builders...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-orange-900/20">
              <AlertTriangle
                size={40}
                className="mx-auto text-orange-500/50 mb-4"
              />
              <h3 className="text-xl font-semibold text-orange-500 mb-2">
                {error}
              </h3>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBuilders.map((builder, index) => (
                <motion.div
                  key={builder._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link href={`/builders/${builder._id}`}>
                    <div className="relative bg-neutral-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-orange-500/20 transition-all duration-300 border border-neutral-800/50">
                      {/* Card Header */}
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={builder.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'}
                          alt={builder.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

                        {/* Logo Badge */}
                        <div className="absolute bottom-0 left-0 p-4 flex items-end">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-full p-1 shadow-md">
                              <div className="relative w-full h-full overflow-hidden rounded-full">
                                <Image
                                  src={builder.logo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'}
                                  alt={`${builder.title} logo`}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face';
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">
                                {builder.title}
                              </h3>
                              <div className="flex items-center gap-1 mt-1">
                                {renderStars(builder.rating)}
                                <span className="text-white text-xs ml-1">
                                  ({builder.rating})
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        <p className="text-gray-400 text-sm mb-5 line-clamp-2">
                          {builder.description}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 mb-5">
                          <div className="flex flex-col items-center bg-neutral-800/50 rounded-lg py-2">
                            <span className="text-orange-500 font-semibold">
                              {builder.projects}
                            </span>
                            <span className="text-xs text-gray-400">
                              Projects
                            </span>
                          </div>
                          <div className="flex flex-col items-center bg-neutral-800/50 rounded-lg py-2">
                            <span className="text-orange-500 font-semibold">
                              {builder.completed}
                            </span>
                            <span className="text-xs text-gray-400">
                              Completed
                            </span>
                          </div>
                          <div className="flex flex-col items-center bg-neutral-800/50 rounded-lg py-2">
                            <span className="text-orange-500 font-semibold">
                              {builder.ongoing}
                            </span>
                            <span className="text-xs text-gray-400">
                              Ongoing
                            </span>
                          </div>
                        </div>

                        {/* Builder Details */}
                        <div className="space-y-2 mb-5">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar size={14} className="text-orange-500" />
                            <span className="text-gray-400">
                              Est. {builder.established}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase size={14} className="text-orange-500" />
                            <span className="text-gray-300">
                              {builder.specialization}
                            </span>
                          </div>
                        </div>

                        {/* View Profile Button */}
                        <div className="mt-4 pt-4 border-t border-neutral-800">
                          <div className="relative overflow-hidden group-hover:overflow-visible">
                            <div className="flex justify-between items-center">
                              <span className="text-orange-500 font-medium">
                                View Profile
                              </span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-orange-500 transform transition-transform duration-300 group-hover:translate-x-1"
                              >
                                <path d="m5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                              </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && filteredBuilders.length === 0 && (
            <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-orange-900/20">
              <Search size={40} className="mx-auto text-orange-500/30 mb-4" />
              <h3 className="text-xl font-semibold text-orange-500 mb-2">
                No builders found
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                We couldn&apos;t find any builders matching your search
                criteria. Try adjusting your search or explore our full list of
                builders.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("all");
                }}
                className="mt-6 px-6 py-2.5 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition-all"
              >
                Show All Builders
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Partnership CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900 to-orange-800 opacity-90 z-0"></div>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-10 z-0"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
                <span className="text-white font-medium tracking-wider text-sm">
                  JOIN OUR NETWORK
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
                Are You a Premium Builder?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Partner with 100Gaj to showcase your projects to our extensive
                network of property seekers and increase your visibility in the
                luxury real estate market.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-5 justify-center"
            >
              <a
                href="/contact"
                className="px-8 py-4 bg-white text-orange-800 font-medium rounded-full hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Building size={18} />
                Become a Partner
              </a>
              <a
                href="/about"
                className="px-8 py-4 bg-black/50 backdrop-blur-sm text-white font-medium rounded-full hover:bg-black/70 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Learn More
              </a>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
            >
              <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  2.5M+
                </p>
                <p className="text-sm text-white/70">Monthly Visitors</p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  150+
                </p>
                <p className="text-sm text-white/70">Premium Builders</p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  5000+
                </p>
                <p className="text-sm text-white/70">Properties Listed</p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  95%
                </p>
                <p className="text-sm text-white/70">Client Satisfaction</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
