"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface FloatingElementProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export const FloatingElement = ({
  children,
  delay = 0,
  duration = 4,
  yOffset = 15,
  className = "",
}: FloatingElementProps) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{
        y: [-yOffset/2, yOffset/2, -yOffset/2],
      }}
      transition={{
        duration: duration,
        ease: "easeInOut",
        repeat: Infinity,
        delay: delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}; 