"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
export const AnimatedTestimonials = ({ testimonials, autoplay = true, }) => {
    const [active, setActive] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [rotationValues, setRotationValues] = useState([]);
    // Ensure consistent random values between server and client
    useEffect(() => {
        setIsClient(true);
        // Generate consistent rotation values for all testimonials
        const rotations = testimonials.map(() => Math.floor(Math.random() * 21) - 10);
        setRotationValues(rotations);
    }, [testimonials]);
    const handleNext = useCallback(() => {
        setActive((prev) => (prev + 1) % testimonials.length);
    }, [testimonials.length]);
    const isActive = (index) => {
        return index === active;
    };
    useEffect(() => {
        if (autoplay && isClient) {
            const interval = setInterval(handleNext, 2000);
            return () => clearInterval(interval);
        }
    }, [autoplay, handleNext, isClient]);
    const getRotationValue = (index) => {
        return rotationValues[index] || 0;
    };
    // Prevent hydration mismatch by not rendering animations until client-side
    if (!isClient) {
        return (<div className="mx-auto px-4 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
        <div className="relative flex flex-col items-center gap-10">
          <div className="w-full flex justify-center">
            <div className="relative h-96 w-96 md:h-[400px] md:w-[400px]">
              {testimonials.length > 0 && (<div className="absolute inset-0 origin-bottom">
                  <Image src={testimonials[0].src} alt="testimonial image" width={500} height={500} draggable={false} className="h-full w-full rounded-3xl object-cover object-center" priority/>
                </div>)}
            </div>
          </div>
        </div>
      </div>);
    }
    return (<div className="mx-auto px-4 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative flex flex-col items-center gap-10">
        <div className="w-full flex justify-center">
          <div className="relative h-96 w-96 md:h-[400px] md:w-[400px]">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (<motion.div key={testimonial.src} initial={{
                opacity: 0,
                scale: 0.9,
                z: -100,
                rotate: getRotationValue(index),
            }} animate={{
                opacity: isActive(index) ? 1 : 0.7,
                scale: isActive(index) ? 1 : 0.95,
                z: isActive(index) ? 0 : -100,
                rotate: isActive(index) ? 0 : getRotationValue(index),
                zIndex: isActive(index)
                    ? 40
                    : testimonials.length + 2 - index,
                y: isActive(index) ? [0, -80, 0] : 0,
            }} exit={{
                opacity: 0,
                scale: 0.9,
                z: 100,
                rotate: getRotationValue(index),
            }} transition={{
                duration: 0.4,
                ease: "easeInOut",
            }} className="absolute inset-0 origin-bottom">
                  <Image src={testimonial.src} alt="testimonial image" width={500} height={500} draggable={false} className="h-full w-full rounded-3xl object-cover object-center"/>
                </motion.div>))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between py-4 text-center max-w-xl">
        </div>
      </div>
    </div>);
};
