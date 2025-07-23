'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
export default function HeroSection() {
    return (<section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-light via-beige to-beige-light opacity-80 z-0"></div>
      
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image src="/real-estate-hero.jpg" alt="Modern luxury real estate" fill priority className="object-cover opacity-70"/>
      </div>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-brown/20 to-transparent z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
              Find Your Perfect <span className="text-beige-light">Home</span> With Confidence
            </h1>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <p className="text-xl md:text-2xl text-stone-light mb-8 max-w-2xl drop-shadow-md">
              100Gaj helps you discover the perfect property that matches your lifestyle and budget.
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-col sm:flex-row gap-4">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="#properties" className="px-8 py-4 bg-brown text-white rounded-md font-semibold hover:bg-brown-light transition-colors text-center">
              Explore Properties
            </a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="#how-it-works" className="px-8 py-4 bg-white/90 text-brown-dark rounded-md font-semibold hover:bg-white transition-colors text-center">
              How It Works
            </a>
          </motion.div>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-beige-dark flex items-center justify-center text-white shadow-md">5k+</div>
              <div className="w-10 h-10 rounded-full bg-brown-light flex items-center justify-center text-white shadow-md">2k+</div>
              <div className="w-10 h-10 rounded-full bg-brown flex items-center justify-center text-white shadow-md">3k+</div>
            </div>
            <p className="text-white text-sm md:text-base">
              Join <span className="font-semibold">10,000+</span> happy customers who found their dream homes
            </p>
          </motion.div>
        </div>
      </div>
    </section>);
}
