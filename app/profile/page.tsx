"use client";
import Image from "next/image";
import type React from "react";

import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ClientOnly from "../components/ClientOnly";
import dynamic from "next/dynamic";

// Dynamically import problematic components to avoid SSR issues
const Tabs = dynamic(() => import("@/components/ui/tabs").then(mod => ({ default: mod.Tabs })), { ssr: false });
const TabsContent = dynamic(() => import("@/components/ui/tabs").then(mod => ({ default: mod.TabsContent })), { ssr: false });
const TabsList = dynamic(() => import("@/components/ui/tabs").then(mod => ({ default: mod.TabsList })), { ssr: false });
const TabsTrigger = dynamic(() => import("@/components/ui/tabs").then(mod => ({ default: mod.TabsTrigger })), { ssr: false });
const Avatar = dynamic(() => import("@/components/ui/avatar").then(mod => ({ default: mod.Avatar })), { ssr: false });
const AvatarFallback = dynamic(() => import("@/components/ui/avatar").then(mod => ({ default: mod.AvatarFallback })), { ssr: false });
const AvatarImage = dynamic(() => import("@/components/ui/avatar").then(mod => ({ default: mod.AvatarImage })), { ssr: false });
import {
  Edit,
  LogOut,
  MapPin,
  Phone,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Building,
  Calendar,
  Award,
  Globe,
  User,
  Home,
  Briefcase,
} from "lucide-react";
import { useState, useEffect } from "react";
import { UserAPI } from "../lib/api-helpers";
import { useRouter } from "next/navigation";

import axios from "axios";
import { toast } from "sonner";

interface Property {
  _id: string;
  title: string;
  images: string[];
  description: string;
  price: number;
  listingType: string;
  verified: boolean;
  owner?: {
    name: string;
    email: string;
    phone?: string;
  };
}

interface UserProfileData {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  bio?: string;
  isAgent?: boolean;
  agentInfo?: {
    licenseNumber?: string;
    agency?: string;
    experience?: number;
    specializations?: string[];
    languages?: string[];
    rating?: number;
    reviewCount?: number;
    verified?: boolean;
    listings?: number;
    sales?: number;
  };
  isBuilder?: boolean;
  builderInfo?: {
    companyName?: string;
    licenseNumber?: string;
    reraId?: string;
    established?: Date;
    experience?: number;
    specializations?: string[];
    completedProjects?: number;
    ongoingProjects?: number;
    rating?: number;
    reviewCount?: number;
    verified?: boolean;
    projects?: string[];
  };
  properties?: Property[];
  lastActive?: string;
}

export default function UserProfile() {
  const router = useRouter();

  // State for user data
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // State for properties
  const [properties, setProperties] = useState<Property[]>([]);
  const [isPropertiesLoading, setIsPropertiesLoading] = useState(true);
  const [assignedProperties, setAssignedProperties] = useState<Property[]>([]);
  const [isAssignedPropertiesLoading, setIsAssignedPropertiesLoading] =
    useState(true);

  const [isDeletePropertyModalOpen, setIsDeletePropertyModalOpen] =
    useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(
    null,
  );
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Only run this on the client side
    if (typeof window !== "undefined") {
      const authToken = sessionStorage.getItem("authToken") || document.cookie.split(";").find((cookie) => cookie.startsWith("authToken="))?.split("=")[1];
      if (authToken) {
        setToken(authToken);
      }
    }
  }, []);
  // Form state for profile editing
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        // Check for authentication token in multiple locations
        const token = 
          sessionStorage.getItem("authToken") || 
          document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1] ||
          localStorage.getItem("authToken");
      
        if (!token) {
          setError("Please log in to access your profile.");
          toast.error("Please log in to access your profile.");
          
          // Redirect to home page with auth modal
          setTimeout(() => {
            router.push("/?modal=auth");
          }, 2000);
          
          setLoading(false);
          return;
        }

        // Store token for other API calls
        setToken(token);

        // Attempt to fetch user profile
        const data = await UserAPI.getProfile();
        
        if (!data || !data._id) {
          throw new Error("Invalid user data received");
        }
        
        setUser(data);
        
        if (data.isAgent) {
          // Fetch assigned properties if user is an agent
          try {
            const response = await axios.get("/api/properties/assigned", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.data.success) {
              setAssignedProperties(response.data.properties);
            }
          } catch (_agentErr) {

            // Don't fail the whole page for agent properties
          }
        }
        
        if (data.isBuilder) {
          // Fetch builder projects
          try {
            const response = await axios.get("/api/users/projects", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.data.success) {
              setProjects(response.data.projects);
            }
          } catch (_builderErr) {
            console.error("Failed to fetch builder projects:", _builderErr);
            // Don't fail the whole page for builder projects
          }
        }
        
        // Initialize form data with user values
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          street: data.address?.street || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          zipCode: data.address?.zipCode || "",
          country: data.address?.country || "India",
        });

        setError("");
      } catch (err: any) {

        // Handle specific error cases
        if (err.message?.includes("401") || err.message?.includes("Authentication")) {
          setError("Your session has expired. Please log in again.");
          toast.error("Session expired. Redirecting to login...");
          
          // Clear invalid token
          sessionStorage.removeItem("authToken");
          localStorage.removeItem("authToken");
          document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          
          setTimeout(() => {
            router.push("/?modal=auth");
          }, 2000);
        } else {
          setError("Failed to load user profile. Please try again later.");
          toast.error("Failed to load profile. Please try again.");
        }
      } finally {
        setLoading(false);
        setIsAssignedPropertiesLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Fetch user properties
  useEffect(() => {
    const fetchUserProperties = async () => {
      setIsPropertiesLoading(true);
      try {
        // Fetch user properties from API
        const response = await axios.get("/api/properties/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setProperties(response.data.properties);
        } else {
          throw new Error(response.data.error || "Failed to fetch properties");
        }
      } catch (_err) {

        // Keep using placeholder data in case of error
        toast.error("Failed to load properties. Please try again later.");
      } finally {
        setIsPropertiesLoading(false);
      }
    };

    // Only fetch properties if user is logged in
    if (!loading && user) {
      fetchUserProperties();
    }
  }, [loading, user, token]);

  const openAddPropertyModal = () => {
    // Redirect to the property creation page
    router.push("/sell");
  };

  const openDeletePropertyModal = (property: Property) => {
    setPropertyToDelete(property);
    setIsDeletePropertyModalOpen(true);
  };

  const closeDeletePropertyModal = () => {
    setPropertyToDelete(null);
    setIsDeletePropertyModalOpen(false);
  };

  const openEditProfileModal = () => setIsEditProfileModalOpen(true);
  const closeEditProfileModal = () => setIsEditProfileModalOpen(false);

  const handleInputChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = _e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDeleteProperty = async () => {
    if (!propertyToDelete || !propertyToDelete._id) {
      toast.error("Invalid property ID");
      return;
    }

    setIsDeleteLoading(true);
    try {
      // Call API to delete the property
      const response = await axios.delete(
        `/api/properties/${propertyToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Remove the property from the local state
        setProperties((prev) =>
          prev.filter((p) => p._id !== propertyToDelete._id),
        );

        toast.success("Property deleted successfully");

        closeDeletePropertyModal();
      } else {
        throw new Error(response.data.error || "Failed to delete property");
      }
    } catch (_err) {

      toast.error("Failed to delete property. Please try again.");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleEditProperty = (propertyId: string) => {
    // Navigate to the property edit page
    router.push(`/edit-property/${propertyId}`);
  };

  const handleEditProfile = async () => {
    try {
      // Prepare the update data with nested address
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country || "India",
        },
      };

      // Call the API to update the profile
      const response = await UserAPI.updateProfile(updateData);

      if (response.success) {
        // Update the local user state with new data
        if (user) {
          setUser({
            ...user,
            name: formData.name,
            phone: formData.phone,
            bio: formData.bio,
            address: {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country || "India",
            },
          });
        }

        // Show success message
        toast.success("Profile updated successfully");

        // Close the modal
        closeEditProfileModal();
      }
    } catch (_error) {

      toast.error("Failed to update profile. Please try again.");
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Render loading state if data is being fetched
  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="relative w-24 h-24">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-orange-500/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-500 font-bold">
              <User className="w-8 h-8" />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // If there's an error or no user data, show a message
  if (error || !user) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-[80vh] px-4">
          <div className="bg-red-500/10 p-8 rounded-xl border border-red-500/20 mb-6 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-xl text-red-500 font-medium mb-2">
              {error || "Failed to load user profile"}
            </p>
            <p className="text-gray-400 text-sm">
              Please log in to access your profile and manage your properties.
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/?modal=auth")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2"
            >
              Login / Sign Up
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 px-6 py-2"
            >
              Try Again
            </Button>
          </div>
          
          {/* Quick demo access for testing */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-3">
              For testing purposes, you can create a demo account:
            </p>
            <Button
              onClick={() => {
                // Create demo account credentials
                const demoEmail = "demo@100gaj.com";
                const demoPassword = "demo123";
                
                // Show instructions
                toast.info(`Demo credentials: Email: ${demoEmail}, Password: ${demoPassword}`, {
                  duration: 5000,
                });
                
                // Redirect to auth modal
                router.push("/?modal=auth");
              }}
              variant="outline"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 text-sm px-4 py-1"
            >
              Get Demo Credentials
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.avif"
            alt="Luxury real estate"
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black/70 z-10"></div>

          {/* Animated Patterns */}
          <div className="absolute inset-0 z-5 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <pattern
                  id="grid"
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 8 0 L 0 0 0 8"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <Avatar className="w-32 h-32 border-4 border-orange-500 shadow-lg shadow-orange-500/20">
                  <AvatarImage
                    src={user.image || "/avatar.jpg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="text-4xl font-bold text-white bg-gradient-to-br from-orange-500 to-orange-700">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-center"
              >
                <h1 className="text-5xl md:text-6xl font-bold mb-2">
                  <span className="text-white">{user.name.split(" ")[0]}</span>
                  <span className="text-orange-500">
                    {" "}
                    {user.name.split(" ").slice(1).join(" ")}
                  </span>
                </h1>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 px-3 py-1">
                    {user.isAgent ? "Agent" : user.role}
                  </Badge>
                  {user.isAgent && user.agentInfo?.verified && (
                    <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1">
                      <CheckCircle className="w-3 h-3 mr-1" /> Verified
                    </Badge>
                  )}
                </div>

                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  {user.bio ||
                    "Welcome to your personalized real estate dashboard."}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Animated scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M12 19L19 12M12 19L5 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </section>

      {/* Stats Section */}
      {user.isAgent && user.agentInfo && (
        <section className="py-12 bg-gradient-to-b from-black to-gray-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-6xl mx-auto"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <motion.div
                  variants={fadeIn}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center"
                >
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">
                    {user.agentInfo.listings || 0}
                  </h3>
                  <p className="text-gray-400">Active Listings</p>
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center"
                >
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Home className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">
                    {user.agentInfo.sales || 0}
                  </h3>
                  <p className="text-gray-400">Properties Sold</p>
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center"
                >
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">
                    {user.agentInfo.rating || 0}
                  </h3>
                  <p className="text-gray-400">Average Rating</p>
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center"
                >
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">
                    {user.agentInfo.experience || 0}
                  </h3>
                  <p className="text-gray-400">Years Experience</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Tabs Section */}
      <section className="py-16 bg-black" id="tabs-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeIn} className="text-center mb-12">
              <div className="inline-block bg-orange-500/10 px-6 py-2 rounded-full mb-4">
                <span className="text-orange-500 font-medium tracking-wider">
                  DASHBOARD
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Manage Your <span className="text-orange-500">Real Estate</span>{" "}
                Portfolio
              </h2>
            </motion.div>

            <motion.div variants={fadeIn}>
              <ClientOnly fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              }>
                <Tabs defaultValue="details" className="w-full">
                <div className="relative mb-8">
                  <div className="absolute h-0.5 bottom-0 left-0 right-0 bg-gray-800"></div>
                  <TabsList className="relative z-10 bg-transparent border-b border-transparent h-auto p-0 gap-2">
                    <TabsTrigger
                      value="details"
                      className="text-gray-400 data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 bg-transparent py-3 px-4 rounded-none transition-all"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile Details
                    </TabsTrigger>
                    <TabsTrigger
                      value="properties"
                      className="text-gray-400 data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 bg-transparent py-3 px-4 rounded-none transition-all"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      My Properties
                    </TabsTrigger>
                    {user?.isAgent && (
                      <TabsTrigger
                        value="assigned"
                        className="text-gray-400 data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 bg-transparent py-3 px-4 rounded-none transition-all"
                      >
                        <Briefcase className="w-4 h-4 mr-2" />
                        Assigned Properties
                      </TabsTrigger>
                    )}
                    {user?.isBuilder && (
                      <TabsTrigger
                        value="projects"
                        className="text-gray-400 data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 bg-transparent py-3 px-4 rounded-none transition-all"
                      >
                        <Building className="w-4 h-4 mr-2" />
                        My Projects
                      </TabsTrigger>
                    )}
                  </TabsList>
                </div>

                <TabsContent value="details" className="mt-0">
                  <Card className="overflow-hidden border-0 bg-gradient-to-br from-gray-900 to-gray-950 shadow-xl shadow-orange-500/5">
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                        {/* Contact Information */}
                        <div className="p-8 bg-gray-900/50 border-r border-gray-800">
                          <h3 className="text-xl font-semibold text-orange-500 mb-6 flex items-center">
                            <User className="w-5 h-5 mr-2" /> Contact
                            Information
                          </h3>

                          <div className="space-y-6">
                            <div>
                              <p className="text-gray-400 text-sm mb-1">
                                Email
                              </p>
                              <p className="text-white font-medium">
                                {user.email}
                              </p>
                            </div>

                            {user.phone && (
                              <div>
                                <p className="text-gray-400 text-sm mb-1">
                                  Phone
                                </p>
                                <div className="flex items-center">
                                  <Phone className="w-4 h-4 mr-2 text-orange-500" />
                                  <p className="text-white font-medium">
                                    {user.phone}
                                  </p>
                                </div>
                              </div>
                            )}

                            {(user.address?.city || user.address?.state) && (
                              <div>
                                <p className="text-gray-400 text-sm mb-1">
                                  Location
                                </p>
                                <div className="flex items-start">
                                  <MapPin className="w-4 h-4 mr-2 text-orange-500 mt-1" />
                                  <p className="text-white font-medium">
                                    {[
                                      user.address?.street,
                                      user.address?.city,
                                      user.address?.state,
                                      user.address?.zipCode,
                                      user.address?.country,
                                    ]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="pt-4">
                              <Button
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2"
                                onClick={openEditProfileModal}
                              >
                                <Edit className="w-4 h-4" /> Edit Profile
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Agent Information */}
                        <div className="p-8">
                          <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-semibold text-orange-500 flex items-center">
                              {user.isAgent ? (
                                <>
                                  <Award className="w-5 h-5 mr-2" /> Agent
                                  Profile
                                </>
                              ) : (
                                <>
                                  <User className="w-5 h-5 mr-2" /> User Profile
                                </>
                              )}
                            </h3>

                            <Button
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white gap-2"
                            >
                              <LogOut className="w-4 h-4" /> Logout
                            </Button>
                          </div>

                          {user.bio && (
                            <div className="mb-8">
                              <p className="text-gray-400 text-sm mb-2">
                                About
                              </p>
                              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 italic text-gray-300">
                                `&quot;`{user.bio}`&quot;`
                              </div>
                            </div>
                          )}

                          {user.isAgent && user.agentInfo && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {user.agentInfo.agency && (
                                  <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                                    <div className="flex items-center mb-2">
                                      <Building className="w-4 h-4 text-orange-500 mr-2" />
                                      <p className="text-gray-400 text-sm">
                                        Agency
                                      </p>
                                    </div>
                                    <p className="text-white font-medium">
                                      {user.agentInfo.agency}
                                    </p>
                                  </div>
                                )}

                                {user.agentInfo.licenseNumber && (
                                  <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                                    <div className="flex items-center mb-2">
                                      <Award className="w-4 h-4 text-orange-500 mr-2" />
                                      <p className="text-gray-400 text-sm">
                                        License
                                      </p>
                                    </div>
                                    <p className="text-white font-medium">
                                      {user.agentInfo.licenseNumber}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {user.agentInfo.specializations &&
                                user.agentInfo.specializations.length > 0 && (
                                  <div>
                                    <p className="text-gray-400 text-sm mb-3">
                                      Specializations
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {user.agentInfo.specializations.map(
                                        (spec, index) => (
                                          <Badge
                                            key={index}
                                            className="bg-orange-500/10 text-orange-400 border border-orange-500/30"
                                          >
                                            {spec}
                                          </Badge>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                              {user.agentInfo.languages &&
                                user.agentInfo.languages.length > 0 && (
                                  <div>
                                    <p className="text-gray-400 text-sm mb-3">
                                      Languages
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {user.agentInfo.languages.map(
                                        (lang, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center bg-gray-800/50 rounded-full px-3 py-1"
                                          >
                                            <Globe className="w-3 h-3 text-orange-500 mr-2" />
                                            <span className="text-sm">
                                              {lang}
                                            </span>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="properties" className="mt-0">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 to-gray-950">
                    <CardHeader className="pb-0">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h3 className="text-2xl font-semibold text-orange-500 flex items-center">
                          <Home className="w-5 h-5 mr-2" /> Your Properties
                        </h3>
                        <Button
                          onClick={openAddPropertyModal}
                          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white gap-2 shadow-lg shadow-orange-500/20"
                        >
                          <Plus className="w-4 h-4" /> Add Property
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {isPropertiesLoading ? (
                        <div className="flex justify-center py-12">
                          <div className="relative w-16 h-16">
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-orange-500/20 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
                          </div>
                        </div>
                      ) : properties.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 max-w-md mx-auto">
                            <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Home className="w-8 h-8 text-orange-500" />
                            </div>
                            <h4 className="text-xl font-medium text-white mb-2">
                              No properties found
                            </h4>
                            <p className="text-gray-400 mb-6">
                              You haven&apos;t listed any properties yet.
                            </p>
                            <Button
                              onClick={openAddPropertyModal}
                              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white gap-2 mr-2"
                            >
                              <Plus className="w-4 h-4" /> List your first
                              property
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {properties.map((property) => (
                            <motion.div
                              key={property._id}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4 }}
                              viewport={{ once: true }}
                              className="group"
                            >
                              <Card className="overflow-hidden h-full border-0 bg-gray-900 group-hover:shadow-lg group-hover:shadow-orange-500/10 transition-all duration-300">
                                <div className="relative h-48">
                                  <Image
                                    src={
                                      property.images?.[0] || "/placeholder.svg"
                                    }
                                    alt={property.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                  <div className="absolute top-2 right-2 flex gap-2">
                                    <Badge
                                      className={
                                        property.verified
                                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                                      }
                                    >
                                      {property.verified ? (
                                        <span className="flex items-center gap-1">
                                          <CheckCircle className="w-3 h-3" />{" "}
                                          Verified
                                        </span>
                                      ) : (
                                        <span className="flex items-center gap-1">
                                          <XCircle className="w-3 h-3" /> Not
                                          Verified
                                        </span>
                                      )}
                                    </Badge>
                                  </div>
                                  <div className="absolute bottom-2 left-2">
                                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
                                      {property.listingType === "sale"
                                        ? "For Sale"
                                        : "For Rent"}
                                    </Badge>
                                  </div>
                                </div>
                                <CardContent className="p-6">
                                  <div className="mb-4">
                                    <h4 className="text-xl font-semibold text-orange-500 mb-2 group-hover:text-orange-400 transition-colors">
                                      {property.title}
                                    </h4>
                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                      {property.description}
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                      ₹ {property.price?.toLocaleString() || 0}
                                    </p>
                                  </div>
                                  <div className="flex justify-between items-center pt-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
                                      onClick={() =>
                                        handleEditProperty(property._id)
                                      }
                                    >
                                      <Edit className="w-3 h-3 mr-1" /> Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors gap-1"
                                      onClick={() =>
                                        openDeletePropertyModal(property)
                                      }
                                    >
                                      <Trash2 className="w-3 h-3" /> Remove
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {user?.isAgent && (
                  <TabsContent value="assigned" className="mt-0">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 to-gray-950">
                      <CardHeader className="pb-0">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                          <h3 className="text-2xl font-semibold text-orange-500 flex items-center">
                            <Briefcase className="w-5 h-5 mr-2" /> Assigned
                            Properties
                          </h3>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {isAssignedPropertiesLoading ? (
                          <div className="flex justify-center py-12">
                            <div className="relative w-16 h-16">
                              <div className="absolute top-0 left-0 w-full h-full border-4 border-orange-500/20 rounded-full"></div>
                              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
                            </div>
                          </div>
                        ) : assignedProperties.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 max-w-md mx-auto">
                              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="w-8 h-8 text-orange-500" />
                              </div>
                              <h4 className="text-xl font-medium text-white mb-2">
                                No assigned properties
                              </h4>
                              <p className="text-gray-400 mb-6">
                                You haven&apos;t been assigned any properties
                                yet.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {assignedProperties.map((property) => (
                              <motion.div
                                key={property._id}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                viewport={{ once: true }}
                                className="group"
                              >
                                <Card className="overflow-hidden h-full border-0 bg-gray-900 group-hover:shadow-lg group-hover:shadow-orange-500/10 transition-all duration-300">
                                  <div className="relative h-48">
                                    <Image
                                      src={
                                        property.images?.[0] ||
                                        "/placeholder.svg"
                                      }
                                      alt={property.title}
                                      fill
                                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    <div className="absolute top-2 right-2">
                                      <Badge
                                        className={
                                          property.verified
                                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                                        }
                                      >
                                        {property.verified ? (
                                          <span className="flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />{" "}
                                            Verified
                                          </span>
                                        ) : (
                                          <span className="flex items-center gap-1">
                                            <XCircle className="w-3 h-3" /> Not
                                            Verified
                                          </span>
                                        )}
                                      </Badge>
                                    </div>
                                    <div className="absolute bottom-2 left-2">
                                      <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
                                        {property.listingType}
                                      </Badge>
                                    </div>
                                  </div>
                                  <CardContent className="p-6">
                                    <div className="mb-4">
                                      <h4 className="text-xl font-semibold text-orange-500 mb-2 group-hover:text-orange-400 transition-colors">
                                        {property.title}
                                      </h4>
                                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                        {property.description}
                                      </p>
                                      <p className="text-2xl font-bold text-white">
                                        ₹ {property.price.toLocaleString()}
                                      </p>
                                      {property.owner && (
                                        <div className="mt-3 flex items-center">
                                          <Avatar className="w-6 h-6 mr-2 border border-orange-500">
                                            <AvatarFallback className="bg-orange-500/20 text-orange-500 text-xs">
                                              {property.owner.name.charAt(0)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <p className="text-gray-300 text-sm">
                                            Owner:{" "}
                                            <span className="text-orange-400">
                                              {property.owner.name}
                                            </span>
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                {/* Builder Projects Tab */}
                {user?.isBuilder && (
                  <TabsContent value="projects" className="mt-0">
                    <Card className="border-0 bg-gradient-to-br from-gray-900 to-gray-950 shadow-xl shadow-orange-500/5">
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-2xl font-bold text-white">My Projects</h3>
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                            {projects.length} Projects
                          </Badge>
                        </div>

                        {projectsLoading ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                            <p className="text-gray-400 mt-2">Loading projects...</p>
                          </div>
                        ) : projects.length === 0 ? (
                          <div className="text-center py-12">
                            <Building className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h4 className="text-xl font-semibold text-gray-400 mb-2">No Projects Yet</h4>
                            <p className="text-gray-500 mb-6">Start by posting your first project</p>
                            <Button 
                              onClick={() => router.push('/sell')}
                              className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Post New Project
                            </Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                              <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden hover:border-orange-500/30 transition-all duration-300"
                              >
                                {project.projectImages && project.projectImages.length > 0 && (
                                  <div className="relative h-48 w-full">
                                    <Image
                                      src={project.projectImages[0]}
                                      alt={project.projectName}
                                      fill
                                      className="object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                      <Badge 
                                        className={`${
                                          project.status === 'approved' 
                                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                            : project.status === 'pending'
                                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                                        }`}
                                      >
                                        {project.status}
                                      </Badge>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="p-4">
                                  <h4 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                                    {project.projectName}
                                  </h4>
                                  <p className="text-sm text-gray-400 mb-2">
                                    <MapPin className="w-3 h-3 inline mr-1" />
                                    {project.locality}, {project.city}
                                  </p>
                                  <p className="text-sm text-gray-400 mb-2">
                                    <Calendar className="w-3 h-3 inline mr-1" />
                                    {project.projectType} • {project.projectStage}
                                  </p>
                                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                    {project.developerDescription}
                                  </p>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                                      <span>{project.views || 0} views</span>
                                      <span>•</span>
                                      <span>{project.inquiries || 0} inquiries</span>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                                        onClick={() => router.push(`/projects/${project._id}`)}
                                      >
                                        View
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
              </ClientOnly>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Delete Property Modal */}
      {isDeletePropertyModalOpen && propertyToDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={closeDeletePropertyModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden relative w-full max-w-md p-6 border border-gray-800"
            onClick={(_e) => _e.stopPropagation()}
          >
            <button
              onClick={closeDeletePropertyModal}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-300 transition-colors"
              disabled={isDeleteLoading}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Delete Property
              </h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete the property `&quot;`
                <span className="text-orange-500">
                  {propertyToDelete.title}
                </span>
                `&quot;`?
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white gap-2"
                  onClick={handleDeleteProperty}
                  disabled={isDeleteLoading}
                >
                  {isDeleteLoading ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" /> Delete
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  onClick={closeDeletePropertyModal}
                  disabled={isDeleteLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={closeEditProfileModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900 rounded-2xl shadow-xl overflow-auto relative w-full max-w-md p-6 h-[80vh] border border-gray-800"
            onClick={(_e) => _e.stopPropagation()}
          >
            <button
              onClick={closeEditProfileModal}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="p-4">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Edit className="w-8 h-8 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Update your personal information
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent opacity-70 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Email cannot be changed
                  </p>
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your contact number"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    About
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Enter details about yourself"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white resize-none h-24"
                  ></textarea>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <h3 className="text-white text-md font-medium mb-4 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-orange-500" /> Address
                    Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 text-sm font-medium mb-2 block">
                        Street
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        placeholder="Enter street address"
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-300 text-sm font-medium mb-2 block">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Enter city"
                          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 text-sm font-medium mb-2 block">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="Enter state"
                          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-300 text-sm font-medium mb-2 block">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          placeholder="Enter zip code"
                          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 text-sm font-medium mb-2 block">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          placeholder="Enter country"
                          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-orange-500/20"
                  onClick={handleEditProfile}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </main>
  );
}
