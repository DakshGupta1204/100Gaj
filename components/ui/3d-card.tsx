"use client";

import { useState} from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ThreeDCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

export const ThreeDCard = ({ imageUrl, title, description }: ThreeDCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative w-72 h-96 perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="w-full h-full rounded-2xl overflow-hidden cursor-pointer group preserve-3d"
        animate={{
          rotateX: isHovered ? 5 : 0,
          rotateY: isHovered ? 5 : 0,
          scale: isHovered ? 1.05 : 1,
          boxShadow: isHovered 
            ? '0 20px 30px -10px rgba(0, 0, 0, 0.3)' 
            : '0 10px 20px -10px rgba(0, 0, 0, 0.2)',
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
      >
        {/* Background image with gradient overlay */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        
        {/* Card content */}
        <div className="absolute bottom-0 w-full p-6 z-10">
          <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-white text-sm">{description}</p>
          
          <motion.div 
            className="mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              y: isHovered ? 0 : 10 
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut"
            }}
          >
          </motion.div>
        </div>
        
        {/* Shine effect */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.3) 50%, transparent 80%)",
          }}
        />
      </motion.div>
    </div>
  );
}; 