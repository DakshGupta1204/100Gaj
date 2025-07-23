"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { SparklesCore } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/button";
import { Upload, Users, CheckCircle, ArrowRight, Shield, TrendingUp, Building2, PieChart, BarChart3, Handshake, } from "lucide-react";
import EquityNavigation from "../components/EquityNavigation";
import BackgroundVideo from "../components/BackgroundVideo";
import EquityAnimatedBackground from "../EquityAnimatedBackground";
// Temporarily comment out these imports until we create the components
// import PropertyForm from "@/components/ui/propertyform";
// import EnhancedPropertyForm from "@/components/ui/EnhancedPropertyForm";
// import BuilderProjectForm from "@/components/ui/BuilderProjectForm";
// import UserTypeModal from "@/components/ui/UserTypeModal";
export default function PostPropertyPage() {
    const router = useRouter();
    const [isKYCCompleted, setIsKYCCompleted] = useState(false);
    const [isUserTypeModalOpen, setIsUserTypeModalOpen] = useState(false);
    const [isPropertyFormOpen, setIsPropertyFormOpen] = useState(false);
    const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [isLoadingUserProfile, setIsLoadingUserProfile] = useState(false);
    const [profileLoadError, setProfileLoadError] = useState(false);
    useEffect(() => {
        // Check if user is authenticated
        const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
        if (!isAuthenticated) {
            router.push("/equity/auth?callbackUrl=" + encodeURIComponent("/equity/postproperty"));
            return;
        }
        // Check KYC status (this would typically come from your API)
        const kycStatus = localStorage.getItem("kycStatus");
        setIsKYCCompleted(kycStatus === "completed");
    }, []);
    const stats = [
        {
            title: "Average Investment Returns",
            value: "15%",
            unit: "Annual",
            color: "bg-gradient-to-r from-[#a78bfa]/20 to-[#a78bfa]/10",
            icon: <TrendingUp className="w-8 h-8 text-[#a78bfa]"/>,
        },
        {
            title: "Active Investors",
            value: "5K+",
            unit: "Growing",
            color: "bg-gradient-to-r from-white/10 to-white/5",
            icon: <Users className="w-8 h-8 text-white"/>,
        },
    ];
    const steps = [
        {
            title: "List Your Investment Property",
            description: "Add property details, investment terms, and expected returns",
            icon: <Building2 className="w-6 h-6"/>,
            color: "from-[#a78bfa] to-[#9333ea]",
        },
        {
            title: "Set Investment Structure",
            description: "Define investment units, minimum investment, and equity sharing terms",
            icon: <PieChart className="w-6 h-6"/>,
            color: "from-white to-gray-200",
        },
        {
            title: "Get Verified",
            description: "Our team validates property details and investment terms",
            icon: <CheckCircle className="w-6 h-6"/>,
            color: "from-[#a78bfa] to-[#9333ea]",
        },
        {
            title: "Connect with Investors",
            description: "Engage with qualified investors and close deals",
            icon: <Handshake className="w-6 h-6"/>,
            color: "from-white to-gray-200",
        },
    ];
    const benefits = [
        {
            title: "Fractional Ownership",
            description: "Enable multiple investors to own shares in your property",
            icon: <PieChart className="w-10 h-10 text-[#a78bfa]"/>,
        },
        {
            title: "Verified Investors",
            description: "Connect with serious, accredited investors only",
            icon: <Shield className="w-10 h-10 text-white"/>,
        },
        {
            title: "Investment Structure",
            description: "Flexible equity sharing and investment terms",
            icon: <BarChart3 className="w-10 h-10 text-[#a78bfa]"/>,
        },
    ];
    const handleOpenForm = () => {
        if (!isKYCCompleted) {
            router.push("/equity/kyc");
            return;
        }
        setIsUserTypeModalOpen(true);
    };
    // Temporarily disable form modals
    const handleUserTypeSelect = (type) => {
        setIsUserTypeModalOpen(false);
        toast.info("Property submission form coming soon...");
    };
    return (<div className="min-h-screen bg-black">
      {/* Background Effects */}
      <BackgroundVideo />
      <EquityAnimatedBackground />
      
      {/* Navigation */}
      <EquityNavigation />

      {/* Temporarily comment out modals */}
      {/* <UserTypeModal
          isOpen={isUserTypeModalOpen}
          onClose={() => setIsUserTypeModalOpen(false)}
          onSelectUserType={handleUserTypeSelect}
          userProfile={userProfile}
        />
  
        {isPropertyFormOpen && (
          <EnhancedPropertyForm
            onClose={() => setIsPropertyFormOpen(false)}
            onSubmit={() => {}}
          />
        )}
  
        {isProjectFormOpen && (
          <BuilderProjectForm
            onClose={() => setIsProjectFormOpen(false)}
            onSubmit={() => {}}
          />
        )} */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 h-full">
          <SparklesCore id="tsparticlesfullpage" background="transparent" minSize={0.6} maxSize={1.4} particleDensity={100} className="w-full h-full" particleColor="#a78bfa"/>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#a78bfa] to-white mb-6">
              List Your Investment <span className="text-white">Property</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Connect with qualified investors and raise capital through fractional ownership. Transform your property into a shared investment opportunity.
            </p>
            
            {/* KYC Status Button */}
            <div className="flex justify-center gap-4">
              {!isKYCCompleted ? (<Button onClick={() => router.push("/equity/kyc")} className="bg-gradient-to-r from-[#a78bfa] to-[#9333ea] hover:from-[#9333ea] hover:to-[#a78bfa] text-white px-8 py-6 text-lg rounded-full flex items-center gap-2">
                  <Shield className="w-5 h-5"/>
                  Complete KYC First
                </Button>) : (<div className="flex items-center gap-2 bg-[#14141F]/80 backdrop-blur-xl border border-[#a78bfa]/20 rounded-full px-6 py-3">
                  <CheckCircle className="w-5 h-5 text-green-500"/>
                  <span className="text-green-500">KYC Verified</span>
                </div>)}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
            {stats.map((stat, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }} className={`${stat.color} rounded-2xl p-6 backdrop-blur-sm border border-[#a78bfa]/20`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 mb-2">{stat.title}</p>
                    <h3 className="text-5xl font-bold text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-[#a78bfa]">{stat.unit}</p>
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
      <section className="py-20 px-4 relative bg-gradient-to-b from-black to-[#14141F]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Why List on <span className="text-[#a78bfa]">100Gaj Equity</span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            Transform your property into a fractional ownership investment opportunity and connect with qualified investors
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }} viewport={{ once: true }} className="relative">
                <div className="bg-gradient-to-br from-[#14141F] to-black rounded-2xl p-8 border border-[#a78bfa]/20 h-full shadow-xl">
                  <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center mb-6 border border-[#a78bfa]/30">
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

      {/* How it Works Section */}
      <section className="py-24 px-4 relative overflow-hidden bg-black">
        <div className="absolute right-0 top-10 w-64 h-64 bg-[#a78bfa]/20 rounded-full blur-3xl"></div>
        <div className="absolute left-0 bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              How it <span className="text-[#a78bfa]">Works</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              List your property and structure it for fractional ownership investment in four simple steps
            </p>
          </div>

          <div className="relative">
            {/* Horizontal connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#a78bfa] to-white hidden md:block"></div>

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
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-black rounded-full flex items-center justify-center border-2 border-[#a78bfa]">
                      {step.icon}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#14141F] to-black rounded-xl p-6 text-center h-full border border-[#a78bfa]/20">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{step.description}</p>
                    <div className="flex justify-center">
                      <Button variant="outline" className="border-[#a78bfa]/50 text-[#a78bfa] hover:bg-[#a78bfa]/10">
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-gradient-to-r from-[#a78bfa] to-[#9333ea] rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to List Your Investment Property?
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              {isKYCCompleted
            ? "Join our platform and connect with qualified investors looking for real estate investment opportunities."
            : "Complete your KYC verification to start listing your properties."}
            </p>
            <Button onClick={handleOpenForm} className="bg-white text-[#a78bfa] hover:bg-white/90 px-8 py-6 text-lg">
              {isKYCCompleted ? "List Your Property Now" : "Complete KYC First"}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Sticky Button */}
      {!isPropertyFormOpen && !isProjectFormOpen && !isUserTypeModalOpen && (<div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, type: "spring" }}>
            <Button onClick={handleOpenForm} className="bg-gradient-to-r from-[#a78bfa] to-[#9333ea] hover:from-[#9333ea] hover:to-[#a78bfa] text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg flex items-center gap-2">
              {isKYCCompleted ? (<>
                  <Upload className="w-5 h-5"/>
                  List Property
                </>) : (<>
                  <Shield className="w-5 h-5"/>
                  Complete KYC
                </>)}
            </Button>
          </motion.div>
        </div>)}
    </div>);
}
