"use client";
import React from "react";
import { motion } from "framer-motion";
export const FloatingElement = ({ children, delay = 0, duration = 4, yOffset = 15, className = "", }) => {
    return (<motion.div initial={{ y: 0 }} animate={{
            y: [-yOffset / 2, yOffset / 2, -yOffset / 2],
        }} transition={{
            duration: duration,
            ease: "easeInOut",
            repeat: Infinity,
            delay: delay,
        }} className={className}>
      {children}
    </motion.div>);
};
