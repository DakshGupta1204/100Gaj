"use client";
import React from 'react';
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Building2, TrendingUp, DollarSign, Target, Shield, Star, Eye, CheckCircle, UserPlus, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BackgroundVideo from "./components/BackgroundVideo";
import EquityFooter from "./EquityFooter";
import EquityAnimatedBackground from "./EquityAnimatedBackground";
import EquityNavigation from "./components/EquityNavigation";
export default function EquityDashboard() {
    // Mouse tracking for animated background
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    // For parallax effects
    const { scrollY } = useScroll();
    // Subtle parallax effects
    const heroParallax = useTransform(scrollY, [0, 400], [0, -100]);
    const cardsParallax = useTransform(scrollY, [100, 600], [0, -50]);
    const statsParallax = useTransform(scrollY, [200, 800], [0, -30]);
    // Mock data
    const mockPortfolio = {
        totalValue: 1250000,
        totalInvestment: 950000,
        totalReturns: 300000,
        monthlyIncome: 28500,
        properties: 12,
        totalShares: 847
    };
    const featuredProperty = {
        id: "1",
        name: "Tech Park Mumbai",
        type: "Office Building",
        location: "Bandra Kurla Complex",
        totalShares: 1000,
        availableShares: 250,
        pricePerShare: 2500,
        currentYield: 8.5,
        predictedAppreciation: 12.3,
        riskLevel: "Low",
        image: "/property-1.jpg",
        description: "Premium office space in Mumbai's financial district",
        rentalIncome: 85000,
        occupancyRate: 95,
        totalValue: 2500000,
        aiScore: 92,
        features: ["Prime Location", "High Occupancy", "Stable Tenants"]
    };
    const stats = [
        {
            title: "Portfolio Value",
            value: "₹12.5L",
            change: "+8.2%",
            icon: DollarSign,
            color: "from-[#B6FF3F] to-[#B6FF3F]",
            borderColor: "border-[#B6FF3F]",
            changeColor: "bg-[#B6FF3F]/20 text-[#B6FF3F]"
        },
        {
            title: "Monthly Income",
            value: "₹28.5K",
            change: "+12.1%",
            icon: TrendingUp,
            color: "from-[#B6FF3F] to-[#B6FF3F]",
            borderColor: "border-[#B6FF3F]",
            changeColor: "bg-[#B6FF3F]/20 text-[#B6FF3F]"
        },
        {
            title: "Properties Owned",
            value: "12",
            change: "+2",
            icon: Building2,
            color: "from-purple-400 to-purple-600",
            borderColor: "border-purple-400",
            changeColor: "bg-purple-400/20 text-purple-400"
        },
        {
            title: "Total Returns",
            value: "31.5%",
            change: "+4.2%",
            icon: Target,
            color: "from-[#B6FF3F] to-[#B6FF3F]",
            borderColor: "border-[#B6FF3F]",
            changeColor: "bg-[#B6FF3F]/20 text-[#B6FF3F]"
        }
    ];
    return (<div className="min-h-screen bg-black text-white relative overflow-hidden">
      <EquityAnimatedBackground />
      {/* Interactive Animated Background */}
      <BackgroundVideo />
      
      {/* Navigation */}
      <EquityNavigation />

      {/* Main Content */}
      <div className="pt-16">
        {/* Hero Section */}
        <motion.section style={{ y: heroParallax }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} className="relative pt-8 pb-10 px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.div initial={{ opacity: 0, y: 50, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} whileHover={{ scale: 1.05, y: -2 }} className="inline-flex items-center gap-3 px-4 py-2 sm:px-6 sm:py-3 bg-purple-900/20 rounded-full border border-purple-400/30 mb-8 group cursor-pointer text-xs sm:text-sm">
                <motion.div initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
                  <Shield className="w-5 h-5 text-white group-hover:text-gray-200 transition-colors duration-300"/>
                </motion.div>
                <span className="text-sm font-medium text-white group-hover:text-gray-200 transition-colors duration-300">Welcome to Your Investment Dashboard</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 60, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }} className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 group">
                <motion.span initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="block text-white transition-colors duration-300 group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent">
                  Commercial Real Estate
                </motion.span>
                <motion.span initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 1.0 }} className="block bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent transition-colors duration-300 group-hover:bg-none group-hover:text-white">
                  Made Simple
                </motion.span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, delay: 1.2, ease: "easeOut" }} className="text-base sm:text-lg md:text-xl text-white max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-2">
                Start with ₹2,500. Own premium office buildings, data centers & warehouses. 
                Earn monthly rental income from Day 1.
              </motion.p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 sm:mb-16 w-full">
              {stats.map((stat, index) => {
            // All cards use purple/blue theme
            const borderColor = 'border-[#a78bfa] shadow-[0_0_24px_2px_#a78bfa55]';
            const glowText = 'text-[#a78bfa] drop-shadow-[0_0_8px_#a78bfa99]';
            const iconBg = 'from-[#a78bfa]/80 to-[#60a5fa]/60';
            const chartStroke = '#a78bfa';
            return (<motion.div key={index} initial={{ opacity: 0, y: 50, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: index * 0.1 }} whileHover={{
                    scale: 1.06,
                    boxShadow: '0 0 40px 8px #a78bfa88',
                    y: -10,
                }} whileTap={{ scale: 0.98 }} className={`relative rounded-2xl p-6 min-w-[220px] max-w-xs bg-black/60 backdrop-blur-md border-2 ${borderColor} transition-all duration-300 flex flex-col gap-4 overflow-hidden group`} style={{ fontFamily: 'var(--font-sans, Inter, sans-serif)' }}>
                    {/* Glow border overlay */}
                    <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ boxShadow: 'inset 0 2px 16px #fff2' }}/>
                    <div className="flex items-center gap-3 z-10">
                      <div className={`rounded-xl p-3 bg-gradient-to-br ${iconBg} shadow-inner`}>{React.createElement(stat.icon, { className: 'w-7 h-7' })}</div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-black/40 border border-[#B6FF3F] text-[#B6FF3F]`}>{stat.change}</span>
                        </div>
                    <div className="flex items-end gap-2 z-10">
                      <span className={`text-3xl sm:text-4xl font-extrabold leading-tight ${glowText} font-mono`}>{stat.value}</span>
                      {/* Mini growth chart indicator */}
                      <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="ml-2">
                        <polyline points="0,14 8,10 16,12 24,6 32,8 40,2" stroke="#B6FF3F" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"/>
                      </svg>
                    </div>
                    <div className="text-sm text-gray-300 font-medium z-10">{stat.title}</div>
                    {/* Glassmorphism/blur effect */}
                    <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ backdropFilter: 'blur(8px)' }}/>
                  </motion.div>);
        })}
            </div>
          </div>
        </motion.section>

        {/* Investment Steps Section with Glowing Borders */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4 underline decoration-[#a78bfa] underline-offset-4">Start Investing in 4 Simple Steps</h2>
              <p className="text-lg text-white max-w-2xl mx-auto">
                Get started with commercial real estate investing in minutes
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
              {[
            {
                title: "Create Account",
                description: "Sign up with your mobile number and complete KYC verification in under 5 minutes.",
                icon: UserPlus,
                step: 1,
                time: "2 min"
            },
            {
                title: "Browse Properties",
                description: "Explore curated commercial real estate opportunities with detailed analytics.",
                icon: Building2,
                step: 2,
                time: "5 min"
            },
            {
                title: "Invest Securely",
                description: "Start with just ₹2,500 and purchase fractional ownership through secure payment.",
                icon: CreditCard,
                step: 3,
                time: "1 min"
            },
            {
                title: "Earn Returns",
                description: "Receive monthly rental income and track your portfolio growth in real-time.",
                icon: TrendingUp,
                step: 4,
                time: "Monthly"
            }
        ].map((step, idx) => (<motion.div key={step.title} initial={{ opacity: 0, y: 40, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay: idx * 0.15 }} whileHover={{
                scale: 1.04,
                boxShadow: '0 0 32px 8px #a78bfa88',
                y: -8
            }} whileTap={{ scale: 0.98 }} className="relative flex-1 min-w-[220px] max-w-xs bg-black/70 backdrop-blur-lg border-2 border-[#a78bfa] rounded-2xl p-8 shadow-lg transition-all duration-300 group overflow-hidden flex flex-col items-center justify-between" style={{ fontFamily: 'var(--font-sans, Inter, sans-serif)' }}>
                  {/* Glowing step number */}
                  <div className="absolute -top-4 -right-4 w-9 h-9 bg-[#a78bfa] text-black font-bold text-lg flex items-center justify-center rounded-full shadow-[0_0_16px_2px_#a78bfa99] border-2 border-white/30 z-20">
                    {step.step}
                  </div>
                  {/* Time badge */}
                  <div className="absolute top-4 right-4 text-xs text-[#a78bfa] bg-[#a78bfa]/10 px-2 py-1 rounded-full font-medium border border-[#a78bfa]/30 z-20">
                    {step.time}
                  </div>
                  {/* Glowing icon */}
                  <div className="mb-6 mt-2">
                    <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#a78bfa]/80 to-[#60a5fa]/60 shadow-[0_0_24px_4px_#a78bfa55]">
                      {step.icon && React.createElement(step.icon, { className: 'w-9 h-9 text-white drop-shadow-[0_0_8px_#a78bfa]' })}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 text-center drop-shadow-[0_0_8px_#a78bfa99] group-hover:text-[#a78bfa] transition-colors duration-300">{step.title}</h3>
                  <p className="text-white text-center mb-4 text-sm leading-relaxed opacity-90">
                    {step.description}
                  </p>
                  <div className="flex-grow"/>
                  <div className="flex items-center gap-2 text-sm text-[#B6FF3F] font-semibold mb-0 mt-4">
                    <CheckCircle className="w-5 h-5 text-[#B6FF3F] drop-shadow-[0_0_6px_#B6FF3F]"/>
                    <span className="drop-shadow-[0_0_6px_#B6FF3F]">Easy & Secure</span>
                  </div>
                  {/* Purple glow border overlay */}
                  <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ boxShadow: '0 0 32px 4px #a78bfa33, inset 0 2px 16px #fff2' }}/>
                </motion.div>))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="bg-gradient-to-br from-purple-900/30 to-green-900/30 rounded-3xl border border-purple-400 p-12 shadow-lg shadow-purple-400/40">
              <Star className="w-12 h-12 text-purple-400 mx-auto mb-6"/>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Building Wealth?
              </h2>
              <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
                Join thousands of investors earning monthly income from premium commercial properties.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/equity/property">
                  <Button size="lg" className="bg-[#a78bfa] hover:bg-[#c4b5fd] text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group border-none">
                    <Building2 className="w-5 h-5 mr-2"/>
                    Start Investing
                    <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
                  </Button>
                </Link>
                <Link href="/equity/portfolio">
                  <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-md">
                    <Eye className="w-5 h-5 mr-2"/>
                    Explore Dashboard
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <EquityFooter />
      </div>
    </div>);
}
