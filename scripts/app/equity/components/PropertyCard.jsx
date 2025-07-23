"use client";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight, Eye, Zap, Shield, Building2, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function PropertyCard({ property }) {
    const getRiskColor = (risk) => {
        switch (risk) {
            case "Low": return "text-green-400 bg-green-500/20 border-green-500/30";
            case "Medium": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
            case "High": return "text-red-400 bg-red-500/20 border-red-500/30";
            default: return "text-gray-400 bg-gray-500/20 border-gray-500/30";
        }
    };
    const getAIScoreColor = (score) => {
        if (score >= 90)
            return "text-green-400 bg-green-500/20 border-green-500/30";
        if (score >= 80)
            return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
        return "text-orange-400 bg-orange-500/20 border-orange-500/30";
    };
    const sharesAvailablePercentage = (property.availableShares / property.totalShares) * 100;
    return (<div className="relative bg-purple-400/20 backdrop-blur-md rounded-3xl border border-[#a78bfa] transition-all duration-500 overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#a78bfa] hover:shadow-[0_0_16px_4px_#a78bfa99,0_0_40px_8px_#a78bfa33] hover:border-[#a78bfa] hover:bg-[#a78bfa11] focus:bg-[#a78bfa11] active:shadow-[0_0_32px_8px_#a78bfaee,0_0_60px_16px_#a78bfa55] active:border-[#a78bfa]" tabIndex={0}>
      {/* Enhanced Property Image */}
      <div className="relative h-52 bg-gradient-to-br from-gray-800/50 to-gray-900/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10"/>
        
        {/* Animated background pattern */}
        <motion.div className="absolute inset-0 opacity-20" animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
        }} transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
        }} style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(76, 175, 80, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(56, 142, 60, 0.3) 0%, transparent 50%)",
            backgroundSize: "100% 100%",
        }}/>

        {/* Enhanced AI Score Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className={`px-3 py-2 rounded-xl text-xs font-bold backdrop-blur-md border border-[#B6FF3F] text-[#B6FF3F] bg-transparent`}> 
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="inline-block mr-1">
              <Zap className="w-3 h-3"/>
            </motion.div>
            AI Score: {property.aiScore}
          </div>
        </div>

        {/* Enhanced Risk Level Badge */}
        <div className="absolute top-4 right-4 z-20">
          <div className={`px-3 py-2 rounded-xl text-xs font-bold backdrop-blur-md border ${getRiskColor(property.riskLevel)}`}>
            <Shield className="w-3 h-3 inline mr-1"/>
            {property.riskLevel} Risk
          </div>
        </div>

        {/* Enhanced Property Type */}
        <div className="absolute bottom-4 left-4 z-20">
          <div className="px-3 py-2 rounded-xl text-xs font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
            <Building2 className="w-3 h-3 inline mr-1"/>
            {property.type}
          </div>
        </div>

        {/* Enhanced property image placeholder */}
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-purple-400/80 shadow-lg shadow-purple-400/30 backdrop-blur-md">
            <Building2 className="w-12 h-12 text-white"/>
          </div>
          {/* Static sparkle icon */}
          <div className="absolute top-4 right-8">
            <Sparkles className="w-4 h-4 text-yellow-400/60"/>
          </div>
        </div>
      </div>

      {/* Enhanced Property Details */}
      <div className="p-6 relative">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">
            {property.name}
          </h3>
          <div className="flex items-center text-gray-400 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1"/>
            {property.location}
          </div>
          <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Enhanced Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all duration-300">
            <div className="text-2xl font-bold text-[#B6FF3F] mb-1">
              {property.currentYield}%
            </div>
            <div className="text-xs text-gray-400">Current Yield</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all duration-300">
            <div className="text-2xl font-bold text-[#B6FF3F] mb-1">
              +{property.predictedAppreciation}%
            </div>
            <div className="text-xs text-gray-400">Predicted Growth</div>
          </div>
        </div>

        {/* Enhanced Share Information */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-400">Available Shares</span>
            <span className="text-sm font-semibold text-white">
              {property.availableShares.toLocaleString()} / {property.totalShares.toLocaleString()}
            </span>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="relative w-full bg-gray-800/50 backdrop-blur-sm rounded-full h-3 mb-3 overflow-hidden border border-white/10">
            <div className="bg-[#B6FF3F] h-full rounded-full relative overflow-hidden" style={{ width: `${sharesAvailablePercentage}%` }}>
              <div className="absolute inset-0 bg-white/10"/>
            </div>
          </div>
          
          <div className="text-xs text-gray-400 mb-4">
            {sharesAvailablePercentage.toFixed(1)}% shares available
          </div>

          {/* Enhanced Price per Share */}
          <div className="flex justify-between items-center mb-4 p-3 bg-purple-400/30 text-white rounded-xl border border-purple-400/40">
            <span className="text-sm text-white">Price per Share</span>
            <span className="text-xl font-bold text-white">
              ₹{property.pricePerShare.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Enhanced Features */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {property.features.slice(0, 3).map((feature, index) => (<span key={index} className="text-xs px-3 py-1 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20">
                {feature}
              </span>))}
            {property.features.length > 3 && (<span className="text-xs px-3 py-1 bg-[#a78bfa] text-white rounded-full border border-[#a78bfa]">
                +1 more
              </span>)}
          </div>
        </div>

        {/* Enhanced Additional Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-[#a78bfa]">
            <span className="text-white">Occupancy</span>
            <span className="text-white font-semibold">{property.occupancyRate}%</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-[#a78bfa]">
            <span className="text-white">Monthly Income</span>
            <span className="text-green-400 font-semibold">₹{(property.rentalIncome / 12).toLocaleString()}</span>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex gap-3">
          <Link href={`/equity/property/${property.id}`} className="flex-1">
            <Button className="w-full bg-[#B6FF3F] hover:bg-[#d1ff4a] text-black font-semibold py-3 rounded-xl shadow-lg transition-all duration-300">
              <Eye className="w-4 h-4 mr-2"/>
              View Details
              <ArrowUpRight className="w-4 h-4 ml-2"/>
            </Button>
          </Link>
          <Button className="rounded-xl bg-[#B6FF3F] text-white font-semibold px-4 py-3 shadow-md border-none hover:shadow-[0_0_16px_2px_#B6FF3F] transition-all duration-300">
            <Target className="w-4 h-4 text-white"/>
          </Button>
        </div>
      </div>
    </div>);
}
