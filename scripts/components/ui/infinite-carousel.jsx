"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
export const InfiniteCarousel = ({ items, speed = 25, direction = "left", }) => {
    const [duplicatedItems, setDuplicatedItems] = useState([]);
    const containerRef = useRef(null);
    const [width, setWidth] = useState(0);
    useEffect(() => {
        // Duplicate items to create the infinite effect
        setDuplicatedItems([...items, ...items]);
    }, [items]);
    useEffect(() => {
        if (!containerRef.current)
            return;
        const calculateWidth = () => {
            var _a;
            const containerWidth = ((_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.scrollWidth) || 0;
            setWidth(containerWidth);
        };
        calculateWidth();
        window.addEventListener("resize", calculateWidth);
        return () => window.removeEventListener("resize", calculateWidth);
    }, [duplicatedItems]);
    const directionFactor = direction === "left" ? -1 : 1;
    return (<div className="relative overflow-hidden w-full">
      <motion.div ref={containerRef} className="flex py-8" animate={{
            x: directionFactor * -width / 2,
        }} transition={{
            duration: width / speed,
            ease: "linear",
            repeat: Infinity,
        }} style={{
            width: "fit-content",
        }}>
        {duplicatedItems.map((item, i) => (<div key={`${item.id}-${i}`} className="flex-shrink-0 px-4 w-72">
            <div className="relative overflow-hidden rounded-xl shadow-md bg-gray-100/50 hover:shadow-xl hover:shadow-orange-500/50 transition-shadow duration-300 group">
              <div className="relative h-44 w-full overflow-hidden">
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110"/>
                {item.logo && (<div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm p-1.5 rounded-full">
                    <Image src={item.logo} alt={`${item.title} logo`} width={28} height={28} className="rounded-full"/>
                  </div>)}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-black">{item.title}</h3>
                {item.projects && (<p className="text-sm text-gray-600 mt-1">
                    {item.projects} Projects
                  </p>)}
                
              </div>
            </div>
          </div>))}
      </motion.div>
    </div>);
};
