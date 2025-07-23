"use client";
import { useEffect, useState } from "react";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart, FaRegHeart, FaCar, FaCalendarAlt, FaTimes, FaChevronLeft, FaChevronRight, } from "react-icons/fa";
import { IoLocationOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { BsBuilding, BsGraphUp } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Footer from "@/app/components/footer";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/app/components/navbar";
import { LocalityAnalysis } from "@/components/ui/locality-analysis";
import { PropertyNewsWhiteSection } from "@/components/ui/property-news-white";
import { FavoritesAPI } from "@/app/lib/api-helpers";
export default function PropertyPage({ params }) {
    var _a, _b, _c;
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [similarProperties, setSimilarProperties] = useState([]);
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: "I'm interested in this property...",
    });
    const [contactFormSubmitting, setContactFormSubmitting] = useState(false);
    const [contactFormSuccess, setContactFormSuccess] = useState(false);
    const [contactFormError, setContactFormError] = useState(null);
    const [propertyId, setPropertyId] = useState('');
    const [showContactDetails, setShowContactDetails] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [showImageOverlay, setShowImageOverlay] = useState(false);
    // EMI Calculator state
    const [emiData, setEmiData] = useState({
        loanAmount: 5000000,
        interestRate: 8.5,
        tenure: 20
    });
    // Favorites state
    const [token, setToken] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [isFavorited, setIsFavorited] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    // Check authentication status from sessionStorage
    const checkAuthStatus = () => {
        if (typeof window !== 'undefined') {
            const authToken = sessionStorage.getItem("authToken");
            setIsAuthenticated(!!authToken);
            return !!authToken;
        }
        return false;
    };
    // EMI Calculation function
    const calculateEMI = () => {
        const principal = emiData.loanAmount;
        const monthlyRate = emiData.interestRate / 12 / 100;
        const months = emiData.tenure * 12;
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
        const totalAmount = emi * months;
        const totalInterest = totalAmount - principal;
        return {
            emi: Math.round(emi),
            totalInterest: Math.round(totalInterest),
            totalAmount: Math.round(totalAmount)
        };
    };
    const emiCalculation = calculateEMI();
    // Handle image overlay
    const openImageOverlay = (index) => {
        setSelectedImageIndex(index);
        setShowImageOverlay(true);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };
    const closeImageOverlay = () => {
        setShowImageOverlay(false);
        setSelectedImageIndex(null);
        document.body.style.overflow = 'unset'; // Restore scrolling
    };
    const navigateImage = (direction) => {
        if (!property || selectedImageIndex === null)
            return;
        const totalImages = property.images.length;
        if (direction === 'prev') {
            setSelectedImageIndex(selectedImageIndex === 0 ? totalImages - 1 : selectedImageIndex - 1);
        }
        else {
            setSelectedImageIndex(selectedImageIndex === totalImages - 1 ? 0 : selectedImageIndex + 1);
        }
    };
    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!showImageOverlay)
                return;
            if (e.key === 'Escape') {
                closeImageOverlay();
            }
            else if (e.key === 'ArrowLeft') {
                navigateImage('prev');
            }
            else if (e.key === 'ArrowRight') {
                navigateImage('next');
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [showImageOverlay, selectedImageIndex]);
    // Cleanup overflow on unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);
    // Handle show contact button click
    const handleShowContact = () => {
        if (!isAuthenticated) {
            // Redirect to home page and show login message
            toast.error("Please login to view contact details");
        }
        else {
            setShowContactDetails(true);
        }
    };
    // Handle contact owner actions
    const handleContactOwner = (type) => {
        if (!isAuthenticated) {
            toast.error("Please login to contact the owner");
            return;
        }
        if (!property)
            return;
        const { phone } = property.ownerDetails;
        const email = property.owner.email;
        if (type === 'phone') {
            if (phone) {
                window.location.href = `tel:${phone}`;
                toast.success("Opening phone dialer...");
            }
            else {
                toast.error("Phone number not available");
            }
        }
        else if (type === 'email') {
            if (email) {
                const emailSubject = `Inquiry about ${property.title}`;
                window.location.href = `mailto:${email}?subject=${encodeURIComponent(emailSubject)}`;
                toast.success("Opening email client...");
            }
            else {
                toast.error("Email address not available");
            }
        }
    };
    // Resolve params
    useEffect(() => {
        async function resolveParams() {
            const resolvedParams = await params;
            setPropertyId(resolvedParams.id);
        }
        resolveParams();
    }, [params]);
    // Get token from sessionStorage
    useEffect(() => {
        // Only run this on the client side
        if (typeof window !== "undefined") {
            const authToken = sessionStorage.getItem("authToken");
            if (authToken) {
                setToken(authToken);
            }
        }
    }, []);
    // Fetch favorites when token is available
    const fetchFavorites = async () => {
        if (token) {
            try {
                const propertiesData = await FavoritesAPI.getProperties();
                setFavorites(propertiesData.favorites);
                // Check if current property is in favorites
                if (property &&
                    propertiesData.favorites.some((fav) => fav._id === property._id)) {
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
            fetchFavorites();
        }
    }, [token]);
    // Update isFavorited when property or favorites change
    useEffect(() => {
        if (property && favorites.length > 0) {
            setIsFavorited(favorites.some((fav) => fav._id === property._id));
        }
    }, [property, favorites]);
    // Toggle favorite functionality
    const toggleFavorite = async (propertyId) => {
        if (!token) {
            toast.error("Please login to add favorites");
            return;
        }
        try {
            // Optimistically update UI first for responsive feedback
            setIsFavorited((prev) => !prev);
            if (isFavorited) {
                // Remove from favorites
                await FavoritesAPI.removeProperty(propertyId);
                toast.success("Property removed from favorites");
                // Update local state
                setFavorites(favorites.filter((property) => property._id !== propertyId));
            }
            else {
                // Add to favorites
                await FavoritesAPI.addProperty(propertyId);
                toast.success("Property added to favorites");
                // Refresh favorites to get the updated list
                fetchFavorites();
            }
        }
        catch (_error) {
            // Revert UI state if operation fails
            setIsFavorited((prev) => !prev);
            toast.error("Failed to update favorites");
        }
    };
    // Check authentication status on component mount and storage changes
    useEffect(() => {
        checkAuthStatus();
        // Listen for storage changes to update auth status
        const handleStorageChange = () => {
            checkAuthStatus();
        };
        window.addEventListener('storage', handleStorageChange);
        // Also check periodically for same-window changes
        const interval = setInterval(checkAuthStatus, 1000);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);
    const fetchPropertyData = async () => {
        if (!propertyId)
            return;
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`/api/properties/${propertyId}`);
            setProperty(response.data);
            // Update EMI loan amount based on property price
            setEmiData(prev => (Object.assign(Object.assign({}, prev), { loanAmount: Math.round(response.data.price * 0.8) })));
            // Fetch similar properties (same area, property type, etc.)
            fetchSimilarProperties(response.data);
        }
        catch (_err) {
            setError("Failed to load property details. Please try again later.");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPropertyData();
    }, [propertyId]);
    // Auto-show contact details when user logs in
    useEffect(() => {
        if (isAuthenticated) {
            setShowContactDetails(true);
            // Also fetch favorites when user becomes authenticated
            if (token) {
                fetchFavorites();
            }
        }
    }, [isAuthenticated, token]);
    const fetchSimilarProperties = async (currentProperty) => {
        try {
            // In a real implementation, you would call a specific endpoint for similar properties
            // For now, we'll just filter properties with the same property type from the general endpoint
            const response = await axios.get("/api/properties", {
                params: {
                    propertyType: currentProperty.propertyType,
                    limit: 3,
                },
            });
            if (response.data.success) {
                // Filter out the current property and limit to 3 similar properties
                const similar = response.data.properties
                    .filter((p) => p._id !== currentProperty._id)
                    .slice(0, 3);
                setSimilarProperties(similar);
            }
        }
        catch (_err) {
        }
    };
    const checkFavoriteStatus = async () => {
        try {
            // In a real implementation, you would check if this property is in the user's favorites
            // For now, we'll just simulate the check
        }
        catch (_err) {
        }
    };
    // const toggleFavorite = async () => {
    //     try {
    //         // In a real implementation, you would call an API to toggle the favorite status
    //         // For now, we'll just toggle the state
    //         setIsFavorite(!isFavorite);
    //     } catch (_err) {
    //         //     }
    // };
    // const handleContactFormChange = (_e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const { name, value } = e.target;
    //     setContactForm(prev => ({
    //         ...prev,
    //         [name]: value
    //     }));
    // };
    const handleContactFormSubmit = async (_e) => {
        _e.preventDefault();
        if (!property)
            return;
        // Check if user is authenticated
        if (!isAuthenticated) {
            handleShowContact();
            return;
        }
        // Validate form
        if (!contactForm.name ||
            !contactForm.email ||
            !contactForm.phone ||
            !contactForm.message) {
            setContactFormError("All fields are required");
            toast.error("Please fill in all fields");
            return;
        }
        try {
            setContactFormSubmitting(true);
            setContactFormError(null);
            const response = await fetch("/api/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: contactForm.name,
                    email: contactForm.email,
                    phone: contactForm.phone,
                    message: contactForm.message,
                    propertyTitle: property.title,
                }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Message sent successfully!");
                setContactFormSuccess(true);
                // Reset form after success
                setContactForm({
                    name: "",
                    email: "",
                    phone: "",
                    message: "I'm interested in this property...",
                });
            }
            else {
                throw new Error(data.message);
            }
        }
        catch (_err) {
            setContactFormError("Failed to send your message. Please try again.");
            toast.error("Failed to send message. Please try again.");
        }
        finally {
            setContactFormSubmitting(false);
        }
    };
    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard
            .writeText(url)
            .then(() => {
            toast.success("Link copied to clipboard");
        })
            .catch(() => {
            toast.error("Failed to copy link");
        });
    };
    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>);
    }
    if (error || !property) {
        return (<div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="text-xl text-black mb-4">
          {error || "Property not found"}
        </div>
        <button onClick={() => router.push("/search")} className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
          Back to Search
        </button>
      </div>);
    }
    return (<main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section with Property Main Image */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-orange-500 z-10"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mt-16">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-3 mb-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="inline-block bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-500/20">
                <span className="text-white font-medium">
                  {property.listingType === "rent" ? "For Rent" : "For Sale"}
                </span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="inline-block bg-orange-500/80 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white font-medium">
                  {property.propertyType}
                  {property.subType && ` - ${property.subType}`}
                </span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="inline-block bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-500/20">
                <span className="text-white font-medium">
                  {property.status}
                </span>
              </motion.div>

              {property.possessionStatus && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="inline-block bg-green-500/80 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-white font-medium">
                    {property.possessionStatus}
                  </span>
                </motion.div>)}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-sm">
                {property.title}
              </h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex items-center mt-2 text-white">
              <IoLocationOutline className="h-5 w-5 mr-2"/>
              <span>{`${property.address.street ? property.address.street + ", " : ""}${property.address.city}${property.address.state ? `, ${property.address.state}` : ""}${property.address.zipCode ? ` - ${property.address.zipCode}` : ""}`}</span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-4 flex items-center justify-between">
              <div className="text-3xl font-bold text-white">
                ₹{property.price.toLocaleString()}
                <span className="text-sm ml-2 opacity-80">
                  {property.listingType === "rent" ? "/ month" : ""}
                </span>
              </div>

              <div className="flex gap-3">
                <button onClick={() => toggleFavorite(property._id)} className="h-10 w-10 flex items-center justify-center bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full shadow-sm transition-colors" aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}>
                  {isFavorited ? (<FaHeart className="h-5 w-5 text-red-500"/>) : (<FaRegHeart className="h-5 w-5 text-white hover:text-orange-500"/>)}
                </button>

                <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-sm transition-colors flex items-center gap-2" onClick={handleShare}>
                  <span>Share</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                  </svg>
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/30 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="flex flex-col items-center text-center text-white">
                <FaBed className="h-6 w-6 text-orange-400 mb-1"/>
                <span className="text-sm opacity-80">Bedrooms</span>
                <span className="text-xl font-semibold">
                  {property.bedrooms}
                </span>
              </div>

              <div className="flex flex-col items-center text-center text-white">
                <FaBath className="h-6 w-6 text-orange-400 mb-1"/>
                <span className="text-sm opacity-80">Bathrooms</span>
                <span className="text-xl font-semibold">
                  {property.bathrooms}
                </span>
              </div>

              <div className="flex flex-col items-center text-center text-white">
                <FaRulerCombined className="h-6 w-6 text-orange-400 mb-1"/>
                <span className="text-sm opacity-80">{property.carpetArea ? "Super Area" : "Area"}</span>
                <span className="text-xl font-semibold">
                  {property.area} sqft
                </span>
              </div>

              {property.carpetArea ? (<div className="flex flex-col items-center text-center text-white">
                  <FaRulerCombined className="h-6 w-6 text-orange-400 mb-1"/>
                  <span className="text-sm opacity-80">Carpet Area</span>
                  <span className="text-xl font-semibold">
                    {property.carpetArea} sqft
                  </span>
                </div>) : (<div className="flex flex-col items-center text-center text-white">
                  <FaCar className="h-6 w-6 text-orange-400 mb-1"/>
                  <span className="text-sm opacity-80">Parking</span>
                  <span className="text-xl font-semibold">
                    {property.parking || 0}
                  </span>
                </div>)}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Property Navigation Menu */}
      <div className="sticky top-0 z-30 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto whitespace-nowrap py-4 gap-8 scrollbar-hide">
            <a href="#overview" className="text-black font-medium hover:text-orange-500 transition-colors">
              Overview
            </a>
            <a href="#details" className="text-black font-medium hover:text-orange-500 transition-colors">
              Details
            </a>
            <a href="#gallery" className="text-black font-medium hover:text-orange-500 transition-colors">
              Gallery
            </a>
            <a href="#amenities" className="text-black font-medium hover:text-orange-500 transition-colors">
              Amenities
            </a>
            <a href="#locality" className="text-black font-medium hover:text-orange-500 transition-colors">
              Locality
            </a>
            <a href="#reviews" className="text-black font-medium hover:text-orange-500 transition-colors">
              Reviews
            </a>
          </div>
        </div>
      </div>

      {/* Property Details Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Property Details */}
            <div className="lg:col-span-2 space-y-10">
              {/* Property Overview */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} id="overview" className="bg-white p-8 rounded-xl shadow-lg border border-black/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-black">
                    Property Overview
                  </h2>
                  <div className="px-3 py-1.5 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                    {property.views} people viewed
                  </div>
                </div>

                <div className="prose max-w-none text-black mb-8">
                  <p className="text-lg leading-relaxed">
                    {property.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="flex flex-col items-center text-center p-4 bg-orange-50 border border-orange-100 rounded-lg transition-all hover:shadow-md">
                    <FaBed className="h-6 w-6 text-orange-500 mb-2"/>
                    <span className="text-sm text-black/70">Bedrooms</span>
                    <span className="text-xl font-semibold text-black">
                      {property.bedrooms}
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-orange-50 border border-orange-100 rounded-lg transition-all hover:shadow-md">
                    <FaBath className="h-6 w-6 text-orange-500 mb-2"/>
                    <span className="text-sm text-black/70">Bathrooms</span>
                    <span className="text-xl font-semibold text-black">
                      {property.bathrooms}
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-orange-50 border border-orange-100 rounded-lg transition-all hover:shadow-md">
                    <FaRulerCombined className="h-6 w-6 text-orange-500 mb-2"/>
                    <span className="text-sm text-black/70">Built-up Area</span>
                    <span className="text-xl font-semibold text-black">
                      {property.area} sqft
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-orange-50 border border-orange-100 rounded-lg transition-all hover:shadow-md">
                    <FaCalendarAlt className="h-6 w-6 text-orange-500 mb-2"/>
                    <span className="text-sm text-black/70">Year Built</span>
                    <span className="text-xl font-semibold text-black">
                      {property.yearBuilt || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="flex items-start">
                    <BsBuilding className="h-5 w-5 text-orange-500 mr-3 mt-1 flex-shrink-0"/>
                    <div>
                      <span className="text-black/70 text-sm">
                        Property Type
                      </span>
                      <p className="text-black font-medium">
                        {property.propertyType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <IoLocationOutline className="h-5 w-5 text-orange-500 mr-3 mt-1 flex-shrink-0"/>
                    <div>
                      <span className="text-black/70 text-sm">Location</span>
                      <p className="text-black font-medium">
                        {property.address.city}
                        {property.address.state
            ? `, ${property.address.state}`
            : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaCar className="h-5 w-5 text-orange-500 mr-3 mt-1 flex-shrink-0"/>
                    <div>
                      <span className="text-black/70 text-sm">Parking</span>
                      <p className="text-black font-medium">
                        {property.parking
            ? `${property.parking} car space${property.parking > 1 ? "s" : ""}`
            : "Not available"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <BsGraphUp className="h-5 w-5 text-orange-500 mr-3 mt-1 flex-shrink-0"/>
                    <div>
                      <span className="text-black/70 text-sm">Status</span>
                      <p className="text-black font-medium">
                        {property.status}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Property Details */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} id="details" className="bg-white p-8 rounded-xl shadow-lg border border-black/10">
                <h2 className="text-2xl font-semibold text-black mb-6">
                  Property Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <div>
                    <h3 className="text-lg font-medium text-black mb-4 border-b border-black/10 pb-2">
                      Basic Information
                    </h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-black/70">Property ID</dt>
                        <dd className="font-medium text-black">
                          {property._id.slice(-8)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-black/70">Property Type</dt>
                        <dd className="font-medium text-black">
                          {property.propertyType}
                          {property.subType && ` (${property.subType})`}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-black/70">Listing Type</dt>
                        <dd className="font-medium text-black">
                          For {property.listingType}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-black/70">Price</dt>
                        <dd className="font-medium text-black">
                          ₹{property.price.toLocaleString()}
                          {property.priceNegotiable && <span className="text-orange-500 text-sm ml-1">(Negotiable)</span>}
                        </dd>
                      </div>
                      {property.maintenanceCharges && (<div className="flex justify-between">
                          <dt className="text-black/70">Maintenance</dt>
                          <dd className="font-medium text-black">
                            ₹{property.maintenanceCharges.toLocaleString()}/month
                          </dd>
                        </div>)}
                      {property.securityDeposit && (<div className="flex justify-between">
                          <dt className="text-black/70">Security Deposit</dt>
                          <dd className="font-medium text-black">
                            ₹{property.securityDeposit.toLocaleString()}
                          </dd>
                        </div>)}
                      <div className="flex justify-between">
                        <dt className="text-black/70">Super Area</dt>
                        <dd className="font-medium text-black">
                          {property.area} sqft
                        </dd>
                      </div>
                      {property.carpetArea && (<div className="flex justify-between">
                          <dt className="text-black/70">Carpet Area</dt>
                          <dd className="font-medium text-black">
                            {property.carpetArea} sqft
                          </dd>
                        </div>)}
                      {property.bedrooms > 0 && (<div className="flex justify-between">
                          <dt className="text-black/70">Bedrooms</dt>
                          <dd className="font-medium text-black">
                            {property.bedrooms}
                          </dd>
                        </div>)}
                      {property.bathrooms > 0 && (<div className="flex justify-between">
                          <dt className="text-black/70">Bathrooms</dt>
                          <dd className="font-medium text-black">
                            {property.bathrooms}
                          </dd>
                        </div>)}
                      {property.balconyCount && property.balconyCount > 0 && (<div className="flex justify-between">
                          <dt className="text-black/70">Balconies</dt>
                          <dd className="font-medium text-black">
                            {property.balconyCount}
                          </dd>
                        </div>)}
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-black mb-4 border-b border-black/10 pb-2">
                      Additional Details
                    </h3>
                    <dl className="space-y-3">
                      {property.propertyAge && (<div className="flex justify-between">
                          <dt className="text-black/70">Property Age</dt>
                          <dd className="font-medium text-black">
                            {property.propertyAge}
                          </dd>
                        </div>)}
                      {property.possessionStatus && (<div className="flex justify-between">
                          <dt className="text-black/70">Possession</dt>
                          <dd className="font-medium text-black">
                            {property.possessionStatus}
                          </dd>
                        </div>)}
                      {property.availableFrom && (<div className="flex justify-between">
                          <dt className="text-black/70">Available From</dt>
                          <dd className="font-medium text-black">
                            {property.availableFrom}
                          </dd>
                        </div>)}
                      <div className="flex justify-between">
                        <dt className="text-black/70">Furnished</dt>
                        <dd className="font-medium text-black">
                          {property.furnished !== undefined ? (property.furnished ? "Yes" : "No") : "N/A"}
                        </dd>
                      </div>
                      {property.furnishing && (<div className="flex justify-between">
                          <dt className="text-black/70">Furnishing Type</dt>
                          <dd className="font-medium text-black">
                            {property.furnishing}
                          </dd>
                        </div>)}
                      {property.balconyCount !== undefined && (<div className="flex justify-between">
                          <dt className="text-black/70">Balconies</dt>
                          <dd className="font-medium text-black">
                            {property.balconyCount}
                          </dd>
                        </div>)}
                      {property.facing && (<div className="flex justify-between">
                          <dt className="text-black/70">Facing</dt>
                          <dd className="font-medium text-black">
                            {property.facing}
                          </dd>
                        </div>)}
                      {property.waterElectricity && (<div className="flex justify-between">
                          <dt className="text-black/70">Water & Electricity</dt>
                          <dd className="font-medium text-black">
                            {property.waterElectricity}
                          </dd>
                        </div>)}
                      {property.ownershipType && (<div className="flex justify-between">
                          <dt className="text-black/70">Ownership Type</dt>
                          <dd className="font-medium text-black">
                            {property.ownershipType}
                          </dd>
                        </div>)}
                      <div className="flex justify-between">
                        <dt className="text-black/70">Status</dt>
                        <dd className="font-medium text-black">
                          {property.status}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-black/70">Parking</dt>
                        <dd className="font-medium text-black">
                          {property.parking || "N/A"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-black/70">Listed</dt>
                        <dd className="font-medium text-black">
                          {new Date(property.createdAt).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </motion.div>

              {/* Property Gallery */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} id="gallery" className="bg-white p-8 rounded-xl shadow-lg border border-black/10">
                <h2 className="text-2xl font-semibold text-black mb-6">
                  Property Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {property.images.slice(0, 6).map((img, index) => (<div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-black/10 group cursor-pointer" onClick={() => openImageOverlay(index)}>
                      <Image src={`${img}`} alt={`${property.title} - Image ${index + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300"/>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                          </svg>
                        </div>
                      </div>
                    </div>))}
                </div>
                {property.images.length > 6 && (<div className="mt-4 text-center">
                    <button onClick={() => openImageOverlay(0)} className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                      View All {property.images.length} Photos
                    </button>
                  </div>)}
              </motion.div>

              {/* Location Details Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} id="location" className="bg-white p-8 rounded-xl shadow-lg border border-black/10">
                <h2 className="text-2xl font-semibold text-black mb-6">
                  Location Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-black mb-4">Address</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <IoLocationOutline className="h-5 w-5 text-orange-500 mr-3 mt-1 flex-shrink-0"/>
                        <div>
                          <p className="text-black font-medium">
                            {property.address.street}
                          </p>
                          <p className="text-black/70 text-sm">
                            {property.address.locality && `${property.address.locality}, `}
                            {property.address.city}
                            {property.address.state && `, ${property.address.state}`}
                            {property.address.zipCode && ` - ${property.address.zipCode}`}
                          </p>
                        </div>
                      </div>
                      {property.address.projectName && (<div className="flex justify-between">
                          <span className="text-black/70">Project</span>
                          <span className="font-medium text-black">{property.address.projectName}</span>
                        </div>)}
                      {property.address.floorNumber && (<div className="flex justify-between">
                          <span className="text-black/70">Floor</span>
                          <span className="font-medium text-black">{property.address.floorNumber}</span>
                        </div>)}
                      {property.address.landmark && (<div className="flex justify-between">
                          <span className="text-black/70">Landmark</span>
                          <span className="font-medium text-black">{property.address.landmark}</span>
                        </div>)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-black mb-4">Contact Owner</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-black/70">Name</span>
                        <span className="font-medium text-black">{property.ownerDetails.name}</span>
                      </div>
                      {(session === null || session === void 0 ? void 0 : session.user) || showContactDetails ? (<>
                          <div className="flex justify-between">
                            <span className="text-black/70">Phone</span>
                            <span className="font-medium text-black">{property.ownerDetails.phone}</span>
                          </div>
                          {property.ownerDetails.email && (<div className="flex justify-between">
                              <span className="text-black/70">Email</span>
                              <span className="font-medium text-black">{property.ownerDetails.email}</span>
                            </div>)}
                        </>) : (<div className="flex justify-center">
                          <button onClick={handleShowContact} className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                            </svg>
                            Show Contact Details
                          </button>
                        </div>)}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Amenities Section */}
              {property.amenities && property.amenities.length > 0 && (<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} id="amenities" className="bg-white p-8 rounded-xl shadow-lg border border-black/10">
                  <h2 className="text-2xl font-semibold text-black mb-6">
                    Amenities & Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, index) => (<div key={index} className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <IoCheckmarkCircleOutline className="h-5 w-5 text-orange-500"/>
                        </div>
                        <span className="text-black">{amenity}</span>
                      </div>))}
                    {property.features &&
                property.features.map((feature, index) => (<div key={`feature-${index}`} className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <IoCheckmarkCircleOutline className="h-5 w-5 text-orange-500"/>
                          </div>
                          <span className="text-black">{feature}</span>
                        </div>))}
                  </div>
                </motion.div>)}


              {/* Delhi Area Analyzer */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} viewport={{ once: true }} id="area-analysis" className="bg-white p-8 rounded-xl shadow-lg border border-black/10">
                <h2 className="text-2xl font-semibold text-black mb-6">
                  Area Analysis
                </h2>
                <LocalityAnalysis locality={((_a = property.address) === null || _a === void 0 ? void 0 : _a.locality) || ((_b = property.address) === null || _b === void 0 ? void 0 : _b.city) || 'Delhi'}/>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Price Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white sticky top-24 mb-28">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">
                    ₹{property.price.toLocaleString()}
                  </h3>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                    {property.listingType === "rent" ? "For Rent" : "For Sale"}
                  </span>
                </div>
                <div className="bg-white/10 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <p className="text-white/80 text-sm">Area</p>
                      <p className="font-semibold">{property.area} sqft</p>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Price/sqft</p>
                      <p className="font-semibold">
                        ₹
                        {Math.round(property.price / property.area).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  {isAuthenticated || showContactDetails ? (<>
                      <button onClick={() => handleContactOwner('phone')} className="w-full py-3 bg-white text-orange-600 font-semibold rounded-md hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                        </svg>
                        Call: {property.ownerDetails.phone}
                      </button>
                      <button onClick={() => handleContactOwner('email')} className="w-full py-3 bg-black text-white font-semibold rounded-md hover:bg-black/80 transition-colors flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                        </svg>
                        Email Owner
                      </button>
                    </>) : (<button onClick={handleShowContact} className="w-full py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                      Show Contact Details
                    </button>)}
                </div>
                <div className="text-sm text-white/70 text-center">
                  Listed on {new Date(property.createdAt).toLocaleDateString()}
                </div>
              </motion.div>

              {/* Agent Information */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }} className="bg-white p-6 rounded-xl shadow-lg border border-black/10">
                <h3 className="text-xl font-semibold text-black mb-4">
                  Listed By
                </h3>
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mr-4 relative overflow-hidden">
                    <span className="text-orange-500 font-medium text-xl">
                      {((_c = property.ownerDetails.name) === null || _c === void 0 ? void 0 : _c[0]) || "PO"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-black text-lg">
                      {property.ownerDetails.name || "Property Owner"}
                    </p>
                    {(session === null || session === void 0 ? void 0 : session.user) || showContactDetails ? (<p className="text-sm text-black/70 mb-2">
                        {property.ownerDetails.phone || "Contact via phone"}
                      </p>) : (<button onClick={handleShowContact} className="text-sm text-orange-600 hover:text-orange-700 font-medium mb-2 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                        </svg>
                        Show Contact Info
                      </button>)}
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="bg-white p-6 rounded-xl shadow-lg border border-black/10">
                <h3 className="text-xl font-semibold text-black mb-4">
                  Interested in this property?
                </h3>

                {!checkAuthStatus ? (<div className="text-center py-8">
                    <div className="mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      <p className="text-gray-600 mb-4">
                        Please log in to contact the property owner
                      </p>
                    </div>
                    <button onClick={handleShowContact} className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors">
                      Login to Contact Owner
                    </button>
                  </div>) : contactFormSuccess ? (<div className="p-4 bg-orange-50 rounded-md text-black mb-4 border border-orange-500/20">
                    <p className="font-medium">Thank you for your inquiry!</p>
                    <p className="text-sm mt-1">
                      The owner will contact you shortly.
                    </p>
                  </div>) : (<form onSubmit={handleContactFormSubmit} className="space-y-4">
                    {contactFormError && (<div className="p-3 bg-black/5 text-black rounded-md text-sm border border-black/10">
                        {contactFormError}
                      </div>)}

                    <div>
                      <label htmlFor="name" className="text-black text-sm mb-1 block">
                        Full Name
                      </label>
                      <input type="text" id="name" name="name" value={contactForm.name} onChange={(_e) => setContactForm(Object.assign(Object.assign({}, contactForm), { name: _e.target.value }))} placeholder="Enter your name" className="w-full px-4 py-2 rounded-md border border-black/20 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"/>
                    </div>
                    <div>
                      <label htmlFor="email" className="text-black text-sm mb-1 block">
                        Email Address
                      </label>
                      <input type="email" id="email" name="email" value={contactForm.email} onChange={(_e) => setContactForm(Object.assign(Object.assign({}, contactForm), { email: _e.target.value }))} placeholder="Enter your email" className="w-full px-4 py-2 rounded-md border border-black/20 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"/>
                    </div>
                    <div>
                      <label htmlFor="phone" className="text-black text-sm mb-1 block">
                        Phone Number
                      </label>
                      <input type="tel" id="phone" name="phone" value={contactForm.phone} onChange={(_e) => setContactForm(Object.assign(Object.assign({}, contactForm), { phone: _e.target.value }))} placeholder="Enter your phone number" className="w-full px-4 py-2 rounded-md border border-black/20 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"/>
                    </div>
                    <div>
                      <label htmlFor="message" className="text-black text-sm mb-1 block">
                        Message
                      </label>
                      <textarea id="message" name="message" value={contactForm.message} onChange={(_e) => setContactForm(Object.assign(Object.assign({}, contactForm), { message: _e.target.value }))} placeholder="I'm interested in this property..." rows={4} className="w-full px-4 py-2 rounded-md border border-black/20 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"></textarea>
                    </div>
                    <button type="submit" disabled={contactFormSubmitting} className="w-full px-4 py-3 bg-orange-500 text-white font-semibold rounded-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70">
                      {contactFormSubmitting ? "Sending..." : "Contact Owner"}
                    </button>
                  </form>)}
              </motion.div>

              {/* EMI Calculator */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }} className="bg-white p-6 rounded-xl shadow-lg border border-black/10">
                <h3 className="text-xl font-semibold text-black mb-4">
                  EMI Calculator
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-black/70 block mb-1">
                      Loan Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
                        ₹
                      </span>
                      <input type="number" value={emiData.loanAmount} onChange={(e) => setEmiData(Object.assign(Object.assign({}, emiData), { loanAmount: parseInt(e.target.value) || 0 }))} className="w-full pl-8 pr-3 py-2 border border-black/20 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                    </div>
                    <p className="text-xs text-black/60 mt-1">
                      Default: 80% of property value
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-black/70 block mb-1">
                      Interest Rate
                    </label>
                    <div className="relative">
                      <input type="number" step="0.1" value={emiData.interestRate} onChange={(e) => setEmiData(Object.assign(Object.assign({}, emiData), { interestRate: parseFloat(e.target.value) || 0 }))} className="w-full pl-3 pr-8 py-2 border border-black/20 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black">
                        %
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-black/70 block mb-1">
                      Loan Tenure
                    </label>
                    <div className="relative">
                      <input type="number" value={emiData.tenure} onChange={(e) => setEmiData(Object.assign(Object.assign({}, emiData), { tenure: parseInt(e.target.value) || 0 }))} className="w-full pl-3 pr-12 py-2 border border-black/20 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black">
                        years
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-black/10">
                    <div className="flex justify-between items-center">
                      <span className="text-black/70">Monthly EMI</span>
                      <span className="text-lg font-semibold text-orange-600">
                        ₹{emiCalculation.emi.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-black/70">Total Interest</span>
                      <span className="text-black">
                        ₹{emiCalculation.totalInterest.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-black/70">Total Amount</span>
                      <span className="text-black font-medium">
                        ₹{emiCalculation.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button onClick={() => {
            router.push("/contact");
        }} className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm cursor-pointer z-40">
                    Get Pre-Approved Loan
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (<section id="similar" className="py-16 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden mb-16">

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="inline-block bg-orange-500 px-4 py-2 rounded-full mb-4">
                <span className="text-white font-medium">EXPLORE MORE</span>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-white mb-6">
                Similar Properties
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="text-lg text-white/80">
                Discover other properties you might be interested in
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProperties.map((property) => {
                var _a;
                return (<motion.div key={property._id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative h-48">
                    <Image src={property.images[0]} alt={property.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
                    <div className="absolute top-2 right-2">
                      <span className="bg-black text-white px-2 py-1 rounded text-xs font-medium">
                        {property.listingType === "rent"
                        ? "For Rent"
                        : "For Sale"}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-black line-clamp-1 group-hover:text-orange-500 transition-colors">
                      {property.title}
                    </h3>
                    <p className="text-sm text-black/70 mt-1 flex items-center">
                      <FaMapMarkerAlt className="h-3 w-3 mr-1 text-orange-500"/>
                      {(_a = property.address) === null || _a === void 0 ? void 0 : _a.city}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs bg-black/5 px-2 py-0.5 rounded-full">
                        {property.bedrooms} Beds
                      </span>
                      <span className="text-xs bg-black/5 px-2 py-0.5 rounded-full">
                        {property.bathrooms} Baths
                      </span>
                      <span className="text-xs bg-black/5 px-2 py-0.5 rounded-full">
                        {property.area} sqft
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-orange-500 font-medium">
                        ₹{property.price.toLocaleString()}
                      </div>
                      <a href={`/search/${property._id}`} className="px-3 py-1 bg-black text-white text-xs rounded-md hover:bg-orange-500 transition-colors flex items-center gap-1">
                        View Details
                      </a>
                    </div>
                  </div>
                </motion.div>);
            })}
            </div>
          </div>
        </section>)}

      {/* Property News Section */}
      <PropertyNewsWhiteSection />

      {/* FAQs Section */}
      <section className="py-16 bg-orange-50 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-black mb-6">
              Frequently Asked Questions
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="text-lg text-black/70">
              Get answers to common questions about this property and the buying
              process
            </motion.p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
            {
                question: "What documents will I need to purchase this property?",
                answer: "You'll need identity proof (Aadhar, PAN), address proof, income proof such as salary slips or ITR, bank statements for the last 6 months, and passport-sized photographs. For loan applications, additional documents may be required by the bank.",
            },
            {
                question: "Are there any additional costs beyond the listed price?",
                answer: "Yes, you should budget for stamp duty (typically 5-7% of property value), registration charges (approximately 1%), GST (if applicable), maintenance deposit, legal fees, and loan processing fees if you're financing the purchase.",
            },
            {
                question: "Is the property part of a housing society?",
                answer: "Yes, this property is part of a registered housing society with common amenities. Monthly maintenance charges apply and are used for security, cleaning, and maintenance of common areas.",
            },
            {
                question: "How is the water and electricity supply in this area?",
                answer: "The area has a reliable 24-hour water supply from the municipal corporation and minimal power outages. The property also has power backup for common areas and essential services.",
            },
        ].map((faq, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4 text-black">
                    <h3 className="font-medium">{faq.question}</h3>
                    <svg className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </summary>
                  <div className="px-4 pb-4 text-black/70">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              </motion.div>))}
          </div>
        </div>
      </section>

      {/* Image Overlay */}
      <AnimatePresence>
        {showImageOverlay && selectedImageIndex !== null && property && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={closeImageOverlay}>
            {/* Close Button */}
            <button onClick={closeImageOverlay} className="absolute top-4 right-4 z-60 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors" aria-label="Close image overlay">
              <FaTimes className="h-6 w-6"/>
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-60 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {property.images.length}
            </div>

            {/* Navigation Buttons */}
            {property.images.length > 1 && (<>
                <button onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                }} className="absolute left-4 z-60 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors" aria-label="Previous image">
                  <FaChevronLeft className="h-6 w-6"/>
                </button>
                <button onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                }} className="absolute right-16 z-60 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors" aria-label="Next image">
                  <FaChevronRight className="h-6 w-6"/>
                </button>
              </>)}

            {/* Main Image */}
            <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <Image src={property.images[selectedImageIndex]} alt={`${property.title} - Image ${selectedImageIndex + 1}`} fill className="object-contain" priority/>
            </div>

            {/* Image Title */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-60 bg-black/50 text-white px-4 py-2 rounded-lg text-center">
              <p className="font-medium">{property.title}</p>
              <p className="text-sm opacity-80">Image {selectedImageIndex + 1} of {property.images.length}</p>
            </div>
          </motion.div>)}
      </AnimatePresence>

      <Footer />
    </main>);
}
