"use client";
import { useState } from "react";
import { motion } from "framer-motion";
export const GlowCardGrid = ({ tools }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mx-auto max-w-6xl">
      {tools.map((tool, index) => (<motion.div key={index} className="relative group rounded-xl border border-white/20 bg-stone-light/20 p-6 backdrop-blur-sm" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }} viewport={{ once: true }}>
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${hoveredIndex === index ? "opacity-100" : "opacity-0"}`} style={{
                zIndex: -1,
            }}/>
          
          {/* Border glow */}
          <div className={`absolute inset-px rounded-[11px] shadow-lg transition-opacity duration-300 ${hoveredIndex === index ? "opacity-100" : "opacity-0"}`} style={{
                zIndex: -1,
            }}/>
          
          <div className="flex items-start space-x-4 hover:cursor-pointer hover:scale-105 transition-all duration-300" onClick={() => window.open('/comingsoon', '_blank')}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brown-dark/20 to-beige-dark/30 backdrop-blur-sm border border-brown/20 ">
              {tool.icon}
            </div>
            
            <div>
              <h3 className="font-medium text-lg text-brown-dark mb-1">{tool.name}</h3>
              <p className="text-sm text-brown/80">{tool.description}</p>
            </div>
          </div>

          {/* Bottom highlight */}
          <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brown-light to-beige" initial={{ width: "0%", opacity: 0 }} animate={{
                width: hoveredIndex === index ? "100%" : "0%",
                opacity: hoveredIndex === index ? 1 : 0
            }} transition={{ duration: 0.3 }}/>
        </motion.div>))}
    </div>);
};
