"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface GlassmorphicCardProps {
  name: string;
  role: string;
  image: string;
  properties: number;
  rating: number;
}

export const GlassmorphicCard = ({
  name,
  role,
  image,
  properties,
  rating
}: GlassmorphicCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="w-64 rounded-xl overflow-hidden backdrop-blur-md bg-gray-100/50 border border-gray-300/30 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        y: -10,
        transition: { duration: 0.3 }
      }}
    >
      <div className="relative w-full h-72">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/80 to-transparent" />
        
        {/* Agent info */}
        <div className="absolute bottom-0 w-full p-4 text-white">
          <h3 className="text-xl font-bold tracking-tight">{name}</h3>
          <p className="text-sm text-white/80">{role}</p>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <span className="text-sm">{rating.toFixed(1)}</span>
            </div>
            <div className="text-sm">{properties} Properties</div>
          </div>
        </div>
      </div>
      
      <motion.div 
        className="p-4 bg-white/10 backdrop-blur-lg"
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isHovered ? 'auto' : 0,
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-2">
          <button className="w-full py-2 bg-brown-light/90 text-white rounded-md text-sm hover:bg-brown-light transition-colors">
            Contact Agent
          </button>
          <button className="w-full py-2 bg-transparent border border-white/30 text-white rounded-md text-sm hover:bg-white/10 transition-colors">
            View Portfolio
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}; 