"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Image from "next/image";
import Link from "next/link";

// Define the Agent interface based on the API response
interface Agent {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  bio?: string;
  address?: {
    city?: string;
    state?: string;
  };
  isAgent: boolean;
  agentInfo: {
    role?: string;
    experience: number;
    rating: number;
    specializations: string[];
    languages: string[];
    properties?: number;
    agency?: string;
    verified: boolean;
  };
  social?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  lastActive?: string;
}

// Fallback agents data when API fails
// const fallbackAgentsData = [
//   {
//     id: "1",
//     name: "Rahul Sharma",
//     role: "Senior Property Consultant",
//     image: "/a1.jpg",
//     properties: 42,
//     rating: 4.8,
//     experience: "8 years",
//     specialization: "Residential Properties",
//     languages: ["English", "Hindi", "Punjabi"],
//     email: "rahul.sharma@100gaj.com",
//     phone: "+91 98765 43210",
//     about: "Rahul is a top-performing real estate agent with extensive experience in Delhi-NCR's property market. His deep understanding of local neighborhoods and market trends helps clients find their dream properties."
//   },
//   {
//     id: "2",
//     name: "Priya Verma",
//     role: "Luxury Property Specialist",
//     image: "/a2.jpg",
//     properties: 36,
//     rating: 4.7,
//     experience: "7 years",
//     specialization: "Luxury Apartments",
//     languages: ["English", "Hindi"],
//     email: "priya.verma@100gaj.com",
//     phone: "+91 98765 43211",
//     about: "Priya specializes in high-end residential properties, offering personalized service to discerning clients. Her network of connections allows her access to exclusive properties often before they hit the market."
//   },
//   {
//     id: "3",
//     name: "Amit Kumar",
//     role: "Commercial Property Expert",
//     image: "/a3.jpg",
//     properties: 28,
//     rating: 4.6,
//     experience: "6 years",
//     specialization: "Commercial Spaces",
//     languages: ["English", "Hindi", "Bengali"],
//     email: "amit.kumar@100gaj.com",
//     phone: "+91 98765 43212",
//     about: "Amit has built a strong reputation in commercial real estate, helping businesses find ideal office spaces and retail locations. His background in business administration gives him unique insights into client needs."
//   },
//   {
//     id: "4",
//     name: "Neha Singh",
//     role: "Investment Property Advisor",
//     image: "/a4.jpg",
//     properties: 31,
//     rating: 4.5,
//     experience: "5 years",
//     specialization: "Investment Properties",
//     languages: ["English", "Hindi", "Gujarati"],
//     email: "neha.singh@100gaj.com",
//     phone: "+91 98765 43213",
//     about: "Neha helps investors maximize their real estate portfolios. With a background in finance, she analyzes market trends to identify properties with the best appreciation potential and rental yields."
//   },
//   {
//     id: "5",
//     name: "Vikram Malhotra",
//     role: "New Development Specialist",
//     image: "/a6.jpg",
//     properties: 25,
//     rating: 4.7,
//     experience: "4 years",
//     specialization: "New Construction",
//     languages: ["English", "Hindi", "Punjabi"],
//     email: "vikram.malhotra@100gaj.com",
//     phone: "+91 98765 43214",
//     about: "Vikram specializes in new construction projects, helping clients navigate floor plans, customizations, and the buying process for homes that haven't been built yet."
//   },
//   {
//     id: "6",
//     name: "Anjali Patel",
//     role: "Rental Property Manager",
//     image: "/a5.jpg",
//     properties: 52,
//     rating: 4.8,
//     experience: "9 years",
//     specialization: "Rental Properties",
//     languages: ["English", "Hindi", "Gujarati"],
//     email: "anjali.patel@100gaj.com",
//     phone: "+91 98765 43215",
//     about: "Anjali has extensive experience in the rental market, helping landlords find qualified tenants and assisting renters in finding their perfect home. She also manages properties for overseas investors."
//   }
// ];

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[] | null>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    agencies: [] as string[],
    specializations: [] as string[],
    languages: [] as string[],
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 0,
  });

  useEffect(() => {
    // Fetch agents from API
    fetchAgents();
  }, []);

  const fetchAgents = async (page = 1, filterParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build URL with query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12", // Increased to show more agents per page
        ...filterParams,
      });

      const response = await fetch(`/api/agents?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate response data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }
      
      setAgents(data.agents || []);
      setFilteredAgents(data.agents || []);
      setFilters(data.filters || { agencies: [], specializations: [], languages: [] });
      setPagination(data.pagination || { total: 0, page: 1, limit: 12, pages: 0 });
      setError(null);
    } catch (_err) {

      let errorMessage = "Failed to load agents. ";
      
      if (_err instanceof Error) {
        if (_err.name === 'TimeoutError') {
          errorMessage += "Request timed out. Please check your connection and try again.";
        } else if (_err.message.includes('HTTP error')) {
          errorMessage += "Server error occurred. Please try again later.";
        } else {
          errorMessage += _err.message;
        }
      } else {
        errorMessage += "Unknown error occurred. Please try again.";
      }
      
      setError(errorMessage);
      setAgents([]);
      setFilteredAgents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If search term is provided and not empty, fetch from API with search term
    if (searchTerm.trim().length > 0) {
      fetchAgents(1, { search: searchTerm });
    } else if (activeFilter !== "all") {
      // If filtering by specialization
      fetchAgents(1, { specialization: activeFilter });
    } else {
      // Otherwise just reset to default view
      fetchAgents();
    }
  }, [searchTerm, activeFilter]);

  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 text-yellow-500"
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
            className="w-4 h-4 text-yellow-500"
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
            className="w-4 h-4 text-gray-300"
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

    return stars;
  };

  // Use available specializations from API or defaults
  const specializations =
    filters.specializations.length > 0
      ? ["all", ...filters.specializations]
      : [
          "all",
          "residential",
          "luxury",
          "commercial",
          "investment",
          "new construction",
          "rental",
        ];

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden mt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.avif"
            alt="Luxury real estate"
            fill
            priority
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/50 z-10"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-block bg-orange-500/80 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
              <span className="text-white font-medium tracking-wider text-sm">
                MEET OUR PROFESSIONALS
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Find Your <span className="text-orange-500">Perfect</span> Agent
            </h1>

            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Our elite team of real estate professionals combines local
              expertise with global connections to serve your property needs.
            </p>

            <div className="flex justify-center gap-4">
              <Link
                href="/search"
                className="px-8 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium"
              >
                Browse Properties
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-white/10 transition-colors font-medium"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-950 rounded-xl shadow-2xl overflow-hidden border border-gray-800 shadow-orange-500/60"
        >
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Find the Right Agent for You
            </h2>

            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(_e) => setSearchTerm(_e.target.value)}
                  placeholder="Search by agent name, role, or specialization..."
                  className="w-full px-5 py-4 pr-12 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {specializations.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setActiveFilter(spec)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === spec
                      ? "bg-orange-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {spec === "all"
                    ? "All Agents"
                    : spec.charAt(0).toUpperCase() + spec.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Agents Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-300">Loading our amazing agents...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-red-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
              <p className="text-gray-300 mb-4">{error}</p>
              <button
                onClick={() => fetchAgents()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Agents Content */}
        {!loading && !error && (
          <>
            <div className="mb-12 text-center">
              <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Our <span className="text-orange-500">Top Performing</span> Agents
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Each agent brings unique expertise and local market knowledge to
            help you achieve your real estate goals.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-orange-500">{error}</p>
          </div>
        ) : filteredAgents ? (
          filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAgents.map((agent, index) => (
                <motion.div
                  key={agent._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-100/10 rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:border-orange-500/30 transition-all group"
                >
                  {/* Agent Image */}
                  <div className="h-80 relative overflow-hidden hover:scale-105 transition-transform duration-500">
                    <img
                      src={agent.image || "/placeholder-agent.png"}
                      alt={agent.name}
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {renderStars(agent.agentInfo.rating)}
                        </div>
                        <span className="text-white text-sm font-medium">
                          {agent.agentInfo.rating.toFixed(1)}
                        </span>
                        <span className="text-gray-300 text-sm ml-2">
                          {agent.agentInfo.properties || "0"} properties
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Agent Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <Link href={`/agents/${agent._id}`}>
                        <h3 className="text-xl font-bold text-white hover:text-orange-500 transition-colors">
                          {agent.name}
                        </h3>
                      </Link>
                      <p className="text-orange-400 text-sm">
                        {agent.agentInfo.role || "Real Estate Agent"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mb-5">
                      <span className="inline-flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {agent.agentInfo.experience} years
                      </span>
                      <span className="inline-flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                          />
                        </svg>
                        {agent.agentInfo.languages?.join(", ") || "English"}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                      {agent.bio ||
                        `Experienced ${agent.agentInfo.role || "real estate agent"} specializing in ${agent.agentInfo.specializations?.join(", ") || "property sales and acquisition"}.`}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="flex gap-2">
                        <a
                          href={`tel:${agent.phone}`}
                          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-full transition-colors"
                          title="Call Agent"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                            />
                          </svg>
                        </a>
                        <a
                          href={`mailto:${agent.email}`}
                          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-full transition-colors"
                          title="Email Agent"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                            />
                          </svg>
                        </a>
                      </div>
                      <Link
                        href={`/agents/${agent._id}`}
                        className="px-5 py-2 bg-orange-500 text-white text-sm font-medium rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2"
                      >
                        View Profile
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-3 py-16 text-center"
            >
              <div className="max-w-md mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 mx-auto text-orange-500/40"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-6 text-xl font-medium text-orange-500">
                  No matching agents found
                </h3>
                <p className="mt-3 text-gray-500">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveFilter("all");
                  }}
                  className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </motion.div>
          )
        ) : (
          <div>No Element found</div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="flex space-x-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => fetchAgents(page)}
                    className={`px-4 py-2 rounded ${
                      pagination.page === page
                        ? "bg-orange-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
          </div>
        )}
          </>
        )}
      </section>

      {/* Stats Section */}
      <section className="bg-gray-950 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-4xl font-bold text-orange-500 mb-2">
                200+
              </div>
              <div className="text-gray-400">Happy Clients</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-4xl font-bold text-orange-500 mb-2">
                {agents.reduce(
                  (total, agent) => total + agent.agentInfo.experience,
                  0,
                )}
                +
              </div>
              <div className="text-gray-400">Years Combined Experience</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-2"
            >
              <div className="text-4xl font-bold text-orange-500 mb-2 break-words">
                ₹500 Cr+
              </div>
              <div className="text-gray-400">Property Transactions</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-4xl font-bold text-orange-500 mb-2">98%</div>
              <div className="text-gray-400">Client Satisfaction</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl overflow-hidden relative"
        >
          <div className="relative p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Work With Our Expert Agents?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
              Whether you&apos;re buying, selling, or investing, our agents will
              guide you through every step of the process.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3 bg-white text-orange-600 rounded-md hover:bg-gray-100 transition-colors font-medium"
              >
                Contact an Agent
              </Link>
              <Link
                href="/verification"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-white/10 transition-colors font-medium"
              >
                Join Our Team
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
