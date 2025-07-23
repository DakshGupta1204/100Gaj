"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FaBuilding,
  FaChartLine,
  FaPercentage,
  FaSpinner,
  FaMapMarkerAlt,
  FaUsers,
  FaExclamationTriangle,
  FaSearch
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/navbar";
import { CommercialProperty } from "../data/commercialProperties";

const propertyTypeOptions = [
  { value: "all", label: "All Types" },
  { value: "Office", label: "Office" },
  { value: "Retail", label: "Retail" },
  { value: "Warehouse", label: "Warehouse" },
  { value: "Mixed Use", label: "Mixed Use" },
  { value: "Industrial", label: "Industrial" }
];

const locationOptions = [
  { value: "all", label: "All Locations" },
  { value: "Gurgaon", label: "Gurgaon" },
  { value: "New Delhi", label: "New Delhi" },
  { value: "Noida", label: "Noida" },
  { value: "Greater Noida", label: "Greater Noida" }
];

const sortOptions = [
  { value: "roi_desc", label: "Highest ROI" },
  { value: "roi_asc", label: "Lowest ROI" },
  { value: "yield_desc", label: "Highest Yield" },
  { value: "min_investment", label: "Min Investment" },
  { value: "newest", label: "Newest First" }
];

export default function CommercialListingsPage() {
  const [properties, setProperties] = useState<CommercialProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<CommercialProperty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("roi_desc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/commercial');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch properties');
      }
      
      if (data.success && data.data?.properties) {
        setProperties(data.data.properties);
        setFilteredProperties(data.data.properties);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error: any) {
      console.error('Error fetching commercial properties:', error);
      setError(error.message || 'Failed to load properties. Please try again.');
      
      // Use empty array as fallback instead of mock data
      setProperties([]);
      setFilteredProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // Filter and sort properties when dependencies change
  useEffect(() => {
    let filtered = [...properties];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(property => property.propertyType === selectedType);
    }

    // Location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter(property =>
        property.address.city === selectedLocation ||
        property.location.includes(selectedLocation)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "roi_desc":
          return b.currentROI - a.currentROI;
        case "roi_asc":
          return a.currentROI - b.currentROI;
        case "yield_desc":
          return b.rentalYield - a.rentalYield;
        case "min_investment":
          return a.minInvestment - b.minInvestment;
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
  }, [properties, searchTerm, selectedType, selectedLocation, sortBy]);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'Office':
        return <FaBuilding className="w-4 h-4" />;
      case 'Retail':
        return <FaUsers className="w-4 h-4" />;
      default:
        return <FaBuilding className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Commercial Real Estate</span>
              <br />
              <span className="text-white">Equity Investment</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Invest in premium commercial properties with fractional ownership.
              Start building your real estate portfolio with as little as ₹1 Lakh.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">12%+</div>
                <div className="text-gray-400">Average ROI</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">₹1L+</div>
                <div className="text-gray-400">Min Investment</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">5+</div>
                <div className="text-gray-400">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">90%+</div>
                <div className="text-gray-400">Occupancy</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search properties, locations..."
                    value={searchTerm}
                    onChange={(_e) => setSearchTerm(_e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {propertyTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {locationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-400">
                Found {filteredProperties.length} properties
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <FaSpinner className="animate-spin text-orange-500 text-4xl mx-auto mb-4" />
                <p className="text-gray-300 text-lg">Loading commercial properties...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-20">
              <Card className="luxury-card max-w-md mx-auto">
                <CardContent className="p-8">
                  <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Error Loading Properties</h3>
                  <p className="text-gray-300 mb-6">{error}</p>
                  <Button 
                    onClick={fetchProperties}
                    className="luxury-button"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredProperties.length === 0 && properties.length === 0 && (
            <div className="text-center py-20">
              <Card className="luxury-card max-w-md mx-auto">
                <CardContent className="p-8">
                  <FaBuilding className="text-gray-400 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">No Properties Available</h3>
                  <p className="text-gray-300 mb-6">
                    There are currently no commercial properties available for investment.
                  </p>
                  <Button 
                    onClick={fetchProperties}
                    className="luxury-button"
                  >
                    Refresh
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* No Results State */}
          {!isLoading && !error && filteredProperties.length === 0 && properties.length > 0 && (
            <div className="text-center py-20">
              <Card className="luxury-card max-w-md mx-auto">
                <CardContent className="p-8">
                  <FaSearch className="text-gray-400 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">No Results Found</h3>
                  <p className="text-gray-300 mb-6">
                    No properties match your current search criteria. Try adjusting your filters.
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedType("all");
                      setSelectedLocation("all");
                    }}
                    variant="outline"
                    className="luxury-button-outline"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Properties Grid */}
          {!isLoading && !error && filteredProperties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property, index) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="luxury-card hover:shadow-orange-500/30 hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Property Image */}
                  <div className="relative h-64">
                    <Image
                      src={property.images[0] || "/commercial/placeholder.jpg"}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    {property.featured && (
                      <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                        Featured
                      </Badge>
                    )}
                    {property.status === 'sold_out' && (
                      <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                        Sold Out
                      </Badge>
                    )}
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-sm">
                        {getPropertyTypeIcon(property.propertyType)}
                        <span className="ml-2">{property.propertyType}</span>
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-gray-400 text-sm mb-3">
                        <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                        {property.location}
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {property.description}
                      </p>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-center text-green-400 mb-1">
                          <FaChartLine className="w-4 h-4 mr-1" />
                          <span className="font-bold">{property.currentROI}%</span>
                        </div>
                        <div className="text-xs text-gray-400">ROI</div>
                      </div>
                      <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-center text-blue-400 mb-1">
                          <FaPercentage className="w-4 h-4 mr-1" />
                          <span className="font-bold">{property.rentalYield}%</span>
                        </div>
                        <div className="text-xs text-gray-400">Yield</div>
                      </div>
                    </div>

                    {/* Investment Info */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">Min Investment</span>
                        <span className="text-orange-500 font-bold">
                          {formatCurrency(property.minInvestment)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">Available Shares</span>
                        <span className="text-white">{property.availableShares}/{property.totalShares}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Occupancy</span>
                        <span className="text-green-400">{property.currentOccupancy}%</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link href={`/commercial/${property._id}`}>
                      <Button
                        className="w-full luxury-button"
                        disabled={property.status === 'sold_out'}
                      >
                        {property.status === 'sold_out' ? 'Sold Out' : 'Buy Equity Shares'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="luxury-card">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Commercial Real Estate Journey?
              </h2>
              <p className="text-gray-300 mb-8 text-lg">
                Join thousands of investors who are building wealth through fractional commercial real estate ownership.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button className="luxury-button px-8 py-3">
                    View My Portfolio
                  </Button>
                </Link>
                <Button variant="outline" className="luxury-button-outline px-8 py-3">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
