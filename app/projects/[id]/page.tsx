"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBuilding,
  FaHome,
  FaRulerCombined,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaArrowLeft,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaEye,
  FaCertificate,
  FaCheckCircle,
  FaInfoCircle,
  FaDownload,
  FaBed,
  FaBath,
  FaCar,
  FaCompass,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { FavoritesAPI } from "../../lib/api-helpers";
import { PropertyNewsWhiteSection } from "../../../components/ui/property-news-white";

// Decorative components
const CirclePattern = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full border border-current opacity-10"></div>
    <div className="absolute top-40 -left-40 w-64 h-64 rounded-full border border-current opacity-10"></div>
    <div className="absolute -bottom-20 right-20 w-48 h-48 rounded-full border border-current opacity-10"></div>
  </div>
);

// FAQ Item Component
const FAQItem: React.FC<{ question: string; answer: string; index: number }> = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-black pr-4">{question}</span>
        <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </div>
      )}
    </motion.div>
  );
};

// Area Data Interface for Delhi Area Analyzer
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

interface Project {
  _id: string;
  projectName: string;
  projectType: string;
  propertyTypesOffered: string[];
  projectStage: string;
  reraRegistrationNo: string;
  projectTagline: string;
  developerDescription: string;
  city: string;
  locality: string;
  projectAddress: string;
  landmark?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  unitTypes: {
    _id: string;
    type: string;
    sizeRange: {
      min: number;
      max: number;
      unit: string;
    };
    priceRange: {
      min: number;
      max: number;
      perSqft?: number;
    };
  }[];
  paymentPlans: string[];
  bookingAmount?: number;
  allInclusivePricing?: boolean;
  possessionDate: string;
  constructionStatus: string;
  projectAmenities: string[];
  unitSpecifications?: string;
  greenCertifications: string[];
  projectUSPs: string[];
  projectImages: string[];
  floorPlans: string[];
  videoWalkthrough?: string;
  developer: {
    _id: string;
    name: string;
    email: string;
  };
  developerContact: {
    name: string;
    phone: string;
    email: string;
    affiliation?: string;
  };
  status: string;
  verified: boolean;
  views: number;
  favorites: number;
  inquiries: number;
  createdAt: string;
  updatedAt: string;
}

const ProjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [overlayImageIndex, setOverlayImageIndex] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "I'm interested in this project...",
  });
  const [contactFormSubmitting, setContactFormSubmitting] = useState(false);
  const [areaData, setAreaData] = useState<AreaData | null>(null);
  const [areaDataLoading, setAreaDataLoading] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState<Project[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);

  const projectId = params.id as string;

  // Check authentication status from sessionStorage
  const checkAuthStatus = () => {
    if (typeof window !== 'undefined') {
      const authToken = sessionStorage.getItem("authToken");
      setToken(authToken);
      setIsAuthenticated(!!authToken);
      return !!authToken;
    }
    return false;
  };

  // Handle image overlay
  const openImageOverlay = (index: number) => {
    setOverlayImageIndex(index);
    setShowImageOverlay(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeImageOverlay = () => {
    setShowImageOverlay(false);
    setOverlayImageIndex(null);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!project || overlayImageIndex === null) return;
    
    // Combine project images and floor plans for navigation
    const allImages = [
      ...(project.projectImages || []),
      ...(project.floorPlans || [])
    ];
    
    const totalImages = allImages.length;
    if (direction === 'prev') {
      setOverlayImageIndex(overlayImageIndex === 0 ? totalImages - 1 : overlayImageIndex - 1);
    } else {
      setOverlayImageIndex(overlayImageIndex === totalImages - 1 ? 0 : overlayImageIndex + 1);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!showImageOverlay) return;
      
      if (e.key === 'Escape') {
        closeImageOverlay();
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showImageOverlay, overlayImageIndex]);

  // Cleanup overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Get auth token and check authentication status
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

  // Fetch favorites when token is available
  const fetchFavorites = async () => {
    if (token) {
      try {
        const projectsData = await FavoritesAPI.getProjects();
        setFavorites(projectsData.favorites);

        // Check if current project is in favorites
        if (
          project &&
          projectsData.favorites.some((fav: Project) => fav._id === project._id)
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
      fetchFavorites();
    }
  }, [token]);

  // Update isFavorited when project or favorites change
  useEffect(() => {
    if (project && favorites.length > 0) {
      setIsFavorited(favorites.some((fav) => fav._id === project._id));
    }
  }, [project, favorites]);

  // Toggle favorite functionality
  const toggleFavorite = async (projectId: string) => {
    if (!token) {
      toast.error("Please login to add favorites");
      return;
    }

    try {
      // Optimistically update UI first for responsive feedback
      setIsFavorited((prev) => !prev);

      if (isFavorited) {
        // Remove from favorites
        await FavoritesAPI.removeProject(projectId);
        toast.success("Project removed from favorites");
        // Update local state
        setFavorites(favorites.filter((project) => project._id !== projectId));
      } else {
        // Add to favorites
        await FavoritesAPI.addProject(projectId);
        toast.success("Project added to favorites");
        // Refresh favorites to get the updated list
        fetchFavorites();
      }
    } catch (_error) {
      // Revert UI state if operation fails
      setIsFavorited((prev) => !prev);
      toast.error("Failed to update favorites");
    }
  };

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProject(data.project);
            // Increment view count
            incrementViewCount();
            // Fetch area data for locality section
            if (data.project.locality) {
              fetchAreaData(data.project.locality);
            }
          } else {
            toast.error("Project not found");
            router.push("/projects");
          }
        } else {
          toast.error("Failed to load project");
          router.push("/projects");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to load project");
        router.push("/projects");
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, router]);

  // Fetch favorites when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchFavorites();
    }
  }, [isAuthenticated, token]);

  // Increment view count
  const incrementViewCount = async () => {
    try {
      await fetch(`/api/projects/${projectId}/view`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  // Format price for display
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  // Fetch area data from Delhi Area Analyzer API
  const fetchAreaData = async (locality: string) => {
    try {
      setAreaDataLoading(true);
      const response = await fetch(
        `https://ml-models-vu7b.onrender.com/api/location/${encodeURIComponent(locality)}`
      );

      if (response.ok) {
        const data = await response.json();
        setAreaData(data);
      } else {
        console.log("Area data not found for:", locality);
      }
    } catch (error) {
      console.error("Error fetching area data:", error);
    } finally {
      setAreaDataLoading(false);
    }
  };

  // Handle contact developer
  const handleContact = (type: "phone" | "email" | "whatsapp") => {
    console.log("handleContact called with type:", type);
    
    // Check authentication first
    if (!isAuthenticated) {
      toast.error("Please login to contact the developer");
      return;
    }
    
    if (!project) {
      console.error("Project not loaded");
      toast.error("Project information not available");
      return;
    }

    if (!project.developerContact) {
      console.error("Developer contact information not available");
      toast.error("Developer contact information not available");
      return;
    }

    const { phone, email } = project.developerContact;
    console.log("Developer contact:", { phone, email });

    if (!phone && (type === "phone" || type === "whatsapp")) {
      toast.error("Phone number not available");
      return;
    }

    if (!email && type === "email") {
      toast.error("Email address not available");
      return;
    }

    switch (type) {
      case "phone":
        console.log("Initiating phone call to:", phone);
        window.location.href = `tel:${phone}`;
        toast.success("Opening phone dialer...");
        break;
      case "email":
        console.log("Opening email client for:", email);
        const emailSubject = `Inquiry about ${project.projectName}`;
        const emailUrl = `mailto:${email}?subject=${encodeURIComponent(emailSubject)}`;
        console.log("Email URL:", emailUrl);
        window.location.href = emailUrl;
        toast.success("Opening email client...");
        break;
      case "whatsapp":
        console.log("Opening WhatsApp for:", phone);
        const message = encodeURIComponent(
          `Hi, I'm interested in your project "${project.projectName}" listed on 100Gaj. Can you provide more details?`
        );
        const whatsappUrl = `https://wa.me/91${phone}?text=${message}`;
        console.log("WhatsApp URL:", whatsappUrl);
        window.open(whatsappUrl, "_blank");
        toast.success("Opening WhatsApp...");
        break;
      default:
        console.error("Unknown contact type:", type);
        return;
    }

    // Track inquiry
    trackInquiry();
  };

  // Handle contact form submission
  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check authentication first
    if (!isAuthenticated) {
      toast.error("Please login to send inquiry");
      return;
    }

    if (!project) return;

    // Validate form
    if (!contactForm.name || !contactForm.email || !contactForm.phone || !contactForm.message) {
      toast.error("All fields are required");
      return;
    }

    try {
      setContactFormSubmitting(true);

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
          projectName: project.projectName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Message sent successfully!");
        setContactForm({
          name: "",
          email: "",
          phone: "",
          message: "I'm interested in this project...",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setContactFormSubmitting(false);
    }
  };

  // Track inquiry
  const trackInquiry = async () => {
    try {
      await fetch(`/api/projects/${projectId}/inquiry`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error tracking inquiry:", error);
    }
  };

  // Handle toggle favorite for projects
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add to favorites");
      return;
    }

    try {
      await toggleFavorite(projectId);
    } catch (error) {
      console.error("Error toggling project favorite:", error);
    }
  };

  // Share project
  const shareProject = () => {
    if (navigator.share && project) {
      navigator.share({
        title: project.projectName,
        text: project.projectTagline,
        url: window.location.href,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="text-xl text-black mb-4">Project not found</div>
        <button
          onClick={() => router.push("/projects")}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section with Project Main Image */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0 ">
          <Image
            src={
              project.projectImages && project.projectImages.length > 0
                ? project.projectImages[0]
                : "/placeholder-project.jpg"
            }
            alt={project.projectName}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-orange-500/60 z-10"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mt-24">
          <div className="max-w-4xl">
            {/* Back Button */}
            <motion.button
              onClick={() => router.back()}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-white hover:text-orange-300 transition-colors mb-6"
            >
              <FaArrowLeft className="h-4 w-4" />
              <span>Back to Projects</span>
            </motion.button>

            {/* Project Type and Status Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-block bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-500/20"
              >
                <span className="text-white font-medium capitalize">{project.projectType}</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="inline-block bg-orange-500/80 backdrop-blur-sm px-4 py-2 rounded-full"
              >
                <span className="text-white font-medium">
                  {project.projectStage === "under-construction" ? "Under Construction" : "Ready to Move"}
                </span>
              </motion.div>

              {project.verified && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="inline-block bg-green-600/80 backdrop-blur-sm px-4 py-2 rounded-full"
                >
                  <FaCheckCircle className="inline h-4 w-4 mr-2" />
                  <span className="text-white font-medium">Verified</span>
                </motion.div>
              )}

              {project.allInclusivePricing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="inline-block bg-blue-600/80 backdrop-blur-sm px-4 py-2 rounded-full"
                >
                  <span className="text-white font-medium">All Inclusive Pricing</span>
                </motion.div>
              )}
            </div>

            {/* Project Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-sm">
                {project.projectName}
              </h1>
              <p className="text-xl text-white/90 mb-4">{project.projectTagline}</p>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center mt-2 text-white mb-6"
            >
              <IoLocationOutline className="h-5 w-5 mr-2" />
              <span>{project.locality}, {project.city}</span>
            </motion.div>

            {/* Price Range */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-8"
            >
              <div className="text-3xl font-bold text-white mb-2">
                {project.unitTypes.length > 0 && (
                  <>
                    {formatPrice(project.unitTypes[0].priceRange.min * 100000)} - {formatPrice(project.unitTypes[project.unitTypes.length - 1].priceRange.max * 100000)}
                  </>
                )}
              </div>
              <div className="text-white/80">Starting price</div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex gap-3"
            >
              <button
                onClick={handleToggleFavorite}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-md hover:bg-white/30 transition-colors"
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorited ? (
                  <FaHeart className="h-4 w-4 text-red-500" />
                ) : (
                  <FaRegHeart className="h-4 w-4 text-white" />
                )}
                <span>Save</span>
              </button>
              <button
                onClick={shareProject}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-md hover:bg-white/30 transition-colors"
              >
                <FaShare className="h-4 w-4" />
                <span>Share</span>
              </button>
            </motion.div>

            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/30 backdrop-blur-sm p-4 rounded-xl border border-white/10"
            >
              <div className="flex flex-col items-center text-center text-white">
                <FaBuilding className="h-6 w-6 text-orange-400 mb-1" />
                <span className="text-sm text-white/80">Property Types</span>
                <span className="font-semibold">{project.propertyTypesOffered.length}</span>
              </div>

              <div className="flex flex-col items-center text-center text-white">
                <FaRulerCombined className="h-6 w-6 text-orange-400 mb-1" />
                <span className="text-sm text-white/80">Unit Types</span>
                <span className="font-semibold">{project.unitTypes.length}</span>
              </div>

              <div className="flex flex-col items-center text-center text-white">
                <FaCalendarAlt className="h-6 w-6 text-orange-400 mb-1" />
                <span className="text-sm text-white/80">Possession</span>
                <span className="font-semibold">
                  {new Date(project.possessionDate).toLocaleDateString('en-IN', {
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex flex-col items-center text-center text-white">
                <FaEye className="h-6 w-6 text-orange-400 mb-1" />
                <span className="text-sm text-white/80">Views</span>
                <span className="font-semibold">{project.views}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Navigation Menu */}
      <div className="sticky top-0 z-30 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto whitespace-nowrap py-4 gap-8 scrollbar-hide">
            <a
              href="#overview"
              className="text-black font-medium hover:text-orange-500 transition-colors"
            >
              Overview
            </a>
            <a
              href="#details"
              className="text-black font-medium hover:text-orange-500 transition-colors"
            >
              Details
            </a>
            <a
              href="#gallery"
              className="text-black font-medium hover:text-orange-500 transition-colors"
            >
              Gallery
            </a>
            <a
              href="#amenities"
              className="text-black font-medium hover:text-orange-500 transition-colors"
            >
              Amenities
            </a>
            <a
              href="#location"
              className="text-black font-medium hover:text-orange-500 transition-colors"
            >
              Location
            </a>
            <a
              href="#locality"
              className="text-black font-medium hover:text-orange-500 transition-colors"
            >
              About Locality
            </a>
            <a
              href="#developer"
              className="text-black font-medium hover:text-orange-500 transition-colors"
            >
              Developer
            </a>
            <a
              href="#news"
              className="text-black font-medium hover:text-orange-500 transition-colors"
            >
              News
            </a>
          </div>
        </div>
      </div>

      {/* Project Details Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Project Details */}
            <div className="lg:col-span-2 space-y-10">
              {/* Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                id="overview"
                className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
              >
                <h2 className="text-2xl font-bold text-black mb-6">Project Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{project.developerDescription}</p>
                
                {/* Key Features */}
                {project.projectUSPs && project.projectUSPs.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-black mb-4">Key Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {project.projectUSPs.map((usp, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100"
                        >
                          <FaCheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                          <span className="text-gray-700">{usp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Unit Types and Pricing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                id="details"
                className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
              >
                <h2 className="text-2xl font-bold text-black mb-6">Unit Types & Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.unitTypes.map((unit, index) => (
                    <div
                      key={index}
                      className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200"
                    >
                      <h3 className="text-xl font-bold text-black mb-3">{unit.type.toUpperCase()}</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Size Range</span>
                          <span className="font-semibold text-black">
                            {unit.sizeRange.min} - {unit.sizeRange.max} {unit.sizeRange.unit}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Price Range</span>
                          <span className="font-bold text-orange-600">
                            {formatPrice(unit.priceRange.min * 100000)} - {formatPrice(unit.priceRange.max * 100000)}
                          </span>
                        </div>
                        {unit.priceRange.perSqft && unit.priceRange.perSqft > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Per Sq Ft</span>
                            <span className="font-semibold text-black">₹{unit.priceRange.perSqft}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                id="gallery"
                className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
              >
                <h2 className="text-2xl font-bold text-black mb-6">Project Gallery</h2>
                
                {/* Main Image */}
                <div 
                  className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-4 cursor-pointer group"
                  onClick={() => openImageOverlay(selectedImageIndex)}
                >
                  <Image
                    src={
                      project.projectImages && project.projectImages.length > 0
                        ? project.projectImages[selectedImageIndex]
                        : "/placeholder-project.jpg"
                    }
                    alt={project.projectName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Hover overlay with zoom icon */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Image Counter */}
                  {project.projectImages && project.projectImages.length > 1 && (
                    <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedImageIndex + 1} / {project.projectImages.length}
                    </div>
                  )}
                </div>

                {/* Image Thumbnails */}
                {project.projectImages && project.projectImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {project.projectImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        onDoubleClick={() => openImageOverlay(index)}
                        className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                          selectedImageIndex === index
                            ? "border-orange-500"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${project.projectName} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Floor Plans */}
              {project.floorPlans && project.floorPlans.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
                >
                  <h2 className="text-2xl font-bold text-black mb-6">Floor Plans</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.floorPlans.map((plan, index) => (
                      <div 
                        key={index} 
                        className="relative h-64 rounded-lg overflow-hidden border border-gray-200 cursor-pointer group"
                        onClick={() => {
                          const allImages = [...(project.projectImages || []), ...(project.floorPlans || [])];
                          const imageIndex = allImages.indexOf(plan);
                          openImageOverlay(imageIndex);
                        }}
                      >
                        <Image
                          src={plan}
                          alt={`Floor Plan ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <FaSearch className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Video Walkthrough */}
              {project.videoWalkthrough && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.55 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
                >
                  <h2 className="text-2xl font-bold text-black mb-6">Video Walkthrough</h2>
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                      src={project.videoWalkthrough}
                      title="Project Video Walkthrough"
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              )}

              {/* Amenities */}
              {project.projectAmenities && project.projectAmenities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                  id="amenities"
                  className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
                >
                  <h2 className="text-2xl font-bold text-black mb-6">Amenities & Features</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.projectAmenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100"
                      >
                        <FaCheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Green Certifications */}
              {project.greenCertifications && project.greenCertifications.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
                >
                  <h2 className="text-2xl font-bold text-black mb-6">Green Certifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.greenCertifications.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200"
                      >
                        <FaCertificate className="h-6 w-6 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{cert}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Unit Specifications */}
              {project.unitSpecifications && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.75 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
                >
                  <h2 className="text-2xl font-bold text-black mb-6">Unit Specifications</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">{project.unitSpecifications}</p>
                  </div>
                </motion.div>
              )}

              {/* Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                id="location"
                className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
              >
                <h2 className="text-2xl font-bold text-black mb-6">Location Details</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700">{project.projectAddress}</p>
                      <p className="text-gray-600">{project.locality}, {project.city}</p>
                      {project.landmark && (
                        <p className="text-gray-600">Near {project.landmark}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* About Locality */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.85 }}
                viewport={{ once: true }}
                id="locality"
                className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
              >
                <h2 className="text-2xl font-bold text-black mb-6">About {project.locality}</h2>
                
                {areaDataLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                    <span className="ml-3 text-gray-600">Loading area analysis...</span>
                  </div>
                ) : areaData ? (
                  <div className="space-y-6">
                    {/* Zone Information */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="text-lg font-semibold text-black mb-2">Zone Information</h3>
                      <p className="text-gray-700">Located in <span className="font-medium">{areaData.zone}</span> zone of Delhi</p>
                    </div>

                    {/* Safety & Crime Analysis */}
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-4">Safety & Security Analysis</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <FaCheckCircle className="h-5 w-5 text-green-500" />
                            <span className="font-medium text-black">Safety Rating</span>
                          </div>
                          <div className="text-2xl font-bold text-green-600">{areaData.safety_rating}/5</div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                          <div className="flex items-center gap-2 mb-2">
                            <FaInfoCircle className="h-5 w-5 text-orange-500" />
                            <span className="font-medium text-black">Crime Level</span>
                          </div>
                          <div className="text-lg font-bold text-orange-600 capitalize">{areaData.crime_level}</div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <FaEye className="h-5 w-5 text-blue-500" />
                            <span className="font-medium text-black">Total Crimes</span>
                          </div>
                          <div className="text-2xl font-bold text-blue-600">{areaData.total_crimes}</div>
                        </div>
                      </div>
                    </div>

                    {/* Pros and Cons */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Pros */}
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                          <FaCheckCircle className="h-5 w-5 text-green-500" />
                          Advantages
                        </h3>
                        <div className="space-y-2">
                          {areaData.pros.map((pro, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                              <FaCheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{pro}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cons */}
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                          <FaInfoCircle className="h-5 w-5 text-orange-500" />
                          Considerations
                        </h3>
                        <div className="space-y-2">
                          {areaData.cons.map((con, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                              <FaInfoCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{con}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Infrastructure Issues */}
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-4">Infrastructure Status</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <h4 className="font-medium text-black mb-2">Electricity</h4>
                          <p className="text-gray-700">{areaData.electricity_issues}</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-black mb-2">Water & Drainage</h4>
                          <p className="text-gray-700">{areaData.water_clogging}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      {project.locality} is a well-connected locality in {project.city}, known for its strategic location and excellent infrastructure. 
                      The area offers a perfect blend of residential comfort and commercial convenience, making it an ideal choice for modern homebuyers.
                    </p>

                    {/* Connectivity & Infrastructure */}
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-4">Connectivity & Infrastructure</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <FaMapMarkerAlt className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-black">Metro Connectivity</span>
                            <p className="text-sm text-gray-600">Well connected to major metro lines</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                          <FaCar className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-black">Road Networks</span>
                            <p className="text-sm text-gray-600">Excellent road connectivity</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                          <FaBuilding className="h-5 w-5 text-orange-500 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-black">Commercial Hubs</span>
                            <p className="text-sm text-gray-600">Proximity to business districts</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                          <FaHome className="h-5 w-5 text-purple-500 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-black">Social Infrastructure</span>
                            <p className="text-sm text-gray-600">Schools, hospitals, and malls nearby</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    

                    {/* Investment Potential */}
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                      <h3 className="text-lg font-semibold text-black mb-3">Investment Potential</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {project.locality} shows strong investment potential with consistent property appreciation rates. 
                        The area&apos;s strategic location, upcoming infrastructure projects, and growing commercial establishments 
                        make it an attractive destination for both end-users and investors.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white sticky top-24 mb-28"
              >
                <h3 className="text-xl font-bold mb-4">Interested in this project?</h3>
                <form onSubmit={handleContactFormSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                    required
                  />
                  <textarea
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white resize-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={contactFormSubmitting}
                    className="w-full bg-white text-orange-600 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {contactFormSubmitting ? "Sending..." : "Send Inquiry"}
                  </button>
                </form>
              </motion.div>

              {/* Quick Contact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg border border-black/10"
              >
                <h3 className="text-lg font-semibold text-black mb-4">Quick Contact</h3>
                
                
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-black">
                      {project?.developerContact?.name || "Contact information loading..."}
                    </p>
                    {project?.developerContact?.affiliation && (
                      <p className="text-sm text-gray-600">{project.developerContact.affiliation}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => {
                        console.log("Call button clicked");
                        handleContact("phone");
                      }}
                      disabled={!project?.developerContact?.phone}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <FaPhone className="h-4 w-4" />
                      <span>Call Now</span>
                      {!project?.developerContact?.phone && (
                        <span className="text-xs">(Not Available)</span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        console.log("WhatsApp button clicked");
                        handleContact("whatsapp");
                      }}
                      disabled={!project?.developerContact?.phone}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <FaWhatsapp className="h-4 w-4" />
                      <span>WhatsApp</span>
                      {!project?.developerContact?.phone && (
                        <span className="text-xs">(Not Available)</span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        console.log("Email button clicked");
                        handleContact("email");
                      }}
                      disabled={!project?.developerContact?.email}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <FaEnvelope className="h-4 w-4" />
                      <span>Email</span>
                      {!project?.developerContact?.email && (
                        <span className="text-xs">(Not Available)</span>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Project Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg border border-black/10"
              >
                <h3 className="text-lg font-semibold text-black mb-4">Project Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">RERA No.</span>
                    <span className="text-black font-medium text-sm text-right">{project.reraRegistrationNo}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">Possession</span>
                    <span className="text-black font-medium text-sm text-right">
                      {new Date(project.possessionDate).toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">Construction Status</span>
                    <span className="text-black font-medium text-sm text-right capitalize">{project.constructionStatus}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">Property Types</span>
                    <span className="text-black font-medium text-sm text-right">
                      {project.propertyTypesOffered.join(", ")}
                    </span>
                  </div>
                  {project.allInclusivePricing && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 text-sm">Pricing</span>
                      <span className="text-green-600 font-medium text-sm text-right">All Inclusive</span>
                    </div>
                  )}
                  {project.bookingAmount && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 text-sm">Booking Amount</span>
                      <span className="text-orange-600 font-bold text-sm text-right">₹{project.bookingAmount.toLocaleString()} Lacs</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Payment Plans */}
              {project.paymentPlans && project.paymentPlans.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-lg border border-black/10"
                >
                  <h3 className="text-lg font-semibold text-black mb-4">Payment Plans</h3>
                  <div className="space-y-3">
                    {project.paymentPlans.map((plan, index) => (
                      <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <span className="text-gray-700 text-sm">{plan}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Developer Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                id="developer"
                className="bg-white p-6 rounded-xl shadow-lg border border-black/10"
              >
                <h3 className="text-lg font-semibold text-black mb-4">Developer</h3>
                <div className="space-y-2">
                  <p className="font-medium text-black">{project.developerContact.name}</p>
                  <p className="text-gray-600 text-sm">{project.developerContact.email}</p>
                </div>
              </motion.div>

              {/* Project Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg border border-black/10"
              >
                <h3 className="text-lg font-semibold text-black mb-4">Project Stats</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-orange-500 font-bold text-lg">{project.views}</div>
                    <div className="text-gray-600 text-xs">Views</div>
                  </div>
                  <div>
                    <div className="text-red-500 font-bold text-lg">{project.favorites}</div>
                    <div className="text-gray-600 text-xs">Favorites</div>
                  </div>
                  <div>
                    <div className="text-green-500 font-bold text-lg">{project.inquiries}</div>
                    <div className="text-gray-600 text-xs">Inquiries</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Property News Section */}
      <section id="news" className="py-16 bg-white relative overflow-hidden">
        

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block bg-orange-500/10 text-orange-600 px-4 py-2 rounded-full mb-4"
            >
              <span className="font-medium">STAY UPDATED</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-black mb-6"
            >
              Latest Real Estate News
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-lg text-black/70 max-w-3xl mx-auto"
            >
              Stay informed about the latest trends, policies, and developments
              in the real estate market
            </motion.p>
          </div>

          {/* Dynamic Property News Component */}
          <PropertyNewsWhiteSection />
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 bg-orange-50 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-black mb-6"
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-black/70"
            >
              Get answers to common questions about this project and the buying process
            </motion.p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "What documents will I need to purchase a unit in this project?",
                answer:
                  "You'll need identity proof (Aadhar, PAN), address proof, income proof such as salary slips or ITR, bank statements for the last 6 months, and passport-sized photographs. For loan applications, additional documents may be required by the bank.",
              },
              {
                question: "Are there any additional costs beyond the listed price?",
                answer:
                  "Yes, you should budget for stamp duty (typically 5-7% of property value), registration charges (approximately 1%), GST (if applicable), maintenance deposit, legal fees, and loan processing fees if you're financing the purchase.",
              },
              {
                question: "What are the possession timelines for this project?",
                answer:
                  `The possession date for this project is ${new Date(project.possessionDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}. However, it's advisable to check with the developer for the latest updates on construction progress.`,
              },
              {
                question: "What amenities are included in the project?",
                answer:
                  `This project offers ${project.projectAmenities?.length || 0} amenities including ${project.projectAmenities?.slice(0, 3).join(', ') || 'modern facilities'} and many more. The amenities are designed to provide a comfortable and luxurious lifestyle.`,
              },
              {
                question: "Is the project RERA registered?",
                answer:
                  `Yes, this project is RERA registered with registration number ${project.reraRegistrationNo}. This ensures transparency and accountability in the project development and sales process.`,
              },
            ].map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Image Overlay */}
      <AnimatePresence>
        {showImageOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={closeImageOverlay}
          >
            {/* Close Button */}
            <button
              onClick={closeImageOverlay}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <FaTimes className="text-2xl" />
            </button>

            {/* Navigation Buttons */}
            {(() => {
              const allImages = [
                ...(project.projectImages || []),
                ...(project.floorPlans || [])
              ];
              return allImages.length > 1 ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage('prev');
                    }}
                    className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
                  >
                    <FaChevronLeft className="text-3xl" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage('next');
                    }}
                    className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
                  >
                    <FaChevronRight className="text-3xl" />
                  </button>
                </>
              ) : null;
            })()}

            {/* Image */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const allImages = [
                  ...(project.projectImages || []),
                  ...(project.floorPlans || [])
                ];
                const currentImage = overlayImageIndex !== null ? allImages[overlayImageIndex] : null;
                
                return (
                  <>
                    <Image
                      src={currentImage || "/placeholder-project.jpg"}
                      alt={`${project.projectName} - Image ${(overlayImageIndex || 0) + 1}`}
                      width={1200}
                      height={800}
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                    
                    {/* Image Counter */}
                    {allImages.length > 1 && overlayImageIndex !== null && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {overlayImageIndex + 1} / {allImages.length}
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
};

export default ProjectDetailPage;