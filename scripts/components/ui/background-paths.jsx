"use client";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Building, Home, Key, Store, ArrowRight, Navigation, Loader2, } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
function FloatingPaths({ position }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
    }));
    return (<div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-white" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (<motion.path key={path.id} d={path.d} stroke="currentColor" strokeWidth={path.width} strokeOpacity={0.1 + path.id * 0.02} initial={{ pathLength: 0.3, opacity: 0.6 }} animate={{
                pathLength: 1,
                opacity: [0.3, 0.6, 0.3],
                pathOffset: [0, 1, 0],
            }} transition={{
                duration: 20 + Math.random() * 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
            }}/>))}
      </svg>
    </div>);
}
// Property Search Bar Component
function PropertySearchBar() {
    const [activeTab, setActiveTab] = useState("buy");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLocationLoading, setIsLocationLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const searchInputRef = useRef(null);
    const suggestionsRef = useRef(null);
    const router = useRouter();
    // Load location data
    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const response = await fetch("/location_mapping.json");
                const data = await response.json();
                setLocationData(data);
            }
            catch (_a) {
                // Silently fail - location data will be empty
            }
        };
        fetchLocationData();
    }, []);
    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target) &&
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const listingTypeTabs = [
        { id: "buy", name: "Buy Properties", icon: <Home className="w-5 h-5"/> },
        { id: "rent", name: "Rent Properties", icon: <Key className="w-5 h-5"/> },
    ];
    const propertyTypeTabs = [
        { id: "flat", name: "Flat", icon: <Building className="w-5 h-5"/> },
        {
            id: "apartment",
            name: "Apartment",
            icon: <Building className="w-5 h-5"/>,
        },
        { id: "villa", name: "Villa", icon: <Home className="w-5 h-5"/> },
        {
            id: "commercial",
            name: "Commercial",
            icon: <Store className="w-5 h-5"/>,
        },
    ];
    const handleSearch = () => {
        const params = new URLSearchParams();
        // Add the search query if it exists
        if (searchQuery.trim()) {
            params.append("location", searchQuery);
        }
        // For the main listing type (buy/rent)
        if (activeTab === "buy") {
            params.append("filter", "sale");
        }
        else if (activeTab === "rent") {
            params.append("filter", "rent");
        }
        // For specific property types
        if ([
            "house",
            "flat",
            "apartment",
            "villa",
            "townhouse",
            "pg",
            "plot",
            "commercial",
        ].includes(activeTab)) {
            // Map the tab ID to the correct property type name expected by the API
            const propertyTypeMap = {
                house: "House",
                flat: "Flat",
                apartment: "Apartment",
                villa: "Villa",
                townhouse: "Townhouse",
                pg: "PG/Hostel",
                plot: "Plot",
                commercial: "Commercial",
            };
            // Add the property type filter
            params.append("propertyType", propertyTypeMap[activeTab]);
            // Add default listing type (sale) for property types if not already set
            if (!params.has("filter")) {
                // PG is typically for rent, others default to sale
                params.append("filter", activeTab === "pg" ? "rent" : "sale");
            }
        }
        // Navigate to search page with filters
        router.push(`/search?${params.toString()}`);
    };
    // Handle "Near Me" button click - get user's geolocation
    const handleNearMe = () => {
        setIsLocationLoading(true);
        // Ensure we're on the client side
        if (typeof window === 'undefined' || !navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser. Please search manually.");
            setIsLocationLoading(false);
            return;
        }
        // Show loading feedback immediately
        toast.loading("Getting your location...", { id: "location-toast" });
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            // Create params including current active tab filters
            const params = new URLSearchParams();
            params.append("lat", latitude.toString());
            params.append("lng", longitude.toString());
            params.append("nearMe", "true");
            // Add filter based on active tab
            switch (activeTab) {
                case "buy":
                    params.append("filter", "sale");
                    break;
                case "rent":
                    params.append("filter", "rent");
                    break;
                case "new":
                    params.append("filter", "sale");
                    params.append("isNew", "true");
                    break;
                case "pg":
                    params.append("filter", "rent");
                    params.append("propertyType", "PG/Hostel");
                    break;
                case "plot":
                    params.append("filter", "sale");
                    params.append("propertyType", "Plot");
                    break;
                case "commercial":
                    params.append("filter", "sale");
                    params.append("propertyType", "Commercial");
                    break;
                default:
                    break;
            }
            // Navigate to search page with location and filters
            router.push(`/search?${params.toString()}`);
            setIsLocationLoading(false);
            toast.success("Location found! Searching nearby properties...", { id: "location-toast" });
        }, (_error) => {
            setIsLocationLoading(false);
            let errorMessage = "Unable to get your location. ";
            switch (_error.code) {
                case _error.PERMISSION_DENIED:
                    errorMessage += "Please allow location access in your browser settings and try again.";
                    break;
                case _error.POSITION_UNAVAILABLE:
                    errorMessage += "Location information is unavailable. Please try again or search manually.";
                    break;
                case _error.TIMEOUT:
                    errorMessage += "Location request timed out. Please try again or search manually.";
                    break;
                default:
                    errorMessage += "Please try again or search manually.";
                    break;
            }
            toast.error(errorMessage, { id: "location-toast", duration: 5000 });
        }, {
            timeout: 15000, // Increased timeout to 15 seconds
            enableHighAccuracy: true,
            maximumAge: 60000 // Cache location for 1 minute
        });
    };
    // Handle Enter key press in search input
    const handleKeyDown = (_e) => {
        if (_e.key === "Enter") {
            handleSearch();
            setShowSuggestions(false);
        }
        else if (_e.key === "ArrowDown" && suggestions.length > 0) {
            // Focus the first suggestion
            const suggestionElement = document.getElementById("suggestion-0");
            if (suggestionElement)
                suggestionElement.focus();
            _e.preventDefault();
        }
        else if (_e.key === "Escape") {
            setShowSuggestions(false);
        }
    };
    // Handle input change for search query
    const handleInputChange = (_e) => {
        const value = _e.target.value;
        setSearchQuery(value);
        // Filter suggestions based on input
        if (value.trim().length > 0) {
            const filtered = locationData
                .filter((location) => location.toLowerCase().includes(value.toLowerCase()))
                .slice(0, 10); // Limit to 10 suggestions
            setSuggestions(filtered);
            setShowSuggestions(true);
        }
        else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };
    // Handle suggestion selection
    const handleSelectSuggestion = (suggestion) => {
        setSearchQuery(suggestion);
        setShowSuggestions(false);
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };
    // Handle keyboard navigation within suggestions
    const handleSuggestionKeyDown = (_e, index, suggestion) => {
        if (_e.key === "Enter") {
            handleSelectSuggestion(suggestion);
            _e.preventDefault();
        }
        else if (_e.key === "ArrowDown") {
            // Move to next suggestion
            const nextIndex = (index + 1) % suggestions.length;
            const nextElement = document.getElementById(`suggestion-${nextIndex}`);
            if (nextElement)
                nextElement.focus();
            _e.preventDefault();
        }
        else if (_e.key === "ArrowUp") {
            // Move to previous suggestion or back to input
            if (index === 0) {
                if (searchInputRef.current)
                    searchInputRef.current.focus();
            }
            else {
                const prevElement = document.getElementById(`suggestion-${index - 1}`);
                if (prevElement)
                    prevElement.focus();
            }
            _e.preventDefault();
        }
        else if (_e.key === "Escape") {
            setShowSuggestions(false);
            if (searchInputRef.current)
                searchInputRef.current.focus();
        }
    };
    const allTabs = [...listingTypeTabs, ...propertyTypeTabs];
    return (<motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{
            delay: 0.8,
            duration: 0.6,
            type: "spring",
            stiffness: 100,
        }} className="max-w-4xl mx-4 sm:mx-auto mt-6 md:mt-10 bg-black/40 backdrop-blur-lg rounded-xl overflow-hidden border border-orange-500/30 shadow-xl shadow-orange-900/40">
      <style jsx global>{`
        .search-path-override {
          --tw-bg-opacity: 0.1;
          --tw-border-opacity: 0.2;
          --tw-text-opacity: 1;
          width: 100%;
        }

        .search-path-override input {
          width: 100%;
          padding-left: 2.5rem;
          padding-right: 7rem;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
          border-width: 1px;
          border-color: rgba(255, 255, 255, var(--tw-border-opacity));
          border-radius: 0.75rem;
          color: rgba(255, 255, 255, var(--tw-text-opacity));
          font-size: 0.875rem;
          line-height: 1.25rem;
          transition-property: all;
          transition-duration: 300ms;
          height: auto;
        }

        .search-path-override input:focus {
          outline: none;
          --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
            var(--tw-ring-offset-width) var(--tw-ring-offset-color);
          --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
            calc(2px + var(--tw-ring-offset-width)) rgba(249, 115, 22, 0.5);
          box-shadow:
            var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
            var(--tw-shadow, 0 0 #0000);
          border-color: rgba(249, 115, 22, 0.3);
        }

        .search-path-override input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .search-path-override svg {
          color: rgba(255, 255, 255, 0.5);
        }

        .search-path-override div[class*="z-10"] {
          background-color: rgba(0, 0, 0, 0.9);
          border-color: rgba(249, 115, 22, 0.2);
          max-height: 12rem;
          z-index: 20;
        }

        .search-path-override div[class*="z-10"] div {
          color: rgba(255, 255, 255, 0.9);
        }

        .search-path-override div[class*="z-10"] div:hover {
          background-color: rgba(249, 115, 22, 0.2);
        }

        .search-path-override div[class*="z-10"] div span {
          background-color: rgba(249, 115, 22, 0.3);
          color: white;
        }

        @media (max-width: 640px) {
          .search-path-override input {
            padding-right: 5.5rem;
          }
        }
      `}</style>
      <div className="bg-black/40 backdrop-blur-lg rounded-xl overflow-hidden border border-orange-500/20 shadow-xl shadow-orange-900/10">
        {/* Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 border-b border-white/10 overflow-x-auto scrollbar-hide">
          {allTabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative flex flex-col items-center justify-center py-2 px-2 transition-all duration-300
                      ${activeTab === tab.id
                ? "text-orange-400"
                : "text-white/70 hover:text-white"}`}>
              <div className="mb-1">{tab.icon}</div>
              <div className="text-xs font-medium">
                {tab.name.split(" ")[0]}
              </div>
              <div className="text-xs opacity-70 hidden sm:block">
                {tab.name.split(" ").slice(1).join(" ")}
              </div>

              {activeTab === tab.id && (<motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}/>)}
            </button>))}
        </div>

        {/* Search Input & Filters */}
        <div className={`p-5 ${showSuggestions && suggestions.length > 0 ? "h-[30vh]" : ""}`}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Main Search Input */}
            <div className="relative flex-1 search-path-override">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                <MapPin className="w-4 h-4"/>
              </div>

              <input ref={searchInputRef} type="text" placeholder="Search by location or area..." value={searchQuery} onChange={handleInputChange} onKeyDown={handleKeyDown} onFocus={() => {
            if (searchQuery.trim().length > 0 && suggestions.length > 0) {
                setShowSuggestions(true);
            }
        }} className="w-full rounded-xl bg-white/10 border border-white/20 text-white py-3 pl-10 pr-28 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/30"/>

              {/* Location Suggestions */}
              {showSuggestions && suggestions.length > 0 && (<div ref={suggestionsRef} className="absolute left-0 right-0 mt-1 bg-black/90 border border-orange-500/20 rounded-xl overflow-hidden overflow-y-auto z-10 max-h-48 shadow-lg shadow-black/50">
                  {suggestions.map((suggestion, index) => (<div key={suggestion} id={`suggestion-${index}`} tabIndex={0} onClick={() => handleSelectSuggestion(suggestion)} onKeyDown={(_e) => handleSuggestionKeyDown(_e, index, suggestion)} className="px-4 py-2 cursor-pointer hover:bg-orange-500/20 focus:bg-orange-500/20 focus:outline-none transition-colors duration-200">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-orange-400"/>
                        <div className="text-sm">
                          {searchQuery.trim() &&
                    suggestion
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ? (<>
                              {suggestion.substring(0, suggestion
                        .toLowerCase()
                        .indexOf(searchQuery.toLowerCase()))}
                              <span className="bg-orange-500/30 px-1 rounded">
                                {suggestion.substring(suggestion
                        .toLowerCase()
                        .indexOf(searchQuery.toLowerCase()), suggestion
                        .toLowerCase()
                        .indexOf(searchQuery.toLowerCase()) +
                        searchQuery.length)}
                              </span>
                              {suggestion.substring(suggestion
                        .toLowerCase()
                        .indexOf(searchQuery.toLowerCase()) +
                        searchQuery.length)}
                            </>) : (suggestion)}
                        </div>
                      </div>
                    </div>))}
                </div>)}

              {/* Near Me Button (inside the input) */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <button onClick={handleNearMe} className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full hover:bg-orange-500/30 transition-colors duration-200 flex items-center gap-1" disabled={isLocationLoading}>
                  {isLocationLoading ? (<Loader2 className="w-3 h-3 animate-spin"/>) : (<Navigation className="w-3 h-3"/>)}
                  <span>Near Me</span>
                </button>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex gap-2">
              <button className="h-full px-3 py-3 sm:py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium flex items-center gap-1 sm:gap-2 rounded-xl hover:brightness-110 transition-all duration-300 shadow-lg shadow-orange-900/20 text-sm" onClick={handleSearch}>
                <Search className="w-4 h-4"/>
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Map Search Option */}
          <div className="mt-3 sm:mt-4 inline-flex items-center gap-2">
            <Link href="/search?view=map" className="flex items-center gap-1 sm:gap-1.5 py-1 sm:py-1.5 px-2 sm:px-3 rounded-full bg-black/40 text-white/70 hover:text-white text-xs sm:text-sm border border-white/10 cursor-pointer hover:border-orange-500/20 transition-all duration-300 group">
              <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400"/>
              <span>Search by</span>
              <span className="text-orange-400 font-medium">Map</span>
              <span>View</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400 group-hover:translate-x-0.5 transition-transform duration-300"/>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>);
}
// Animated gradient component for highlighted text
function AnimatedGradientText({ text, delay = 0, }) {
    return (<span className="inline-block relative">
      {text.split("").map((letter, letterIndex) => (<motion.span key={`animated-${letterIndex}`} initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{
                delay: delay + letterIndex * 0.03,
                type: "spring",
                stiffness: 150,
                damping: 25,
            }} className="inline-block relative">
          <motion.span className="inline-block text-transparent bg-clip-text absolute inset-0" style={{
                backgroundImage: "linear-gradient(to right,rgb(246, 157, 94),rgb(238, 121, 58),rgb(241, 104, 50),rgb(243, 99, 22),rgb(244, 109, 12), #ea580c, rgb(216, 94, 45), #ea580c, rgb(243, 146, 77))",
                backgroundSize: "200% 100%",
            }} animate={{
                backgroundPosition: ["0% center", "100% center", "0% center"],
            }} transition={{
                duration: 3,
                ease: "linear",
                repeat: Infinity,
                repeatType: "mirror",
            }}>
            {letter}
          </motion.span>
          <span className="inline-block text-transparent invisible">
            {letter}
          </span>
        </motion.span>))}
    </span>);
}
export function BackgroundPaths() {
    // Split the title into individual words for proper animation
    const firstPartWords = ["Find", "your"];
    const highlightWord = "Perfect";
    const secondPartWords = ["Home", "with"];
    const brandNameWords = ["100", "Gaj"];
    // Calculate delays for animations
    const firstPartDelay = 0;
    const highlightDelay = (firstPartWords.join("").length + firstPartWords.length) * 0.03;
    const secondPartDelay = highlightDelay + highlightWord.length * 0.03;
    const brandNameDelay = secondPartDelay +
        (secondPartWords.join("").length + secondPartWords.length) * 0.03;
    return (<div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background animation paths - behind everything */}
      <div className="absolute inset-0 z-0">
        <FloatingPaths position={1}/>
        <FloatingPaths position={-1}/>
      </div>

      {/* Main content - in front of background */}
      <div className="relative z-20 container mx-auto px-4 md:px-6 text-center py-20 min-h-screen flex flex-col justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="max-w-6xl mx-auto">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 flex flex-col">
            <span className="mb-4">
              {/* First part - "Find your" - handling each word */}
              {firstPartWords.map((word, wordIndex) => (<span key={`word-${wordIndex}`} className="inline-block mr-4">
                  {word.split("").map((letter, letterIndex) => (<motion.span key={`first-${wordIndex}-${letterIndex}`} initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{
                    delay: firstPartDelay +
                        (wordIndex * word.length + letterIndex) * 0.03,
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                }} className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
                      {letter}
                    </motion.span>))}
                </span>))}

              {/* Perfect - with animated gradient */}
              <AnimatedGradientText text={highlightWord} delay={highlightDelay}/>
            </span>

            <span className="mb-4">
              {/* Second part - "Home with" - handling each word */}
              {secondPartWords.map((word, wordIndex) => (<span key={`second-word-${wordIndex}`} className="inline-block mr-4">
                  {word.split("").map((letter, letterIndex) => (<motion.span key={`second-${wordIndex}-${letterIndex}`} initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{
                    delay: secondPartDelay +
                        (wordIndex > 0 ? secondPartWords[0].length + 1 : 0) *
                            0.03 +
                        letterIndex * 0.03,
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                }} className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
                      {letter}
                    </motion.span>))}
                </span>))}
            </span>

            <span>
              {/* Brand name - "100 Gaj" with animated gradient */}
              {brandNameWords.map((word, wordIndex) => (<span key={`brand-word-${wordIndex}`} className="inline-block mr-4 pb-4">
                  <AnimatedGradientText text={word} delay={brandNameDelay +
                (wordIndex > 0 ? brandNameWords[0].length + 1 : 0) * 0.03}/>
                </span>))}
            </span>
          </h1>

          {/* Property Search Bar */}
          <PropertySearchBar />
        </motion.div>
      </div>
    </div>);
}
