"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import CirclePattern from "../components/CirclePattern";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaWater,
  FaBolt,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaExclamationTriangle,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface AreaData {
  location: string;
  zone: string;
  pros: string[];
  cons: string[];
  crime_level: string;
  crime_rating: number;
  safety_rating: number;
  total_crimes: number;
  electricity_issues: string;
  water_clogging: string;
}

interface DelhiAreasData {
  areas: string;
}

// const initialData: AreaData = {
//   location: "",
//   zone: "",
//   pros: [],
//   cons: [],
//   crime_level: "",
//   crime_rating: 0,
//   safety_rating: 0,
//   total_crimes: 0,
//   electricity_issues: "",
//   water_clogging: "",
// };

export default function DelhiAreaAnalyzer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [areaData, setAreaData] = useState<AreaData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allAreas, setAllAreas] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [popularAreas] = useState([
    "Dwarka",
    "Rohini",
    "Vasant Kunj",
    "South Extension",
    "Pitampura",
    "Lajpat Nagar",
    "Mayur Vihar",
    "Janakpuri",
    "Saket",
    "Karol Bagh",
  ]);

  const fetchAreaData = async (locationName: string) => {
    if (!locationName.trim()) {
      toast.error("Please enter a location name");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAreaData(null);

    try {
      const response = await fetch(
        `https://ml-models-vu7b.onrender.com/api/location/${encodeURIComponent(locationName)}`,
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setAreaData(data);
      setShowResults(true);
      window.scrollTo({
        top: document.getElementById("results")?.offsetTop || 0,
        behavior: "smooth",
      });
    } catch (err: any) {

      setError(err.message || "Failed to fetch area data. Please try again.");
      toast.error(
        "Could not find data for this area. Please try another location.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch the list of Delhi areas from the JSON file
    fetch("/delhi_areas.json")
      .then((response) => response.json())
      .then((data: DelhiAreasData) => {
        const areasList = data.areas.split(",");
        setAllAreas(areasList);
      })
      .catch((_err) => {

      });

    // Add click event listener to handle clicks outside of suggestions
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filteredSuggestions = allAreas
      .filter((area) => area.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5);

    setSuggestions(filteredSuggestions);
    setShowSuggestions(filteredSuggestions.length > 0);
  }, [searchTerm, allAreas]);

  const handleSearch = (_e: React.FormEvent) => {
    _e.preventDefault();
    fetchAreaData(searchTerm);
    setShowSuggestions(false);
  };

  const handlePopularAreaClick = (area: string) => {
    setSearchTerm(area);
    fetchAreaData(area);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    fetchAreaData(suggestion);
    setShowSuggestions(false);
  };

  const getSafetyColor = (rating: number) => {
    if (rating >= 8) return "text-green-500";
    if (rating >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  const getCrimeColor = (rating: number) => {
    if (rating <= 2) return "text-green-500";
    if (rating <= 5) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressBarColor = (rating: number, isPositive = true) => {
    if (isPositive) {
      if (rating >= 8) return "bg-green-500";
      if (rating >= 6) return "bg-yellow-500";
      return "bg-red-500";
    } else {
      if (rating <= 2) return "bg-green-500";
      if (rating <= 5) return "bg-yellow-500";
      return "bg-red-500";
    }
  };

  return (
    <main className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 bg-gradient-to-b from-black to-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/dwarka.jpeg"
            alt="Delhi Map Background"
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pt-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                Delhi Area <span className="text-orange-500">Analyzer</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto">
                Make informed decisions about where to live or invest in Delhi.
                Get detailed safety analysis, pros & cons, and neighborhood
                insights.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-white/20"
            >
              <form
                onSubmit={handleSearch}
                className="flex flex-col md:flex-row gap-4"
                data-theme="dark"
              >
                <div className="flex-1 relative" ref={searchRef}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-orange-500" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(_e) => setSearchTerm(_e.target.value)}
                    onFocus={() => setShowSuggestions(suggestions.length > 0)}
                    placeholder="Enter a Delhi area (e.g. Dwarka, Rohini, Vasant Kunj)"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-white/50"
                  />

                  {/* Suggestions dropdown */}
                  {showSuggestions && (
                    <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                      {suggestions.length > 0 ? (
                        suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-700 text-white flex items-center"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <FaSearch className="text-orange-500 mr-2 text-sm" />
                            {suggestion}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-400">
                          No matching areas found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    "Analyze Area"
                  )}
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8"
            >
              <p className="text-white mb-3">Popular areas to explore:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularAreas.map((area) => (
                  <button
                    key={area}
                    onClick={() => handlePopularAreaClick(area)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 text-sm transition-colors"
                  >
                    {area}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {showResults && (
        <section
          id="results"
          className="py-16 bg-gray-900 relative overflow-hidden"
        >
          <div className="absolute inset-0 text-white/5 opacity-30">
            <CirclePattern />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {error ? (
              <div className="max-w-3xl mx-auto text-center p-8 bg-red-900/30 rounded-xl border border-red-800">
                <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-400 mb-2">
                  Area Not Found
                </h2>
                <p className="text-red-300 mb-4">{error}</p>
                <p className="text-gray-300">
                  Please try another location or check the spelling.
                </p>
              </div>
            ) : areaData ? (
              <div className="max-w-6xl mx-auto">
                {/* Location Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <div className="inline-block bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full mb-4">
                    <span className="font-medium">{areaData.zone}</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    {areaData.location}
                  </h2>
                  <p className="text-xl text-white/70 max-w-3xl mx-auto">
                    Comprehensive analysis and insights about living in{" "}
                    {areaData.location}
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                  {/* Safety Score Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">
                        Safety Score
                      </h3>
                      <div
                        className={`text-2xl font-bold ${getSafetyColor(areaData.safety_rating)}`}
                      >
                        {areaData.safety_rating.toFixed(1)}/10
                      </div>
                    </div>

                    <div className="h-3 w-full bg-gray-200 rounded-full mb-4">
                      <div
                        className={`h-3 rounded-full ${getProgressBarColor(areaData.safety_rating)}`}
                        style={{ width: `${areaData.safety_rating * 10}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center text-white/70 mb-1">
                      <span className="w-24">Poor</span>
                      <span className="flex-1 text-center">Average</span>
                      <span className="w-24 text-right">Excellent</span>
                    </div>

                    <div className="mt-6 p-4 bg-orange-900/20 rounded-lg">
                      <p className="text-white font-medium">
                        {areaData.location} is considered a{" "}
                        <span
                          className={getSafetyColor(areaData.safety_rating)}
                        >
                          {areaData.safety_rating >= 8
                            ? "very safe"
                            : areaData.safety_rating >= 6
                              ? "moderately safe"
                              : "less safe"}
                        </span>{" "}
                        area to live in Delhi.
                      </p>
                    </div>
                  </motion.div>

                  {/* Crime Stats Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">
                        Crime Rating
                      </h3>
                      <div
                        className={`text-2xl font-bold ${getCrimeColor(areaData.crime_rating)}`}
                      >
                        {areaData.crime_rating.toFixed(1)}/10
                      </div>
                    </div>

                    <div className="h-3 w-full bg-gray-200 rounded-full mb-4">
                      <div
                        className={`h-3 rounded-full ${getProgressBarColor(areaData.crime_rating, false)}`}
                        style={{ width: `${areaData.crime_rating * 10}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center text-white/70 mb-1">
                      <span className="w-24">Low</span>
                      <span className="flex-1 text-center">Moderate</span>
                      <span className="w-24 text-right">High</span>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <span className="text-white">Crime Level:</span>
                        <span
                          className={`font-medium ${getCrimeColor(areaData.crime_rating)}`}
                        >
                          {areaData.crime_level}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-black">Annual Crime Cases:</span>
                        <span className="font-medium text-black">
                          {areaData.total_crimes}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Utilities & Infrastructure */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Infrastructure
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center">
                          <FaBolt className="text-orange-500 mr-3" />
                          <span className="text-white">Electricity Issues</span>
                        </div>
                        <div className="flex items-center">
                          {areaData.electricity_issues === "No" ? (
                            <FaCheckCircle className="text-green-500 mr-2" />
                          ) : (
                            <FaTimesCircle className="text-red-500 mr-2" />
                          )}
                          <span
                            className={
                              areaData.electricity_issues === "No"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {areaData.electricity_issues}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center">
                          <FaWater className="text-orange-500 mr-3" />
                          <span className="text-white">Water Clogging</span>
                        </div>
                        <div className="flex items-center">
                          {areaData.water_clogging === "No" ? (
                            <FaCheckCircle className="text-green-500 mr-2" />
                          ) : areaData.water_clogging === "Occasional" ? (
                            <span className="inline-block w-4 h-4 bg-yellow-400 rounded-full mr-2"></span>
                          ) : (
                            <FaTimesCircle className="text-red-500 mr-2" />
                          )}
                          <span
                            className={
                              areaData.water_clogging === "No"
                                ? "text-green-600"
                                : areaData.water_clogging === "Occasional"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }
                          >
                            {areaData.water_clogging}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-orange-900/20 rounded-lg">
                      <p className="text-white">
                        {areaData.location} has{" "}
                        {areaData.electricity_issues === "No"
                          ? "reliable"
                          : "some issues with"}{" "}
                        electricity supply and{" "}
                        {areaData.water_clogging === "No"
                          ? "no"
                          : areaData.water_clogging.toLowerCase()}{" "}
                        problems with water clogging.
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {/* Pros Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-green-900/30 to-green-800/20 p-6 rounded-xl shadow-lg border border-green-800"
                  >
                    <h3 className="text-xl font-semibold text-green-400 mb-6 flex items-center">
                      <FaCheckCircle className="text-green-500 mr-3" />
                      Advantages of Living in {areaData.location}
                    </h3>

                    <ul className="space-y-3">
                      {areaData.pros.map((pro, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-6 h-6 bg-green-500 rounded-full flex-shrink-0 flex items-center justify-center text-white mt-0.5 mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                          <span className="text-green-300">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Cons Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-red-900/30 to-red-800/20 p-6 rounded-xl shadow-lg border border-red-800"
                  >
                    <h3 className="text-xl font-semibold text-red-400 mb-6 flex items-center">
                      <FaTimesCircle className="text-red-500 mr-3" />
                      Disadvantages of Living in {areaData.location}
                    </h3>

                    <ul className="space-y-3">
                      {areaData.cons.map((con, index) => (
                        <li key={index} className="flex items-start">
                          <span className=" w-6 h-6 bg-red-500 rounded-full flex-shrink-0 flex items-center justify-center text-white mt-0.5 mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                          <span className="text-red-300">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Recommendation Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 p-8 rounded-xl shadow-lg border border-orange-800 mb-12"
                >
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Summary & Recommendation
                  </h3>

                  <p className="text-lg text-white/80 mb-6">
                    {areaData.location} is located in {areaData.zone} and offers
                    {areaData.pros.length > areaData.cons.length
                      ? " numerous advantages including "
                      : " some benefits such as "}
                    {areaData.pros.slice(0, 3).join(", ")}
                    {areaData.pros.length > 3 ? " and more" : ""}.
                    {areaData.cons.length > 0
                      ? ` However, residents should be aware of potential drawbacks like ${areaData.cons.join(", ")}.`
                      : " The area has minimal drawbacks based on our analysis."}
                  </p>

                  <div className="p-4 bg-gray-800/80 rounded-lg">
                    <p className="font-medium text-white">
                      <span className="font-bold">Verdict: </span>
                      {areaData.safety_rating >= 8
                        ? `${areaData.location} is an excellent choice for families and individuals seeking a safe, well-established neighborhood.`
                        : areaData.safety_rating >= 6
                          ? `${areaData.location} is a good option with a reasonable balance of advantages and some limitations.`
                          : `${areaData.location} has potential but prospective residents should weigh the cons carefully before making a decision.`}
                    </p>
                  </div>
                </motion.div>

                {/* Similar Areas to Explore */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <h3 className="text-2xl font-semibold text-white mb-6">
                    Explore Similar Areas
                  </h3>

                  <div className="flex flex-wrap justify-center gap-3">
                    {popularAreas
                      .filter(
                        (area) =>
                          area.toLowerCase() !==
                          areaData.location.toLowerCase(),
                      )
                      .slice(0, 5)
                      .map((area) => (
                        <button
                          key={area}
                          onClick={() => handlePopularAreaClick(area)}
                          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-orange-500 transition-colors border border-orange-500/30"
                        >
                          {area}
                        </button>
                      ))}
                  </div>
                </motion.div>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                <p className="text-xl text-white">Analyzing area data...</p>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              How Our Area Analysis Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-white/70 max-w-3xl mx-auto"
            >
              We provide comprehensive insights about Delhi localities using
              data from multiple sources
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Safety Analysis",
                description:
                  "We analyze crime statistics, police reports, and resident feedback to generate a safety score for each area.",
                icon: <FaShieldAlt className="text-orange-500 text-4xl mb-4" />,
              },
              {
                title: "Infrastructure Assessment",
                description:
                  "Evaluation of essential services like electricity, water supply, roads, and public transportation.",
                icon: <FaBolt className="text-orange-500 text-4xl mb-4" />,
              },
              {
                title: "Community Insights",
                description:
                  "Detailed pros and cons based on resident experiences, local surveys, and expert opinions.",
                icon: (
                  <FaMapMarkerAlt className="text-orange-500 text-4xl mb-4" />
                ),
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 text-center"
              >
                <div className="flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-white/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/image3.webp"
            alt="Delhi Map"
            fill
            className="object-cover"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              Ready to Find Your Perfect Delhi Neighborhood?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-white/90 mb-8"
            >
              Use our Delhi Area Analyzer to make informed decisions about where
              to live, invest, or start a business in Delhi NCR.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link
                  href="/search"
                  className="px-6 py-3 bg-black/40 text-white font-semibold rounded-md hover:bg-black/60 transition-colors"
                >
                  Search for Homes
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="bg-black">
        <Footer />
      </div>
    </main>
  );
}
