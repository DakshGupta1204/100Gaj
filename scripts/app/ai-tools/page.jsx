"use client";
import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Image from "next/image";
import Link from "next/link";
export default function AIToolsPage() {
    const aiTools = [
        {
            name: "Virtual Property Tour",
            description: "AI-powered 3D walkthroughs of properties without physical visits",
            icon: "/virtual-tour.png",
            color: "bg-orange-500/10",
            link: "/comingsoon",
        },
        {
            name: "Delhi Area Analyzer",
            description: "A Powerful AI tool to analyze the pros and cons of different areas in Delhi",
            icon: "/virtual-tour.png",
            color: "bg-orange-500/10",
            link: "/delhi-area-analyzer",
        },
        {
            name: "Price Prediction",
            description: "Machine learning algorithms to predict property value trends",
            icon: "/price.png",
            color: "bg-orange-500/10",
            link: "/house-price-prediction",
        },
        {
            name: "Smart Home Integration",
            description: "AI systems to control lighting, security and climate",
            icon: "/smart-house.png",
            color: "bg-orange-500/10",
            link: "/comingsoon",
        },
        {
            name: "Chatbot Assistant",
            description: "24/7 AI-powered assistant to answer property queries",
            icon: "/chatbot.png",
            color: "bg-orange-500/10",
            link: "/comingsoon",
        },
        {
            name: "Neighborhood Analysis",
            description: "AI algorithms analyzing area safety, amenities and investment potential",
            icon: "/village.png",
            color: "bg-orange-500/10",
            link: "/comingsoon",
        },
        {
            name: "Document Analysis",
            description: "Automated legal document review with key term extraction",
            icon: "/documentation.png",
            color: "bg-orange-500/10",
            link: "/comingsoon",
        },
    ];
    return (<main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden mt-10">
        <div className="absolute inset-0 z-0">
          <Image src="/hero.avif" alt="AI in real estate" fill priority className="object-cover opacity-70"/>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/50 z-10"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-orange-500/80 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
              <span className="text-white font-medium tracking-wider text-sm">
                AI-POWERED SOLUTIONS
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Real Estate{" "}
              <span className="text-orange-500">Enhanced by AI</span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Cutting-edge artificial intelligence transforming property search,
              analysis, and transactions.
            </p>

            <div className="flex justify-center gap-4">
              <Link href="/search" className="px-8 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium">
                Explore Properties
              </Link>
              <Link href="/contact" className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-white/10 transition-colors font-medium">
                Contact Our Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Tools Grid Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-16 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our <span className="text-orange-500">AI-Powered</span> Tools
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-gray-400 max-w-2xl mx-auto">
            Leveraging artificial intelligence to revolutionize your real estate
            experience
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiTools.map((tool, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} whileHover={{ y: -5 }} className={`bg-gray-950 rounded-xl p-6 border border-gray-800 hover:border-orange-500/30 transition-all ${tool.color} shadow-lg shadow-orange-500/40`}>
                <div className="w-16 h-16 bg-orange-500/20 rounded-lg flex items-center justify-center mb-6">
                  <Image src={tool.icon} alt={tool.name} width={40} height={40} className="text-orange-500"/>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {tool.name}
                </h3>
                <p className="text-gray-400">{tool.description}</p>
                <Link href={tool.link}>Use tool</Link>
              </motion.div>))}
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">
              How <span className="text-orange-500">AI Enhances</span> Your
              Property Journey
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
            {
                title: "Save Time and Effort",
                description: "Our AI tools automate repetitive tasks, allowing you to focus on making decisions rather than collecting information.",
                icon: "/hourglass.png",
            },
            {
                title: "Make Informed Decisions",
                description: "Get access to data-driven insights that help you understand property values, neighborhood trends, and investment potential.",
                icon: "/analysis.png",
            },
            {
                title: "Personalized Experience",
                description: "Our AI learns your preferences and tailors recommendations to match your specific needs and lifestyle requirements.",
                icon: "/personalized.png",
            },
            {
                title: "Improved Visualization",
                description: "Experience properties remotely with virtual tours and 3D models that give you a realistic feel of the space before visiting in person.",
                icon: "/headset.png",
            },
        ].map((benefit, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="flex gap-6 border-2 border-gray-800 rounded-xl p-6 shadow-lg shadow-orange-500/40 hover:border-orange-500/30 transition-all hover:scale-105">
                  <div className="flex-shrink-0 w-16 h-16 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Image src={benefit.icon} alt={benefit.title} width={32} height={32} className="text-orange-500"/>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </div>
                </motion.div>))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="p-6">
              <div className="text-4xl font-bold text-orange-500 mb-2">95%</div>
              <div className="text-gray-400">Accuracy in Price Predictions</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }} className="p-6">
              <div className="text-4xl font-bold text-orange-500 mb-2">10x</div>
              <div className="text-gray-400">Faster Property Matching</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }} className="p-6">
              <div className="text-4xl font-bold text-orange-500 mb-2">
                24/7
              </div>
              <div className="text-gray-400">AI Assistant Availability</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }} className="p-6">
              <div className="text-4xl font-bold text-orange-500 mb-2">
                1000+
              </div>
              <div className="text-gray-400">Data Points Analyzed</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold mb-6">
              Experience the Future of Real Estate Today
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Discover how our AI-powered tools can streamline your property
              search and help you make better real estate decisions.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-8 py-3 bg-white text-orange-600 font-semibold rounded-md hover:bg-gray-100 transition-all duration-300">
                Get Started
              </Link>
              <Link href="/contact" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white/10 transition-all duration-300">
                Request Demo
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>);
}
