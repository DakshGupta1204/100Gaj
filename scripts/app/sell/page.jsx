"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SparklesCore } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/button";
import { Home, Upload, Clock, Users, CheckCircle, PenTool, ArrowRight, Phone, Shield, DollarSign, } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { toast } from "sonner";
import EnhancedPropertyForm from "../components/ui/EnhancedPropertyForm";
import BuilderProjectForm from "../components/ui/BuilderProjectForm";
import UserTypeModal from "../components/ui/UserTypeModal";
import { useRouter } from "next/navigation";
export default function SellProperty() {
    const router = useRouter();
    const [isUserTypeModalOpen, setIsUserTypeModalOpen] = useState(false);
    const [isPropertyFormOpen, setIsPropertyFormOpen] = useState(false);
    const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [isLoadingUserProfile, setIsLoadingUserProfile] = useState(false);
    const [profileLoadError, setProfileLoadError] = useState(false);
    // Fetch user profile when component mounts
    const fetchUserProfile = async () => {
        if (typeof window === "undefined")
            return;
        const token = sessionStorage.getItem("authToken");
        if (!token)
            return;
        setIsLoadingUserProfile(true);
        setProfileLoadError(false);
        try {
            const response = await fetch('/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const profile = await response.json();
                setUserProfile(profile);
            }
            else {
                console.error("Failed to fetch user profile");
                setProfileLoadError(true);
            }
        }
        catch (error) {
            console.error("Error fetching user profile:", error);
            setProfileLoadError(true);
        }
        finally {
            setIsLoadingUserProfile(false);
        }
    };
    useEffect(() => {
        // Check if user is authenticated
        if (typeof window === "undefined")
            return;
        const token = sessionStorage.getItem("authToken");
        setIsAuthenticated(!!token);
        if (token) {
            fetchUserProfile();
        }
    }, []);
    const handleOpenForm = async () => {
        if (!isAuthenticated) {
            // Redirect to login page with callback URL
            toast.message("Please login to sell a property. Redirecting you to the Home Page!");
            setTimeout(() => {
                router.push("/?modal=auth");
            }, 1000);
            return;
        }
        // If userProfile is not loaded yet, fetch it first
        if (!userProfile && !isLoadingUserProfile) {
            toast.message("Loading your profile...");
            await fetchUserProfile();
            // After fetching, if successful, automatically open the modal
            if (!profileLoadError) {
                setTimeout(() => {
                    setIsUserTypeModalOpen(true);
                }, 100);
            }
            return;
        }
        if (isLoadingUserProfile) {
            toast.message("Loading your profile...");
            return;
        }
        if (profileLoadError) {
            toast.error("Failed to load profile. Please try again.");
            await fetchUserProfile();
            return;
        }
        setIsUserTypeModalOpen(true);
    };
    const handleUserTypeSelect = (type) => {
        setIsUserTypeModalOpen(false);
        if (type === 'builder') {
            // Check if user is a verified builder
            if (!userProfile || !userProfile.isBuilder) {
                toast.error("You need to be a verified builder to post projects. Please complete your builder verification first!");
                setTimeout(() => {
                    router.push("/verification");
                }, 1000);
                return;
            }
            setIsProjectFormOpen(true);
        }
        else {
            setIsPropertyFormOpen(true);
        }
    };
    const handlePropertyFormClose = () => {
        setIsPropertyFormOpen(false);
    };
    const handleProjectFormClose = () => {
        setIsProjectFormOpen(false);
    };
    const handlePropertyFormSubmit = async (data) => {
        try {
            // API call to submit property
            const response = await fetch('/api/properties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                toast.success("Property listed successfully!");
                setIsPropertyFormOpen(false);
            }
            else {
                const error = await response.json();
                toast.error(error.message || "Failed to list property");
            }
        }
        catch (error) {
            console.error("Error submitting property:", error);
            toast.error("Failed to submit property. Please try again.");
        }
    };
    const handleProjectFormSubmit = async (data) => {
        try {
            // Debug: Log the data being sent
            console.log("About to submit project data:", data);
            console.log("unitTypes being sent:", data.unitTypes);
            console.log("unitTypes type:", typeof data.unitTypes);
            console.log("unitTypes is array:", Array.isArray(data.unitTypes));
            // API call to submit project
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                toast.success("Project submitted successfully and is pending approval!");
                setIsProjectFormOpen(false);
            }
            else {
                const error = await response.json();
                toast.error(error.message || "Failed to submit project");
            }
        }
        catch (error) {
            console.error("Error submitting project:", error);
            toast.error("Failed to submit project. Please try again.");
        }
    };
    const stats = [
        {
            title: "Property Sold Every",
            value: "30",
            unit: "Minutes",
            color: "bg-gradient-to-r from-orange-500/20 to-orange-400/10",
            icon: <Clock className="w-8 h-8 text-orange-500"/>,
        },
        {
            title: "Active Buyers",
            value: "10K+",
            unit: "Daily",
            color: "bg-gradient-to-r from-white/10 to-white/5",
            icon: <Users className="w-8 h-8 text-white"/>,
        },
    ];
    const steps = [
        {
            title: "Create Your Profile",
            description: "Sign up and complete your profile with your contact information",
            icon: <PenTool className="w-6 h-6"/>,
            image: "/images/step1.png",
            color: "from-orange-400 to-orange-600",
        },
        {
            title: "List Your Property",
            description: "Add property details, photos, amenities, and set your price",
            icon: <Home className="w-6 h-6"/>,
            image: "/images/step2.png",
            color: "from-white to-gray-200",
        },
        {
            title: "Get Verified",
            description: "Our team reviews and verifies your listing for quality assurance",
            icon: <CheckCircle className="w-6 h-6"/>,
            image: "/images/step3.png",
            color: "from-orange-400 to-orange-600",
        },
        {
            title: "Connect with Buyers",
            description: "Receive inquiries and connect directly with interested buyers",
            icon: <Phone className="w-6 h-6"/>,
            image: "/images/step4.png",
            color: "from-white to-gray-200",
        },
    ];
    const benefits = [
        {
            title: "Zero Commission",
            description: "No hidden fees or commissions on your property sale",
            icon: <DollarSign className="w-10 h-10 text-orange-500"/>,
        },
        {
            title: "Verified Buyers",
            description: "Connect with serious, verified buyers only",
            icon: <Shield className="w-10 h-10 text-white"/>,
        },
        {
            title: "Expert Support",
            description: "Get assistance from our real estate experts anytime",
            icon: <Phone className="w-10 h-10 text-orange-500"/>,
        },
    ];
    return (<main className="min-h-screen bg-black">
      <Navbar />

      {/* User Type Selection Modal */}
      <UserTypeModal isOpen={isUserTypeModalOpen} onClose={() => setIsUserTypeModalOpen(false)} onSelectUserType={handleUserTypeSelect} userProfile={userProfile}/>

      {/* Individual Property Form */}
      {isPropertyFormOpen && (<EnhancedPropertyForm onClose={handlePropertyFormClose} onSubmit={handlePropertyFormSubmit}/>)}

      {/* Builder Project Form */}
      {isProjectFormOpen && (<BuilderProjectForm onClose={handleProjectFormClose} onSubmit={handleProjectFormSubmit}/>)}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 h-full">
          <SparklesCore id="tsparticlesfullpage" background="transparent" minSize={0.6} maxSize={1.4} particleDensity={100} className="w-full h-full" particleColor="#FFA500"/>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-white mb-6">
              Post Property for <span className="text-white">FREE</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              List your property and reach thousands of verified buyers and
              tenants. No hidden charges, no complications.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
            {stats.map((stat, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }} className={`${stat.color} rounded-2xl p-6 backdrop-blur-sm border border-white/10`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 mb-2">{stat.title}</p>
                    <h3 className="text-5xl font-bold text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-orange-500">{stat.unit}</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-full">
                    {stat.icon}
                  </div>
                </div>
              </motion.div>))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 relative bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Why Choose <span className="text-orange-500">100Gaj</span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            We make selling or renting properties easier than ever before with
            our powerful platform
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }} viewport={{ once: true }} className="relative">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-white/5 h-full shadow-xl">
                  <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center mb-6 border border-orange-500/30">
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              </motion.div>))}
          </div>
        </div>
      </section>

      {/* How it Works Section - Enhanced */}
      <section className="py-24 px-4 relative overflow-hidden bg-black">
        <div className="absolute right-0 top-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute left-0 bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              How it <span className="text-orange-500">Works</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Follow these simple steps to list your property and start
              connecting with potential buyers
            </p>
          </div>

          <div className="relative">
            {/* Horizontal connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-white hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {steps.map((step, index) => (<motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.15 }} viewport={{ once: true }} className="relative z-10">
                  {/* Step number with pulsing effect */}
                  <div className="relative mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full"></div>
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto shadow-xl border-4 border-black`}>
                      <span className="text-2xl font-bold text-black">
                        {index + 1}
                      </span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-black rounded-full flex items-center justify-center border-2 border-orange-500">
                      {step.icon}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-center h-full border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{step.description}</p>
                    <div className="flex justify-center">
                      <Button variant="outline" className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10">
                        Learn More <ArrowRight className="ml-2 w-4 h-4"/>
                      </Button>
                    </div>
                  </div>
                </motion.div>))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to List Your Property?
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Join thousands of successful property sellers on 100Gaj. Start
              your journey today!
            </p>
            <Button onClick={handleOpenForm} className="bg-white text-orange-500 hover:bg-white/90 px-8 py-6 text-lg">
              List Your Property Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Sticky Button */}
      {!isPropertyFormOpen && !isProjectFormOpen && !isUserTypeModalOpen && (<div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, type: "spring" }}>
          <Button onClick={handleOpenForm} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg flex items-center gap-2">
            <Upload className="w-5 h-5"/>
            Post Now!
          </Button>
        </motion.div>
      </div>)}

      <Footer />
    </main>);
}
