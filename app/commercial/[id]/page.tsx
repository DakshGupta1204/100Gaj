"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FaArrowLeft,
  
  FaMapMarkerAlt,
  FaUsers,
  
  FaChartLine,
  FaPercentage,
  FaRupeeSign,
  FaStar,
  FaDownload,
  FaShieldAlt,
  FaCheckCircle,
  FaInfoCircle
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar";
import { CommercialProperty } from "../../data/commercialProperties";
import InvestmentCalculator from "../components/InvestmentCalculator";
import BuySharesModal from "../components/BuySharesModal";
import { toast } from "sonner";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<CommercialProperty | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    }

    // Fetch property by ID from API
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/commercial/${params.id}`);
        const data = await response.json();
        if (response.ok && data.success && data.data) {
          setProperty(data.data);
        } else {
          setProperty(null);
        }
      } catch (error) {
        setProperty(null);
      }
    };
    fetchProperty();
  }, [params.id]);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const handleBuyShares = () => {
    if (!isAuthenticated) {
      toast.error("Please login to invest in properties");
      router.push('/');
      return;
    }
    setShowBuyModal(true);
  };

  const handlePurchaseSuccess = () => {
    toast.success("Investment successful! Redirecting to dashboard...");
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Property Not Found</h1>
            <Link href="/commercial">
              <Button className="luxury-button">
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Back to Listings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />

      {/* Header */}
      <section className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/commercial">
            <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white">
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Commercial Properties
            </Button>
          </Link>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold text-white mb-4"
              >
                {property.title}
              </motion.h1>
              <div className="flex items-center text-gray-400 mb-4">
                <FaMapMarkerAlt className="w-5 h-5 mr-2" />
                <span className="text-lg">{property.location}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-orange-500 text-white">
                  {property.propertyType}
                </Badge>
                {property.featured && (
                  <Badge className="bg-yellow-500 text-black">Featured</Badge>
                )}
                <Badge variant="outline" className="border-green-500 text-green-400">
                  {property.currentOccupancy}% Occupied
                </Badge>
              </div>
            </div>

            <div className="mt-6 lg:mt-0">
              <Button
                onClick={handleBuyShares}
                size="lg"
                className="luxury-button px-8 py-3 text-lg"
                disabled={property.status === 'sold_out'}
              >
                {property.status === 'sold_out' ? 'Sold Out' : 'Buy Equity Shares'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="px-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-96 lg:h-[500px]">
            <div className="lg:col-span-2">
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <Image
                  src={property.images[currentImageIndex] || "/commercial/placeholder.jpg"}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {property.images.slice(0, 3).map((image, index) => (
                <div
                  key={index}
                  className={`relative h-32 lg:h-[160px] rounded-lg overflow-hidden cursor-pointer ${
                    currentImageIndex === index ? 'ring-2 ring-orange-500' : ''
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`${property.title} - ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {currentImageIndex === index && (
                    <div className="absolute inset-0 bg-orange-500/20" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Property Details */}
            <div className="xl:col-span-2 space-y-8">
              {/* Key Metrics */}
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle className="text-white">Investment Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <FaChartLine className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-400">{property.currentROI}%</div>
                      <div className="text-sm text-gray-400">Current ROI</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <FaPercentage className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-400">{property.rentalYield}%</div>
                      <div className="text-sm text-gray-400">Rental Yield</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <FaRupeeSign className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-orange-400">
                        {formatCurrency(property.minInvestment)}
                      </div>
                      <div className="text-sm text-gray-400">Min Investment</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <FaUsers className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-400">
                        {property.availableShares}
                      </div>
                      <div className="text-sm text-gray-400">Available Shares</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="details" className="data-[state=active]:bg-orange-500">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="data-[state=active]:bg-orange-500">
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="spv" className="data-[state=active]:bg-orange-500">
                    SPV Info
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <Card className="luxury-card">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Property Description</h3>
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {property.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Amenities</h4>
                          <div className="space-y-2">
                            {property.amenities.map((amenity, index) => (
                              <div key={index} className="flex items-center text-gray-300">
                                <FaCheckCircle className="w-4 h-4 text-green-400 mr-2" />
                                {amenity}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Nearby Landmarks</h4>
                          <div className="space-y-2">
                            {property.nearbyLandmarks.map((landmark, index) => (
                              <div key={index} className="flex items-center text-gray-300">
                                <FaMapMarkerAlt className="w-4 h-4 text-orange-400 mr-2" />
                                {landmark}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="details" className="mt-6">
                  <Card className="luxury-card">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-4">Property Details</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Total Area</span>
                              <span className="text-white">{property.totalArea.toLocaleString()} sq.ft</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Built Year</span>
                              <span className="text-white">{property.builtYear}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Property Value</span>
                              <span className="text-white">{formatCurrency(property.totalPropertyValue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Monthly Rental</span>
                              <span className="text-green-400">{formatCurrency(property.monthlyRental)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-white mb-4">Developer Information</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Developer</span>
                              <span className="text-white">{property.developer.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Rating</span>
                              <div className="flex items-center">
                                <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
                                <span className="text-white">{property.developer.rating}</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Projects Completed</span>
                              <span className="text-white">{property.developer.projectsCompleted}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                  <Card className="luxury-card">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Property Documents</h3>
                      <div className="space-y-4">
                        {property.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center">
                              <FaDownload className="w-5 h-5 text-orange-400 mr-3" />
                              <div>
                                <div className="text-white font-medium">{doc.name}</div>
                                <Badge variant="secondary" className="mt-1">
                                  {doc.type}
                                </Badge>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="spv" className="mt-6">
                  <Card className="luxury-card">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <FaShieldAlt className="w-6 h-6 text-orange-400 mr-3" />
                        <h3 className="text-xl font-semibold text-white">SPV Information</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <div className="flex items-center mb-2">
                            <FaInfoCircle className="w-4 h-4 text-blue-400 mr-2" />
                            <span className="text-blue-400 font-medium">Special Purpose Vehicle (SPV)</span>
                          </div>
                          <p className="text-blue-200 text-sm">
                            This property is owned through a Special Purpose Vehicle (SPV), providing legal structure
                            and transparency for fractional ownership.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex justify-between p-3 bg-gray-800/50 rounded">
                            <span className="text-gray-400">SPV Name</span>
                            <span className="text-white">{property.spvName}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-gray-800/50 rounded">
                            <span className="text-gray-400">SPV ID</span>
                            <span className="text-white">{property.spvId}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-gray-800/50 rounded">
                            <span className="text-gray-400">Total Shares</span>
                            <span className="text-white">{property.totalShares.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-gray-800/50 rounded">
                            <span className="text-gray-400">Share Price</span>
                            <span className="text-orange-400">{formatCurrency(property.pricePerShare)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Investment Calculator */}
            <div className="xl:col-span-1">
              <div className="sticky top-24">
                <InvestmentCalculator property={property} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buy Shares Modal */}
      <BuySharesModal
        property={property}
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        onSuccess={handlePurchaseSuccess}
      />
    </div>
  );
}
