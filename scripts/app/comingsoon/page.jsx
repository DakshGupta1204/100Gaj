"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from '../components/navbar';
export default function ComingSoon() {
    return (<main className="min-h-screen bg-stone-light">
      <Navbar />

      <section className="relative h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/hero.avif" alt="Luxury real estate" fill priority className="object-cover opacity-70"/>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/50 z-10"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-orange-500/80 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
              <span className="text-white font-medium tracking-wider text-sm">COMING SOON</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Coming Soon
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Something great is coming soon!
            </p>
            
          </motion.div>
        </div>
      </section>
    </main>);
}
