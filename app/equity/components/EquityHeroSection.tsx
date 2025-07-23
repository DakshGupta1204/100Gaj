"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { 
  ArrowUpRight, 
  TrendingUp, 
  Building2, 
  MapPin, 
  Shield, 
  Play, 
  X, 
  Sparkles,
  Target,
  BarChart3,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EquityHeroSection() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-[#18122B] via-[#1E1A36] to-black relative overflow-hidden">
      {/* Subtle animated background shape */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="relative z-10 text-center max-w-2xl mx-auto px-4 py-20">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          Invest in Commercial Real Estate
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Start with just ₹2,500. Own premium office buildings, data centers & warehouses. Earn monthly rental income from Day 1.
        </p>
        <Link href="/equity/property">
          <Button className="bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-lg">
            Start Investing
            <ArrowUpRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
} 