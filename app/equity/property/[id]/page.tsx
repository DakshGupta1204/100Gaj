"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, TrendingUp, Shield, Star, Users, Calendar, DollarSign, Target, Zap, Building2, Eye, Share2, Heart, AlertCircle, CheckCircle, Info, Plus, Minus, ShoppingCart, CreditCard, Briefcase, Warehouse, Store, Server, UserPlus, Coffee } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import BuySharesModal from "@/app/commercial/components/BuySharesModal";
import { CommercialProperty } from "@/app/data/commercialProperties";
import { toast } from "sonner";

interface PropertyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const router = useRouter();
  const [property, setProperty] = useState<CommercialProperty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShares, setSelectedShares] = useState(1);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [propertyId, setPropertyId] = useState<string>('');

  // Resolve params
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setPropertyId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  // Mock data - convert to CommercialProperty format
  const createMockProperty = (id: string): CommercialProperty => ({
    _id: id,
    title: "Cyber Hub Office Complex",
    description: "Premium Grade A office space in Cyber Hub with multinational tenants",
    location: "Gurgaon, Haryana",
    address: {
      street: "DLF Cyber City, Phase 2",
      city: "Gurgaon",
      state: "Haryana",
      zipCode: "122002",
      coordinates: [77.0855, 28.4949],
    },
    images: ["/images/office-complex.jpg", "/canada.jpeg", "/airpirt.jpeg"],
    propertyType: "Office",
    totalArea: 250000,
    builtYear: 2018,
    developer: {
      name: "DLF Limited",
      rating: 4.8,
      projectsCompleted: 250,
    },
    totalPropertyValue: 25000000,
    totalShares: 10000,
    availableShares: 3500,
    pricePerShare: 2500,
    minInvestment: 2500,
    currentROI: 8.5,
    rentalYield: 8.5,
    appreciationRate: 15.2,
    currentOccupancy: 95,
    monthlyRental: 850000,
    spvId: `SPV_${id}`,
    spvName: "Cyber Hub Office SPV",
    status: "active",
    featured: true,
    amenities: [
      "Central AC",
      "High Speed Elevators", 
      "Food Court",
      "Gymnasium",
      "Conference Rooms",
      "Parking"
    ],
    nearbyLandmarks: [
      "Cyber Hub",
      "DLF Mall", 
      "MG Road Metro",
      "Cyber City Metro"
    ],
    documents: [
      {
        name: "Property Title Deed",
        url: "/documents/title-deed.pdf",
        type: "legal",
      },
      {
        name: "Financial Statements", 
        url: "/documents/financial.pdf",
        type: "financial",
      },
    ],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  });

  useEffect(() => {
    // Simulate API call
    if (!propertyId) return;
    
    const timer = setTimeout(() => {
      const mockProperty = createMockProperty(propertyId);
      setProperty(mockProperty);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [propertyId]);

  const handleBuyShares = () => {
    setShowBuyModal(true);
  };

  const handlePurchaseSuccess = () => {
    toast.success("Shares purchased successfully!");
    setShowBuyModal(false);
    // You can add additional success logic here like refreshing data
  };

  const getTotalInvestment = () => {
    if (!property) return 0;
    return selectedShares * property.pricePerShare;
  };

  const getExpectedMonthlyIncome = () => {
    if (!property) return 0;
    return Math.round((getTotalInvestment() * property.currentROI) / 100 / 12);
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "office": return Briefcase;
      case "warehouse": return Warehouse;
      case "retail": return Store;
      case "mixed use": return Server;
      case "industrial": return Coffee;
      default: return Building2;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Property not found</h1>
          <Link href="/equity">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Back to Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const PropertyIcon = getPropertyTypeIcon(property.propertyType);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <PropertyIcon className="w-6 h-6 text-purple-500" />
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-[#a78bfa] to-white bg-clip-text text-transparent">
                  {property.title}
                </h1>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{property.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{property.currentROI}% ROI</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>AI Score: 92/100</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`border-gray-600 ${isFavorite ? 'text-red-400 border-red-400' : 'text-gray-300'} hover:bg-gray-800`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-800">
                <img
                  src={property.images[0] || "/images/placeholder-property.jpg"}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-white text-sm font-semibold">
                      {property.availableShares.toLocaleString()} shares available
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Property Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Property Overview</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {property.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white font-semibold">{property.totalArea.toLocaleString()} sq ft</div>
                  <div className="text-gray-400 text-sm">Total Area</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white font-semibold">{property.builtYear}</div>
                  <div className="text-gray-400 text-sm">Year Built</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white font-semibold">{property.currentOccupancy}%</div>
                  <div className="text-gray-400 text-sm">Occupancy</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white font-semibold">{property.currentROI}%</div>
                  <div className="text-gray-400 text-sm">Annual ROI</div>
                </div>
              </div>
            </motion.div>

            {/* Key Features & Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" style={{ color: '#B6FF3F' }} />
                  Key Features
                </h3>
                <div className="space-y-3">
                  {["Prime Location", "High Occupancy", "A+ Tenants", "Modern Facilities", "24/7 Security", "Backup Power"].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#B6FF3F]" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-500" />
                  Amenities
                </h3>
                <div className="space-y-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#a78bfa]" />
                      <span className="text-gray-300">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Key Tenants */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
            >
              <h3 className="text-lg font-bold text-white mb-4">Key Tenants</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {["Microsoft India", "Accenture", "Deloitte", "EY", "KPMG"].map((tenant, index) => (
                  <div key={index} className="text-center p-4 bg-gray-900 rounded-full shadow-sm border-2 border-[#B6FF3F] transition-colors duration-200 cursor-pointer hover:bg-gray-800">
                    <div className="font-semibold text-lg text-white">{tenant}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Financial Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
            >
              <h3 className="text-lg font-bold text-white mb-4">Financial Analysis</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: '#B6FF3F' }}>₹12L</div>
                  <div className="text-gray-400">Gross Income</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">₹3.5L</div>
                  <div className="text-gray-400">Operating Expenses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">₹8.5L</div>
                  <div className="text-gray-400">Net Income</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: '#a78bfa' }}>3.4%</div>
                  <div className="text-gray-400">Cap Rate</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Investment Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800"
              >
                <h2 className="text-xl font-bold text-white mb-6">Invest in This Property</h2>
                
                {/* Share Information */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Price per Share</span>
                    <span className="text-2xl font-bold text-white">₹{property.pricePerShare.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Available Shares</span>
                    <span className="text-white font-semibold">
                      {property.availableShares.toLocaleString()} / {property.totalShares.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                    <div 
                      className="h-2 rounded-full bg-[#B6FF3F]"
                      style={{ width: `${(property.availableShares / property.totalShares) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400">
                    {((property.availableShares / property.totalShares) * 100).toFixed(1)}% available
                  </div>
                </div>

                {/* Share Selection */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400">Select Shares</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedShares(Math.max(1, selectedShares - 1))}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-lg font-bold text-white px-4">{selectedShares}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedShares(Math.min(property.availableShares, selectedShares + 1))}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Investment</span>
                      <span className="text-xl font-bold text-white">₹{getTotalInvestment().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Expected Monthly Income</span>
                      <span className="text-lg font-semibold" style={{ color: '#B6FF3F' }}>₹{getExpectedMonthlyIncome().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                <Button
                  onClick={handleBuyShares}
                  className="w-full bg-[#d1ff4a] hover:bg-[#b6e944] text-black font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Equity Shares
                </Button>
              </motion.div>

              {/* Market Analysis */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
              >
                <h3 className="text-lg font-bold text-white mb-4">Market Analysis</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Market Growth</span>
                    <span className="font-semibold" style={{ color: '#B6FF3F' }}>+{property.appreciationRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Comparable Properties</span>
                    <span className="text-white font-semibold">12</span>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-2">Market Conditions</div>
                    <div className="text-sm font-semibold" style={{ color: '#B6FF3F' }}>
                      High Demand, Limited Supply
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Property Manager */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
              >
                <h3 className="text-lg font-bold text-white mb-4">Property Management</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-400 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-violet-100" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">CBRE India</div>
                    <div className="text-sm text-gray-400">Professional Management</div>
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  Experienced property management company ensuring optimal operations and tenant satisfaction.
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Shares Modal with Razorpay Integration */}
      <BuySharesModal
        property={property}
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        onSuccess={handlePurchaseSuccess}
      />
    </div>
  );
}
