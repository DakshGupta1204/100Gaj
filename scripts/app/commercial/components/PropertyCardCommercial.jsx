"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaBuilding, FaChartLine, FaPercentage, FaMapMarkerAlt, FaUsers, FaStar, FaCalendarAlt } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
export default function PropertyCardCommercial({ property, index = 0, onBuyShares, variant = 'default', showInvestButton = true }) {
    const formatCurrency = (amount) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(1)}Cr`;
        }
        else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)}L`;
        }
        else {
            return `₹${amount.toLocaleString()}`;
        }
    };
    const getPropertyTypeIcon = (type) => {
        switch (type) {
            case 'Office':
                return <FaBuilding className="w-4 h-4"/>;
            case 'Retail':
                return <FaUsers className="w-4 h-4"/>;
            case 'Warehouse':
                return <FaBuilding className="w-4 h-4"/>;
            case 'Mixed Use':
                return <FaBuilding className="w-4 h-4"/>;
            case 'Industrial':
                return <FaBuilding className="w-4 h-4"/>;
            default:
                return <FaBuilding className="w-4 h-4"/>;
        }
    };
    const getAvailabilityPercentage = () => {
        return ((property.availableShares / property.totalShares) * 100).toFixed(0);
    };
    const getVariantStyles = () => {
        switch (variant) {
            case 'compact':
                return {
                    card: "luxury-card hover:shadow-orange-500/20 hover:shadow-md transition-all duration-300",
                    image: "h-40",
                    content: "p-4"
                };
            case 'featured':
                return {
                    card: "luxury-card hover:shadow-orange-500/30 hover:shadow-xl transition-all duration-300 ring-1 ring-orange-500/30",
                    image: "h-72",
                    content: "p-6"
                };
            default:
                return {
                    card: "luxury-card hover:shadow-orange-500/20 hover:shadow-lg transition-all duration-300",
                    image: "h-64",
                    content: "p-6"
                };
        }
    };
    const styles = getVariantStyles();
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="h-full">
      <Card className={`${styles.card} overflow-hidden h-full flex flex-col`}>
        {/* Property Image */}
        <div className={`relative ${styles.image}`}>
          <Image src={property.images[0] || "/commercial/placeholder.jpg"} alt={property.title} fill className="object-cover"/>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {property.featured && (<Badge className="bg-yellow-500 text-black font-semibold">
                <FaStar className="w-3 h-3 mr-1"/>
                Featured
              </Badge>)}
            {property.status === 'sold_out' && (<Badge className="bg-red-500 text-white">
                Sold Out
              </Badge>)}
            {property.status === 'coming_soon' && (<Badge className="bg-blue-500 text-white">
                Coming Soon
              </Badge>)}
          </div>

          {/* Property Type */}
          <div className="absolute bottom-4 left-4">
            <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-sm">
              {getPropertyTypeIcon(property.propertyType)}
              <span className="ml-2">{property.propertyType}</span>
            </Badge>
          </div>

          {/* Availability */}
          <div className="absolute bottom-4 right-4">
            <Badge variant="secondary" className={`backdrop-blur-sm ${parseInt(getAvailabilityPercentage()) > 50
            ? 'bg-green-500/80 text-white'
            : parseInt(getAvailabilityPercentage()) > 20
                ? 'bg-yellow-500/80 text-black'
                : 'bg-red-500/80 text-white'}`}>
              {getAvailabilityPercentage()}% Available
            </Badge>
          </div>
        </div>

        <CardContent className={`${styles.content} flex-1 flex flex-col`}>
          {/* Property Info */}
          <div className="mb-4">
            <h3 className={`font-bold text-white mb-2 ${variant === 'compact' ? 'text-lg' : 'text-xl'}`}>
              {property.title}
            </h3>
            <div className="flex items-center text-gray-400 text-sm mb-3">
              <FaMapMarkerAlt className="w-4 h-4 mr-2"/>
              {property.location}
            </div>
            {variant !== 'compact' && (<p className="text-gray-300 text-sm line-clamp-2">
                {property.description}
              </p>)}
          </div>

          {/* Developer Info */}
          {variant === 'featured' && (<div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Developer</span>
                <span className="text-white">{property.developer.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-400">Rating</span>
                <div className="flex items-center">
                  <FaStar className="w-3 h-3 text-yellow-400 mr-1"/>
                  <span className="text-white">{property.developer.rating}</span>
                </div>
              </div>
            </div>)}

          {/* Key Metrics */}
          <div className={`grid grid-cols-2 gap-4 mb-6 ${variant === 'compact' ? 'mb-4' : ''}`}>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-center text-green-400 mb-1">
                <FaChartLine className="w-4 h-4 mr-1"/>
                <span className="font-bold">{property.currentROI}%</span>
              </div>
              <div className="text-xs text-gray-400">ROI</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-center text-blue-400 mb-1">
                <FaPercentage className="w-4 h-4 mr-1"/>
                <span className="font-bold">{property.rentalYield}%</span>
              </div>
              <div className="text-xs text-gray-400">Yield</div>
            </div>
          </div>

          {/* Investment Info */}
          <div className="mb-6 flex-1">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Min Investment</span>
                <span className="text-orange-500 font-bold">
                  {formatCurrency(property.minInvestment)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Available Shares</span>
                <span className="text-white">
                  {property.availableShares.toLocaleString()}/{property.totalShares.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Occupancy</span>
                <span className="text-green-400">{property.currentOccupancy}%</span>
              </div>
              {variant === 'featured' && (<>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Monthly Rental</span>
                    <span className="text-blue-400">{formatCurrency(property.monthlyRental)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Built Year</span>
                    <span className="text-white">{property.builtYear}</span>
                  </div>
                </>)}
            </div>

            {/* Progress Bar for Availability */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Shares Sold</span>
                <span>
                  {((property.totalShares - property.availableShares) / property.totalShares * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300" style={{
            width: `${((property.totalShares - property.availableShares) / property.totalShares * 100)}%`
        }}/>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-auto">
            <Link href={`/commercial/${property._id}`} className="flex-1">
              <Button variant="outline" className="w-full luxury-button-outline" size={variant === 'compact' ? 'sm' : 'default'}>
                View Details
              </Button>
            </Link>
            {showInvestButton && (<Button onClick={() => onBuyShares === null || onBuyShares === void 0 ? void 0 : onBuyShares(property)} className={`flex-1 luxury-button ${property.status === 'sold_out' || property.status === 'coming_soon'
                ? 'opacity-50 cursor-not-allowed'
                : ''}`} disabled={property.status === 'sold_out' || property.status === 'coming_soon'} size={variant === 'compact' ? 'sm' : 'default'}>
                {property.status === 'sold_out'
                ? 'Sold Out'
                : property.status === 'coming_soon'
                    ? 'Coming Soon'
                    : 'Buy Shares'}
              </Button>)}
          </div>

          {/* Additional Info for Featured Variant */}
          {variant === 'featured' && (<div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center">
                  <FaCalendarAlt className="w-3 h-3 mr-1"/>
                  <span>Listed {new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="text-orange-400">SPV: {property.spvId}</span>
              </div>
            </div>)}
        </CardContent>
      </Card>
    </motion.div>);
}
