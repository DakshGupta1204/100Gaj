"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { CheckCircle, XCircle, Heart, Home, Ruler, Calendar, Car, Info, Bath, Bed, MapPin, ArrowRightLeft, AlertCircle, } from "lucide-react";
// Dummy properties data for fallback
const dummyProperties = [
    {
        id: "1",
        title: "Luxury Villa",
        description: "A beautiful luxury villa with modern amenities.",
        price: 15000000,
        propertyType: "villa",
        listingType: "sale",
        status: "active",
        bedrooms: 4,
        bathrooms: 3,
        area: 3200,
        yearBuilt: 2020,
        parking: 2,
        furnished: true,
        amenities: ["Swimming Pool", "Garden", "Gym", "Security"],
        features: ["Marble Flooring", "Smart Home", "High Ceiling"],
        address: {
            city: "New Delhi",
            state: "Delhi",
        },
        images: ["/dwarka.jpeg"],
        verified: true,
    },
    {
        id: "2",
        title: "Modern Apartment",
        description: "A spacious apartment in the heart of the city.",
        price: 8000000,
        propertyType: "apartment",
        listingType: "sale",
        status: "active",
        bedrooms: 3,
        bathrooms: 2,
        area: 1800,
        yearBuilt: 2019,
        parking: 1,
        furnished: false,
        amenities: ["Elevator", "Security", "Park"],
        features: ["Wooden Flooring", "Modular Kitchen"],
        address: {
            city: "Gurgaon",
            state: "Haryana",
        },
        images: ["/canada.jpeg"],
        verified: true,
    },
    {
        id: "3",
        title: "Beachfront Condo",
        description: "A stunning condo with ocean views.",
        price: 20000000,
        propertyType: "apartment",
        listingType: "sale",
        status: "active",
        bedrooms: 2,
        bathrooms: 2,
        area: 1500,
        yearBuilt: 2021,
        parking: 1,
        furnished: true,
        amenities: ["Beach Access", "Swimming Pool", "Gym"],
        features: ["Sea View", "Premium Fixtures", "Balcony"],
        address: {
            city: "Mumbai",
            state: "Maharashtra",
        },
        images: ["/image1.jpg"],
        verified: true,
    },
    {
        id: "4",
        title: "City Center Loft",
        description: "A modern loft in the city center.",
        price: 12000000,
        propertyType: "apartment",
        listingType: "rent",
        status: "active",
        bedrooms: 1,
        bathrooms: 1,
        area: 1200,
        yearBuilt: 2018,
        parking: 1,
        furnished: true,
        amenities: ["Rooftop", "Gym", "Security"],
        features: ["High Ceiling", "Open Floor Plan"],
        address: {
            city: "Bangalore",
            state: "Karnataka",
        },
        images: ["/airpirt.jpeg"],
        verified: false,
    },
    {
        id: "5",
        title: "Spacious Penthouse",
        description: "A luxurious penthouse with stunning city views.",
        price: 25000000,
        propertyType: "apartment",
        listingType: "sale",
        status: "active",
        bedrooms: 4,
        bathrooms: 4,
        area: 2800,
        yearBuilt: 2022,
        parking: 2,
        furnished: true,
        amenities: ["Private Terrace", "Jacuzzi", "Gym", "Security"],
        features: ["360° Views", "Italian Marble", "Smart Home"],
        address: {
            city: "Mumbai",
            state: "Maharashtra",
        },
        images: ["/canada.jpeg"],
        verified: true,
    },
    {
        id: "6",
        title: "Countryside Bungalow",
        description: "A peaceful bungalow away from the city noise.",
        price: 9500000,
        propertyType: "house",
        listingType: "sale",
        status: "active",
        bedrooms: 3,
        bathrooms: 2,
        area: 2000,
        yearBuilt: 2015,
        parking: 2,
        furnished: false,
        amenities: ["Garden", "Patio", "Security"],
        features: ["Wooden Interiors", "Fireplace", "Fruit Trees"],
        address: {
            city: "Lonavala",
            state: "Maharashtra",
        },
        images: ["/dwarka.jpeg"],
        verified: true,
    },
];
export default function CompareProperties() {
    const [properties, setProperties] = useState([]);
    const [selectedProperty1, setSelectedProperty1] = useState(null);
    const [selectedProperty2, setSelectedProperty2] = useState(null);
    const [property1, setProperty1] = useState(null);
    const [property2, setProperty2] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showComparison, setShowComparison] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [token, setToken] = useState(null);
    useEffect(() => {
        // Only run this on the client side
        if (typeof window !== "undefined") {
            const authToken = sessionStorage.getItem("authToken");
            if (authToken) {
                setToken(authToken);
            }
        }
    }, []);
    // Fetch favorite properties
    useEffect(() => {
        async function fetchFavoriteProperties() {
            setLoading(true);
            setFetchError(null);
            try {
                if (token) {
                    const response = await axios.get("/api/users/favorites/properties", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.data.success && response.data.favorites) {
                        const transformedData = transformApiDataToPropertyFormat(response.data.favorites);
                        setProperties(transformedData);
                        // Auto-select the first two properties if available
                        if (transformedData.length >= 1) {
                            setSelectedProperty1(transformedData[0].id);
                        }
                        if (transformedData.length >= 2) {
                            setSelectedProperty2(transformedData[1].id);
                        }
                    }
                    else {
                        setProperties(dummyProperties);
                        setFetchError("Demo mode: Using sample properties");
                    }
                }
                else {
                    setProperties(dummyProperties);
                    setFetchError("Demo mode: Using sample properties");
                }
            }
            catch (_error) {
                setFetchError(_error instanceof Error
                    ? _error.message
                    : "Failed to load favorite properties");
                setProperties(dummyProperties);
            }
            finally {
                setLoading(false);
            }
        }
        fetchFavoriteProperties();
        // Only depend on token!
    }, [token]);
    // Update the selected properties when the dropdown changes
    useEffect(() => {
        if (selectedProperty1) {
            setLoading(true);
            const found = properties.find((p) => p.id === selectedProperty1);
            if (found)
                setProperty1(found);
            setLoading(false);
        }
        else {
            setProperty1(null);
        }
    }, [selectedProperty1, properties]);
    useEffect(() => {
        if (selectedProperty2) {
            setLoading(true);
            const found = properties.find((p) => p.id === selectedProperty2);
            if (found)
                setProperty2(found);
            setLoading(false);
        }
        else {
            setProperty2(null);
        }
    }, [selectedProperty2, properties]);
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0 },
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
                delayChildren: 0.1, // Add a slight delay before starting child animations
                when: "beforeChildren",
            },
        },
    };
    // Format price as Indian currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };
    // Reset comparison when properties change
    useEffect(() => {
        setShowComparison(false);
    }, [selectedProperty1, selectedProperty2]);
    const transformApiDataToPropertyFormat = (apiData) => {
        if (!Array.isArray(apiData)) {
            return [];
        }
        try {
            const transformedData = apiData
                .map((item) => {
                var _a, _b;
                if (!item)
                    return null;
                // Handle image paths
                let imagePaths = [];
                if (Array.isArray(item.images) && item.images.length > 0) {
                    imagePaths = item.images;
                }
                else {
                    // Use fallback images from your public folder
                    imagePaths = ["/dwarka.jpeg"];
                }
                return {
                    id: item._id || `temp-${Math.random().toString(36).substr(2, 9)}`,
                    title: item.title || "Luxury Property",
                    description: item.description || "Beautiful property in prime location",
                    price: typeof item.price === "number" ? item.price : 10000000,
                    propertyType: item.propertyType || "apartment",
                    listingType: item.listingType || "sale",
                    status: item.status || "active",
                    bedrooms: typeof item.bedrooms === "number" ? item.bedrooms : 3,
                    bathrooms: typeof item.bathrooms === "number" ? item.bathrooms : 2,
                    area: typeof item.area === "number" ? item.area : 1500,
                    yearBuilt: item.yearBuilt || 2020,
                    parking: item.parking || 1,
                    furnished: Boolean(item.furnished),
                    amenities: Array.isArray(item.amenities)
                        ? item.amenities
                        : ["Security", "Park", "Gym"],
                    features: Array.isArray(item.features)
                        ? item.features
                        : ["Modern Design", "Good Location"],
                    address: {
                        city: ((_a = item.address) === null || _a === void 0 ? void 0 : _a.city) || "New Delhi",
                        state: ((_b = item.address) === null || _b === void 0 ? void 0 : _b.state) || "Delhi",
                    },
                    images: imagePaths,
                    verified: Boolean(item.verified),
                };
            })
                .filter(Boolean); // Remove any null items
            return transformedData;
        }
        catch (_error) {
            return [];
        }
    };
    return (<main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <Image src="/hero.avif" alt="Modern luxury real estate" fill priority className="object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/70 to-black z-10"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div className="max-w-3xl mx-auto text-center" initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeIn} className="inline-block bg-orange-600/60 backdrop-blur-sm px-6 py-2 rounded-full mb-8 border border-orange-300/20 mt-20">
              <span className="font-medium">Property Comparison</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 drop-shadow-sm">
              Compare Properties{" "}
              <span className="text-orange-500">Side by Side</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto drop-shadow-sm">
              Compare features, amenities, and prices of your favorite
              properties to make an informed decision.
            </motion.p>

            {fetchError && (<motion.div variants={fadeIn} className="bg-orange-500/20 border border-orange-500/30 rounded-lg px-5 py-3 text-orange-300 max-w-md mx-auto flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500"/>
                <span>{fetchError}</span>
              </motion.div>)}
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="max-w-7xl mx-auto">
            <motion.div variants={fadeIn} className="text-center mb-12">
              <div className="inline-block bg-orange-600/20 px-6 py-2 rounded-full mb-4">
                <span className="font-medium">YOUR FAVORITES</span>
              </div>
              <h2 className="text-3xl font-bold">
                Compare Your Favorite Properties
              </h2>
            </motion.div>

            {/* How To Use Section */}
            <motion.div variants={fadeIn} className="bg-white/10 rounded-xl p-6 mb-10 max-w-4xl mx-auto text-white">
              <h3 className="text-xl font-semibold mb-4">
                How to Compare Properties:
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li>
                  Add properties to your favorites by clicking the heart icon on
                  property listings
                </li>
                <li>Select two favorite properties from the dropdowns below</li>
                <li>Click the `&quot;`Compare Properties`&quot;` button</li>
                <li>View the detailed side-by-side comparison</li>
              </ol>
              <div className="mt-4 text-sm italic">
                {token
            ? "Your favorite properties are available for comparison."
            : "Please log in to access your favorite properties."}
              </div>
            </motion.div>

            {/* Loading State */}
            {loading && (<motion.div variants={fadeIn} className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-orange-600 rounded-full border-t-transparent animate-spin mb-4"></div>
                <p className="text-lg">Loading your favorite properties...</p>
              </motion.div>)}

            {/* Property Selection */}
            {!loading && properties.length >= 2 && (<motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">
                      First Property
                    </h3>
                    <Select onValueChange={(value) => setSelectedProperty1(value)} value={selectedProperty1 || undefined}>
                      <SelectTrigger className="w-full bg-white/10 border-orange-600 focus:ring-orange-500 text-white">
                        <SelectValue placeholder="Select a property" className="text-white"/>
                      </SelectTrigger>
                      <SelectContent>
                        {properties.map((property) => (<SelectItem key={property.id} value={property.id} disabled={property.id === selectedProperty2}>
                            {property.title} - {property.address.city}
                          </SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>

                  {property1 && (<div className="bg-white/10 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-white/10 h-[300px] relative">
                      <div className="relative h-40">
                        <Image src={property1.images[0]} alt={property1.title} fill className="object-cover"/>
                        <div className="absolute top-2 right-2">
                          {property1.verified ? (<Badge className="bg-green-600/20 text-green-500 border-green-500">
                              <CheckCircle className="w-3 h-3 mr-1"/> Verified
                            </Badge>) : (<Badge className="bg-yellow-600/20 text-yellow-500 border-yellow-500">
                              <Info className="w-3 h-3 mr-1"/> Pending
                            </Badge>)}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1 truncate">
                          {property1.title}
                        </h3>
                        <div className="flex items-center text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-1"/>
                          <span>
                            {property1.address.city}, {property1.address.state}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-bold">
                            {formatPrice(property1.price)}
                          </p>
                          <div className="flex space-x-1">
                            <Badge className="bg-orange-600/20 text-orange-500 border-orange-500">
                              {property1.propertyType}
                            </Badge>
                            <Badge className="bg-orange-600 text-white border-orange-600">
                              {property1.listingType}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">
                      Second Property
                    </h3>
                    <Select onValueChange={(value) => setSelectedProperty2(value)} value={selectedProperty2 || undefined}>
                      <SelectTrigger className="w-full bg-white/10 border-orange-600 focus:ring-orange-500 text-white">
                        <SelectValue placeholder="Select a property"/>
                      </SelectTrigger>
                      <SelectContent>
                        {properties.map((property) => (<SelectItem key={property.id} value={property.id} disabled={property.id === selectedProperty1}>
                            {property.title} - {property.address.city}
                          </SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>

                  {property2 && (<div className="bg-white/10 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-white/10 h-[300px] relative">
                      <div className="relative h-40">
                        <Image src={property2.images[0]} alt={property2.title} fill className="object-cover"/>
                        <div className="absolute top-2 right-2">
                          {property2.verified ? (<Badge className="bg-green-600/20 text-green-500 border-green-500">
                              <CheckCircle className="w-3 h-3 mr-1"/> Verified
                            </Badge>) : (<Badge className="bg-yellow-600/20 text-yellow-500 border-yellow-500">
                              <Info className="w-3 h-3 mr-1"/> Pending
                            </Badge>)}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1 truncate">
                          {property2.title}
                        </h3>
                        <div className="flex items-center text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-1"/>
                          <span>
                            {property2.address.city}, {property2.address.state}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-bold">
                            {formatPrice(property2.price)}
                          </p>
                          <div className="flex space-x-1">
                            <Badge className="bg-orange-600/20 text-orange-500 border-orange-500">
                              {property2.propertyType}
                            </Badge>
                            <Badge className="bg-orange-600 text-white border-orange-600">
                              {property2.listingType}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
              </motion.div>)}
            {/* Empty State - No Favorites */}
            {!loading && properties.length < 2 && (<motion.div initial="hidden" animate="visible" variants={fadeIn} className="bg-gradient-to-br from-black to-gray-900 rounded-xl p-12 text-center my-8 border border-orange-600/30 shadow-lg relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600/0 via-orange-600 to-orange-600/0"></div>
                <div className="absolute bottom-0 right-0 w-1/3 h-1/3 rounded-full bg-orange-600/10 blur-3xl"></div>
                <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-orange-600/5 blur-xl"></div>

                <Heart className="w-20 h-20 text-orange-500/70 mx-auto mb-6 animate-pulse"/>
                <h3 className="text-3xl font-bold mb-4 text-white">
                  Not enough properties to compare
                </h3>
                <p className="text-gray-300 mb-8 max-w-lg mx-auto text-lg">
                  Add properties to your favorites to compare features,
                  amenities, and prices side by side, making your property
                  selection easier.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                  <div className="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all">
                    <div className="rounded-full bg-orange-600/20 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-6 h-6 text-orange-500"/>
                    </div>
                    <h4 className="font-semibold mb-2">Find Properties</h4>
                    <p className="text-gray-400 text-sm">
                      Browse properties and add your favorites by clicking the
                      heart icon
                    </p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all">
                    <div className="rounded-full bg-orange-600/20 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <ArrowRightLeft className="w-6 h-6 text-orange-500"/>
                    </div>
                    <h4 className="font-semibold mb-2">Compare Details</h4>
                    <p className="text-gray-400 text-sm">
                      Select properties to compare features, prices, and
                      amenities side by side
                    </p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all">
                    <div className="rounded-full bg-orange-600/20 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-6 h-6 text-orange-500"/>
                    </div>
                    <h4 className="font-semibold mb-2">Make Your Decision</h4>
                    <p className="text-gray-400 text-sm">
                      Choose the property that best fits your needs with
                      confidence
                    </p>
                  </div>
                </div>

                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-orange-600/20 transition-all duration-300 hover:-translate-y-1" onClick={() => (window.location.href = "/search")}>
                  <Home className="w-5 h-5 mr-2"/>
                  Start Browsing Properties
                </Button>

                <p className="mt-6 text-gray-400 text-sm max-w-md mx-auto">
                  Your favorite properties will appear here for easy comparison
                  once you&apos;ve added them
                </p>
              </motion.div>)}
            {/* Compare Button Section */}
            {property1 && property2 ? (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center mt-8 mb-12">
                <div className="bg-orange-600/10 rounded-xl p-4 mb-6 text-center max-w-xl">
                  <p className="text-lg">
                    You&apos;ve selected two properties! Compare them now to
                    see a detailed side-by-side analysis.
                  </p>
                </div>

                {!showComparison && !loading && (<Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-6 rounded-lg shadow-md transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                        setShowComparison(true);
                        setLoading(false);
                    }, 300);
                }}>
                    <ArrowRightLeft className="w-5 h-5 mr-2"/>
                    Compare Properties
                  </Button>)}

                {loading && (<div className="flex items-center justify-center py-4">
                    <div className="w-8 h-8 border-4 border-orange-600 rounded-full border-t-transparent animate-spin"></div>
                    <span className="ml-2">Loading comparison...</span>
                  </div>)}

                {!showComparison && !loading && (<div className="flex gap-4 mt-4">
                    <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600/10" onClick={() => {
                    setSelectedProperty1(null);
                    setSelectedProperty2(null);
                }}>
                      Reset Selection
                    </Button>
                  </div>)}
              </motion.div>) : (<motion.div variants={fadeIn} className="text-center mt-8 mb-12">
                <p className="italic">
                  {!property1 && !property2
                ? "Select two properties to compare"
                : "Select one more property to enable comparison"}
                </p>
              </motion.div>)}

            {/* Comparison Table */}
            {property1 && property2 && showComparison && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white/10 rounded-xl shadow-lg p-6 border border-white/10 overflow-hidden">
                <h3 className="text-2xl font-bold text-center mb-8">
                  Property Comparison
                </h3>

                {/* Property Cards Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                      <Image src={property1.images[0]} alt={property1.title} fill className="object-cover"/>
                      {property1.verified && (<div className="absolute top-2 right-2">
                          <Badge className="bg-green-600/20 text-green-500 border-green-500">
                            <CheckCircle className="w-3 h-3 mr-1"/> Verified
                          </Badge>
                        </div>)}
                    </div>
                    <h4 className="text-xl font-bold">{property1.title}</h4>
                    <p className="text-gray-400 mt-1 mb-2">
                      {property1.description}
                    </p>
                    <div className="flex items-center text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1"/>
                      <span>
                        {property1.address.city}, {property1.address.state}
                      </span>
                    </div>
                    <p className="text-lg font-bold">
                      {formatPrice(property1.price)}
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                      <Image src={property2.images[0]} alt={property2.title} fill className="object-cover"/>
                      {property2.verified && (<div className="absolute top-2 right-2">
                          <Badge className="bg-green-600/20 text-green-500 border-green-500">
                            <CheckCircle className="w-3 h-3 mr-1"/> Verified
                          </Badge>
                        </div>)}
                    </div>
                    <h4 className="text-xl font-bold">{property2.title}</h4>
                    <p className="text-gray-400 mt-1 mb-2">
                      {property2.description}
                    </p>
                    <div className="flex items-center text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1"/>
                      <span>
                        {property2.address.city}, {property2.address.state}
                      </span>
                    </div>
                    <p className="text-lg font-bold">
                      {formatPrice(property2.price)}
                    </p>
                  </div>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-orange-600/20 bg-white/10">
                        <th className="py-4 px-4 text-left">Feature</th>
                        <th className="py-4 px-4 text-left">
                          {property1.title}
                        </th>
                        <th className="py-4 px-4 text-left">
                          {property2.title}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/20 hover:bg-white/5">
                        <td className="py-4 px-4 font-medium">Price</td>
                        <td className="py-4 px-4 font-bold">
                          {formatPrice(property1.price)}
                        </td>
                        <td className="py-4 px-4 font-bold">
                          {formatPrice(property2.price)}
                        </td>
                      </tr>
                      <tr className="border-b border-white/20 hover:bg-white/5">
                        <td className="py-4 px-4 font-medium flex items-center">
                          <Home className="w-5 h-5 mr-2"/>
                          Property Type
                        </td>
                        <td className="py-4 px-4 capitalize">
                          {property1.propertyType}
                        </td>
                        <td className="py-4 px-4 capitalize">
                          {property2.propertyType}
                        </td>
                      </tr>
                      <tr className="border-b border-white/20 hover:bg-white/5">
                        <td className="py-4 px-4 font-medium flex items-center">
                          <Bed className="w-5 h-5 mr-2"/>
                          Bedrooms
                        </td>
                        <td className="py-4 px-4">{property1.bedrooms}</td>
                        <td className="py-4 px-4">{property2.bedrooms}</td>
                      </tr>
                      <tr className="border-b border-white/20 hover:bg-white/5">
                        <td className="py-4 px-4 font-medium flex items-center">
                          <Bath className="w-5 h-5 mr-2"/>
                          Bathrooms
                        </td>
                        <td className="py-4 px-4">{property1.bathrooms}</td>
                        <td className="py-4 px-4">{property2.bathrooms}</td>
                      </tr>
                      <tr className="border-b border-white/20 hover:bg-white/5">
                        <td className="py-4 px-4 font-medium flex items-center">
                          <Ruler className="w-5 h-5 mr-2"/>
                          Area (sq ft)
                        </td>
                        <td className="py-4 px-4">
                          {property1.area.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          {property2.area.toLocaleString()}
                        </td>
                      </tr>
                      <tr className="border-b border-white/20 hover:bg-white/5">
                        <td className="py-4 px-4 font-medium flex items-center">
                          <Calendar className="w-5 h-5 mr-2"/>
                          Year Built
                        </td>
                        <td className="py-4 px-4">
                          {property1.yearBuilt || "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          {property2.yearBuilt || "N/A"}
                        </td>
                      </tr>
                      <tr className="border-b border-white/20 hover:bg-white/5">
                        <td className="py-4 px-4 font-medium flex items-center">
                          <Car className="w-5 h-5 mr-2"/>
                          Parking Spots
                        </td>
                        <td className="py-4 px-4">
                          {property1.parking || "None"}
                        </td>
                        <td className="py-4 px-4">
                          {property2.parking || "None"}
                        </td>
                      </tr>
                      <tr className="border-b border-white/20 hover:bg-white/5">
                        <td className="py-4 px-4 font-medium">Furnished</td>
                        <td className="py-4 px-4">
                          {property1.furnished ? (<CheckCircle className="w-5 h-5 text-green-500"/>) : (<XCircle className="w-5 h-5 text-red-500"/>)}
                        </td>
                        <td className="py-4 px-4">
                          {property2.furnished ? (<CheckCircle className="w-5 h-5 text-green-500"/>) : (<XCircle className="w-5 h-5 text-red-500"/>)}
                        </td>
                      </tr>
                      <tr className="border-b border-white/20 hover:bg-white/5">
                        <td className="py-4 px-4 font-medium">Location</td>
                        <td className="py-4 px-4">
                          {property1.address.city}, {property1.address.state}
                        </td>
                        <td className="py-4 px-4">
                          {property2.address.city}, {property2.address.state}
                        </td>
                      </tr>
                      <tr className="border-b border-white/20 hover:bg-white/5">
                        <td className="py-4 px-4 font-medium">Listing Type</td>
                        <td className="py-4 px-4 capitalize">
                          {property1.listingType}
                        </td>
                        <td className="py-4 px-4 capitalize">
                          {property2.listingType}
                        </td>
                      </tr>
                      <tr className="border-b border-white/20 hover:bg-white/5">
                        <td className="py-4 px-4 font-medium">Amenities</td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-2">
                            {property1.amenities.map((amenity, index) => (<Badge key={index} className="bg-orange-600/20 text-orange-500 border-orange-500">
                                {amenity}
                              </Badge>))}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-2">
                            {property2.amenities.map((amenity, index) => (<Badge key={index} className="bg-orange-600/20 text-orange-500 border-orange-500">
                                {amenity}
                              </Badge>))}
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="py-4 px-4 font-medium">Features</td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-2">
                            {property1.features.map((feature, index) => (<Badge key={index} className="bg-orange-600/10 text-orange-500 border-orange-500">
                                {feature}
                              </Badge>))}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-2">
                            {property2.features.map((feature, index) => (<Badge key={index} className="bg-orange-600/10 text-orange-500 border-orange-500">
                                {feature}
                              </Badge>))}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => {
                setShowComparison(false);
            }}>
                    Back to Selection
                  </Button>
                </div>
              </motion.div>)}

            {/* Property Cards Section */}
            {!loading && (!property1 || !property2) && properties.length > 0 ? (<motion.div variants={fadeIn} className="mt-16">
                <h3 className="text-2xl font-bold text-center mb-8">
                  Your Favorite Properties
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.slice(0, 3).map((property) => (<div key={property.id} className="bg-white/10 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-white/10">
                      <div className="relative h-48">
                        <Image src={property.images[0]} alt={property.title} fill className="object-cover"/>
                        <div className="absolute top-2 right-2">
                          {property.verified ? (<Badge className="bg-green-600/20 text-green-500 border-green-500">
                              <CheckCircle className="w-3 h-3 mr-1"/> Verified
                            </Badge>) : (<Badge className="bg-yellow-600/20 text-yellow-500 border-yellow-500">
                              <Info className="w-3 h-3 mr-1"/> Pending
                            </Badge>)}
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-orange-600/80 text-white">
                            <Heart className="w-3 h-3 mr-1 fill-current"/>{" "}
                            Favorite
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1 truncate">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-1"/>
                          <span>
                            {property.address.city}, {property.address.state}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <Bed className="w-4 h-4 mr-1"/>
                            <span>{property.bedrooms}</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="w-4 h-4 mr-1"/>
                            <span>{property.bathrooms}</span>
                          </div>
                          <div className="flex items-center">
                            <Ruler className="w-4 h-4 mr-1"/>
                            <span>{property.area.toLocaleString()} sq ft</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-bold">
                            {formatPrice(property.price)}
                          </p>
                          <div className="flex space-x-1">
                            <Badge className="bg-orange-600/20 text-orange-500 border-orange-500">
                              {property.propertyType}
                            </Badge>
                          </div>
                        </div>

                        <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white" onClick={() => {
                    if (!selectedProperty1) {
                        setSelectedProperty1(property.id);
                    }
                    else if (!selectedProperty2) {
                        setSelectedProperty2(property.id);
                    }
                }}>
                          Select for Comparison
                        </Button>
                      </div>
                    </div>))}
                </div>
              </motion.div>) : null}

            {/* Call to Action */}
            <motion.div variants={fadeIn} className="text-center mt-16">
              <p className="mb-6">
                Not sure which property is right for you? Schedule a viewing or
                contact our experts for personalized assistance.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-orange-600 text-white hover:bg-orange-700" onClick={() => (window.location.href = "/contact")}>
                  Schedule Viewing
                </Button>
                <Button className="bg-white border border-orange-600 text-orange-600 hover:bg-orange-600/10" onClick={() => (window.location.href = "/contact")}>
                  Contact Agent
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>);
}
