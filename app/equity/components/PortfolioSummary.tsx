"use client";
import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Target, Building2, Calendar, ArrowUpRight, Zap, Star, Shield, Users, Eye, Sparkles, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BackgroundVideo from "./BackgroundVideo";

interface Portfolio {
  totalValue: number;
  totalInvestment: number;
  totalReturns: number;
  monthlyIncome: number;
  properties: number;
  totalShares: number;
}

interface PortfolioSummaryProps {
  portfolio: Portfolio;
}

export default function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for interactive gradient
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXSpring = useSpring(mouseX);
  const mouseYSpring = useSpring(mouseY);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const returnPercentage = ((portfolio.totalReturns / portfolio.totalInvestment) * 100).toFixed(1);
  const isPositive = portfolio.totalReturns > 0;

  const stats = [
    {
      title: "Total Portfolio Value",
      value: `₹${portfolio.totalValue.toLocaleString()}`,
      change: `+${returnPercentage}%`,
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      isPositive: true
    },
    {
      title: "Total Investment",
      value: `₹${portfolio.totalInvestment.toLocaleString()}`,
      change: "Principal Amount",
      icon: Target,
      color: "from-blue-500 to-purple-500",
      isPositive: true
    },
    {
      title: "Total Returns",
      value: `₹${portfolio.totalReturns.toLocaleString()}`,
      change: isPositive ? `+${returnPercentage}%` : `${returnPercentage}%`,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? "from-green-500 to-emerald-500" : "from-red-500 to-pink-500",
      isPositive
    },
    {
      title: "Monthly Income",
      value: `₹${portfolio.monthlyIncome.toLocaleString()}`,
      change: "Avg. Monthly",
      icon: Calendar,
      color: "from-orange-500 to-red-500",
      isPositive: true
    }
  ];

  const additionalStats = [
    { label: "Properties Owned", value: portfolio.properties, icon: Building2 },
    { label: "Total Shares", value: portfolio.totalShares, icon: Star },
    { label: "Avg. Monthly Yield", value: `${((portfolio.monthlyIncome * 12 / portfolio.totalInvestment) * 100).toFixed(1)}%`, icon: Zap }
  ];

  return (
    <div
      className="relative rounded-3xl p-8 mb-8 overflow-hidden group bg-black border border-[#a78bfa]"
    >
      {/* Animated background video layer */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <BackgroundVideo className="w-full h-full" />
      </div>
      {/* Content above background */}
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="relative flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: '#ede9fe' }}
              >
                <BarChart3 className="w-6 h-6" style={{ color: '#a78bfa' }} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white transition-colors duration-300 hover:text-purple-400 cursor-pointer">Portfolio Summary</h2>
                <p className="text-gray-400">Your commercial real estate investment overview</p>
              </div>
            </div>
          </div>
          <div>
            <Link href="/equity/portfolio">
              <Button
                className="rounded-xl px-6 py-3 font-semibold shadow-md transition-colors duration-300 group bg-[#a78bfa] text-white border-none hover:bg-white hover:text-[#a78bfa] focus:bg-white focus:text-[#a78bfa]"
              >
                <Eye className="w-4 h-4 mr-2 group-hover:text-[#a78bfa] group-focus:text-[#a78bfa]" />
                View Full Portfolio
                <ArrowUpRight className="w-4 h-4 ml-2 group-hover:text-[#a78bfa] group-focus:text-[#a78bfa]" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Enhanced Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className="relative rounded-2xl p-7 border border-[#a78bfa] flex flex-col gap-4 group/stat transition-all duration-300 hover:shadow-[0_0_24px_4px_#a78bfa66] hover:scale-[1.035] focus:shadow-[0_0_24px_4px_#a78bfa66] focus:scale-[1.035] outline-none"
              style={{ background: 'linear-gradient(135deg, #a78bfa22 0%, #1e293b 100%)' }}
              tabIndex={0}
            >
              {/* Icon with glowing backdrop */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#a78bfa]/10">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                {/* Neon pill tag */}
                <span className="text-xs font-semibold px-3 py-1 rounded-full shadow bg-[#B6FF3F] text-white ml-2 animate-pulse">
                  {stat.change}
                </span>
              </div>
              {/* Stat value */}
              <h3 className="stat-value text-3xl font-extrabold mb-1 tracking-tight" style={{ color: '#B6FF3F' }}>
                {stat.value}
              </h3>
              {/* Stat label */}
              <div className="stat-label text-base text-gray-300 font-medium tracking-wide">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Enhanced Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {additionalStats.map((stat, index) => (
            <div
              key={stat.label}
              className="relative bg-gradient-to-r from-purple-200/10 to-purple-400/10 rounded-2xl p-6 border border-[#a78bfa] backdrop-blur-sm overflow-hidden shadow-lg"
            >
              {/* Sparkle effect */}
              <div className="absolute top-3 right-3">
                <Sparkles className="w-3 h-3 text-purple-400/40" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-[#a78bfa]" style={{ background: '#6d28d9' }}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                    <div className="text-xl font-bold text-white">
                      {stat.value}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Performance Summary */}
        <div
          className="relative bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-md rounded-2xl p-8 border border-white/10 overflow-hidden transition-all duration-300 hover:border-[#a78bfa] hover:shadow-[0_0_32px_4px_#a78bfa55]"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-400" />
                Performance Highlights
              </h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#B6FF3F]/20 border border-[#B6FF3F] transition-all duration-300 hover:shadow-[0_0_16px_2px_#B6FF3F99]">
                <TrendingUp className="w-4 h-4" style={{ color: '#B6FF3F' }} />
                <span className="text-sm font-medium" style={{ color: '#B6FF3F' }}>Overall Positive</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-sm text-gray-400 mb-2">Return on Investment</div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold" style={{ color: '#B6FF3F' }}>
                    +{returnPercentage}%
                  </div>
                  <div className="text-sm text-gray-400">vs. initial investment</div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-sm text-gray-400 mb-2">Annualized Yield</div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-purple-400">
                    {((portfolio.monthlyIncome * 12 / portfolio.totalInvestment) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">annual return</div>
                </div>
              </div>
            </div>
            {/* Enhanced Quick Actions */}
            <div className="flex flex-wrap gap-4">
              <Link href="/equity/dashboard">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#a78bfa] to-[#6d28d9] text-white transition-all duration-300 rounded-xl px-6 py-2 shadow-lg border-none"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
              <Link href="/equity/property">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-gray-300 bg-transparent hover:bg-white hover:text-[#a78bfa] hover:border-[#a78bfa] transition-all duration-300 backdrop-blur-sm rounded-xl px-6 py-2"
                >
                  <Building2 className="w-4 h-4 mr-2 group-hover:text-[#a78bfa]" />
                  Browse Properties
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-gray-300 bg-transparent hover:bg-white hover:text-[#a78bfa] hover:border-[#a78bfa] transition-all duration-300 backdrop-blur-sm rounded-xl px-6 py-2"
              >
                <Users className="w-4 h-4 mr-2 group-hover:text-[#a78bfa]" />
                Share Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
