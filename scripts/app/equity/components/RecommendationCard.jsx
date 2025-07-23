"use client";
import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Zap, TrendingUp, Shield, Target, Star, Brain, Lightbulb, AlertCircle, CheckCircle, Building2, MapPin, DollarSign, Sparkles, Activity, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function RecommendationCard() {
    const [hoveredCard, setHoveredCard] = useState(null);
    const containerRef = useRef(null);
    // Mouse tracking for interactive gradient
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const mouseXSpring = useSpring(mouseX);
    const mouseYSpring = useSpring(mouseY);
    const handleMouseMove = (e) => {
        if (!containerRef.current)
            return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };
    const recommendations = [
        {
            id: "1",
            type: "buy",
            title: "High Growth Opportunity",
            description: "Data Center Facility in Mumbai shows exceptional potential based on cloud computing demand surge",
            propertyName: "Data Center Facility",
            location: "Mumbai, Maharashtra",
            expectedReturn: 22.3,
            confidence: 95,
            reason: "AI analysis indicates 78% increase in cloud demand in Mumbai region",
            actionText: "Invest Now",
            actionLink: "/equity/property/4"
        },
        {
            id: "2",
            type: "diversify",
            title: "Portfolio Diversification",
            description: "Consider adding industrial assets to reduce portfolio risk and increase stability",
            confidence: 87,
            reason: "Current portfolio heavily weighted in office buildings (67%)",
            actionText: "Browse Industrial",
            actionLink: "/equity/property?filter=industrial"
        },
        {
            id: "3",
            type: "hold",
            title: "Market Timing Alert",
            description: "Hold current retail investments as market shows signs of recovery in Q2",
            confidence: 82,
            reason: "Consumer spending patterns indicate 12% uptick in retail occupancy",
            actionText: "View Analysis",
            actionLink: "/equity/dashboard"
        },
        {
            id: "4",
            type: "warning",
            title: "Risk Assessment",
            description: "Warehouse sector showing volatility due to e-commerce policy changes",
            confidence: 91,
            reason: "New regulations may impact logistics real estate valuations",
            actionText: "Learn More",
            actionLink: "/equity/portfolio"
        }
    ];
    const getRecommendationColor = (type) => {
        switch (type) {
            case "buy": return {
                bg: "from-green-500/15 to-emerald-500/15",
                border: "border-green-500/40",
                icon: "text-green-400",
                badge: "bg-green-500/20 text-green-400 border-green-500/40"
            };
            case "hold": return {
                bg: "from-blue-500/15 to-purple-500/15",
                border: "border-blue-500/40",
                icon: "text-blue-400",
                badge: "bg-blue-500/20 text-blue-400 border-blue-500/40"
            };
            case "diversify": return {
                bg: "from-orange-500/15 to-yellow-500/15",
                border: "border-orange-500/40",
                icon: "text-orange-400",
                badge: "bg-orange-500/20 text-orange-400 border-orange-500/40"
            };
            case "warning": return {
                bg: "from-red-500/15 to-pink-500/15",
                border: "border-red-500/40",
                icon: "text-red-400",
                badge: "bg-red-500/20 text-red-400 border-red-500/40"
            };
            default: return {
                bg: "from-gray-500/15 to-gray-600/15",
                border: "border-gray-500/40",
                icon: "text-gray-400",
                badge: "bg-gray-500/20 text-gray-400 border-gray-500/40"
            };
        }
    };
    const getRecommendationIcon = (type) => {
        switch (type) {
            case "buy": return TrendingUp;
            case "hold": return Shield;
            case "diversify": return Target;
            case "warning": return AlertCircle;
            default: return Star;
        }
    };
    return (<motion.div ref={containerRef} className="relative bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 overflow-hidden group" onMouseMove={handleMouseMove} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} whileHover={{ scale: 1.01 }}>
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (<motion.div key={i} className="absolute w-1 h-1 bg-purple-400/30 rounded-full" initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
            }} animate={{
                y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.5, 0.5],
            }} transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
            }}/>))}
      </div>

      {/* Mouse tracking gradient */}
      <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{
            background: `radial-gradient(800px circle at ${mouseXSpring}px ${mouseYSpring}px, rgba(147, 51, 234, 0.1), transparent 40%)`,
        }}/>

      {/* Animated background pattern */}
      <motion.div className="absolute inset-0 opacity-5" animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
        }} transition={{
            duration: 35,
            repeat: Infinity,
            repeatType: "reverse",
        }} style={{
            backgroundImage: "radial-gradient(circle at 30% 40%, rgba(147, 51, 234, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(219, 39, 119, 0.4) 0%, transparent 50%)",
            backgroundSize: "140% 140%",
        }}/>

      {/* Enhanced Header */}
      <div className="relative flex items-center justify-between mb-8">
        <motion.div className="flex items-center gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <motion.div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
            <motion.div animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
        }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
              <Brain className="w-7 h-7 text-white"/>
            </motion.div>
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-white">AI Recommendations</h2>
            <p className="text-gray-400">Personalized investment insights powered by machine learning</p>
          </div>
        </motion.div>
        
        <motion.div className="flex items-center gap-2 text-sm text-gray-400 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.05 }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <Zap className="w-4 h-4 text-orange-400"/>
          </motion.div>
          <span>Updated 2 mins ago</span>
        </motion.div>
      </div>

      {/* Enhanced Recommendation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {recommendations.map((rec, index) => {
            const colors = getRecommendationColor(rec.type);
            const IconComponent = getRecommendationIcon(rec.type);
            const isHovered = hoveredCard === rec.id;
            return (<motion.div key={rec.id} className={`relative bg-gradient-to-r ${colors.bg} backdrop-blur-md rounded-2xl p-6 border ${colors.border} hover:border-opacity-80 transition-all duration-500 group/card overflow-hidden cursor-pointer`} onMouseEnter={() => setHoveredCard(rec.id)} onMouseLeave={() => setHoveredCard(null)} initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{
                    delay: 0.4 + index * 0.1,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                }} whileHover={{
                    scale: 1.02,
                    y: -5,
                    rotateY: 2,
                    rotateX: 1
                }}>
              {/* Card floating particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(3)].map((_, i) => (<motion.div key={i} className={`absolute w-1 h-1 ${colors.icon.replace('text-', 'bg-')}/40 rounded-full`} initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                    }} animate={{
                        y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                        x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                        opacity: isHovered ? [0.3, 0.8, 0.3] : [0.1, 0.3, 0.1],
                    }} transition={{
                        duration: 4 + Math.random() * 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}/>))}
              </div>

              {/* Card gradient overlay */}
              <motion.div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover/card:opacity-100 transition-opacity duration-500`}/>

              <div className="relative z-10">
                {/* Enhanced Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <motion.div className={`w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-sm flex items-center justify-center ${colors.icon} border border-white/20`} whileHover={{
                    scale: 1.1,
                    rotate: 10,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                }} transition={{ type: "spring", stiffness: 300 }}>
                      <IconComponent className="w-6 h-6"/>
                    </motion.div>
                    <div>
                      <motion.h3 className="text-lg font-semibold text-white group-hover/card:text-orange-400 transition-colors duration-300" whileHover={{ scale: 1.02 }}>
                        {rec.title}
                      </motion.h3>
                      <motion.div className={`text-xs px-3 py-1 rounded-xl backdrop-blur-sm border ${colors.badge} capitalize font-medium`} whileHover={{ scale: 1.05 }}>
                        {rec.type}
                      </motion.div>
                    </div>
                  </div>
                  <motion.div className="text-right p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10" whileHover={{ scale: 1.05 }}>
                    <div className="text-xs text-gray-400 mb-1">Confidence</div>
                    <motion.div className="text-xl font-bold text-white" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}>
                      {rec.confidence}%
                    </motion.div>
                  </motion.div>
                </div>

                {/* Enhanced Content */}
                <div className="mb-5">
                  <motion.p className="text-gray-300 text-sm mb-4 leading-relaxed" whileHover={{ scale: 1.01 }}>
                    {rec.description}
                  </motion.p>
                  
                  {/* Enhanced Property Details */}
                  {rec.propertyName && (<motion.div className="flex items-center gap-4 mb-4 text-sm p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10" whileHover={{ scale: 1.02 }}>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400"/>
                        <span className="text-gray-300 font-medium">{rec.propertyName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400"/>
                        <span className="text-gray-300">{rec.location}</span>
                      </div>
                    </motion.div>)}

                  {/* Enhanced Expected Return */}
                  {rec.expectedReturn && (<motion.div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20" whileHover={{ scale: 1.02 }}>
                      <DollarSign className="w-5 h-5 text-green-400"/>
                      <span className="text-sm text-gray-300">Expected Return:</span>
                      <motion.span className="text-lg font-bold text-green-400" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}>
                        +{rec.expectedReturn}%
                      </motion.span>
                    </motion.div>)}

                  {/* Enhanced Reason */}
                  <motion.div className="flex items-start gap-3 text-xs text-gray-400 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20" whileHover={{ scale: 1.01 }}>
                    <motion.div animate={{
                    rotate: [0, 15, 0],
                    scale: [1, 1.1, 1]
                }} transition={{ duration: 2, repeat: Infinity }}>
                      <Lightbulb className="w-4 h-4 mt-0.5 text-yellow-400"/>
                    </motion.div>
                    <span className="leading-relaxed">{rec.reason}</span>
                  </motion.div>
                </div>

                {/* Enhanced Action Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href={rec.actionLink}>
                    <Button size="sm" className={`w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition-all duration-300 group-hover/card:shadow-lg rounded-xl py-3 font-semibold`}>
                      {rec.actionText}
                      <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <ArrowUpRight className="w-4 h-4 ml-2"/>
                      </motion.div>
                    </Button>
                  </Link>
                </motion.div>
              </div>

              {/* 3D depth effect */}
              <motion.div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" animate={{
                    opacity: isHovered ? 1 : 0,
                }} transition={{ duration: 0.3 }}/>
            </motion.div>);
        })}
      </div>

      {/* Enhanced AI Insights Summary */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="relative bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-md rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 overflow-hidden" whileHover={{ scale: 1.01 }}>
        {/* Summary background effect */}
        <motion.div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"/>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <motion.div className="w-10 h-10 rounded-2xl bg-purple-500/20 backdrop-blur-sm flex items-center justify-center border border-purple-500/30" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Activity className="w-5 h-5 text-purple-400"/>
            </motion.div>
            <motion.h3 className="text-xl font-semibold text-white" whileHover={{ scale: 1.02 }}>
              Market Intelligence Summary
            </motion.h3>
            <motion.div className="ml-auto" animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
        }} transition={{ duration: 4, repeat: Infinity }}>
              <Sparkles className="w-5 h-5 text-purple-400/60"/>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
            { value: "78%", label: "Market Opportunity Score", color: "text-green-400", delay: 0 },
            { value: "4.2", label: "Risk-Adjusted Return", color: "text-orange-400", delay: 0.2 },
            { value: "92%", label: "Prediction Accuracy", color: "text-blue-400", delay: 0.4 }
        ].map((stat, index) => (<motion.div key={stat.label} className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300" whileHover={{ scale: 1.05, y: -3 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 + stat.delay }}>
                <motion.div className={`text-3xl font-bold ${stat.color} mb-2`} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}>
                  {stat.value}
                </motion.div>
                <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
              </motion.div>))}
          </div>
          
          <motion.div className="text-sm text-gray-300 mb-4 leading-relaxed p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10" whileHover={{ scale: 1.01 }}>
            Our AI model analyzes 150+ market indicators, property fundamentals, and economic trends to provide personalized recommendations. 
            Current market sentiment is <span className="text-green-400 font-semibold">bullish</span> for commercial real estate.
          </motion.div>
          
          <motion.div className="flex items-center gap-3 text-sm text-gray-400 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20" whileHover={{ scale: 1.02 }}>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <CheckCircle className="w-4 h-4 text-green-400"/>
            </motion.div>
            <span className="font-medium">Next update in 24 hours</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>);
}
