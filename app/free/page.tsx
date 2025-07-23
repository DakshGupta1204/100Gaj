"use client";

import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Zap, Key, Clock, Globe, Search } from "lucide-react";

const FreePlanPage = () => {
  const features = [
    {
      icon: <Search className="h-6 w-6 text-orange-500" />,
      title: "Advanced Property Search",
      description:
        "Filter properties by location, price, amenities, and more to find your perfect match.",
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-orange-500" />,
      title: "Verified Listings",
      description:
        "Browse through thousands of verified properties with accurate information and details.",
    },
    {
      icon: <Zap className="h-6 w-6 text-orange-500" />,
      title: "Real-time Updates",
      description:
        "Receive notifications about new properties that match your preferences.",
    },
    {
      icon: <Globe className="h-6 w-6 text-orange-500" />,
      title: "Neighborhood Insights",
      description:
        "Get detailed information about localities, amenities, and nearby facilities.",
    },
    {
      icon: <Key className="h-6 w-6 text-orange-500" />,
      title: "Direct Owner Contact",
      description:
        "Connect directly with property owners and agents without any intermediary fees.",
    },
    {
      icon: <Clock className="h-6 w-6 text-orange-500" />,
      title: "Virtual Tours",
      description:
        "Explore properties through virtual tours and high-quality images from the comfort of your home.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-500/30 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-orange-500/30 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block bg-orange-500/20 px-4 py-2 rounded-full mb-6"
            >
              <span className="text-orange-400 font-medium">FREE ACCESS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent mb-6"
            >
              Enjoy Premium Features <br />
              At No Cost
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mb-10"
            >
              Welcome to our platform! Currently, all our extraordinary features
              are available to you completely free of charge. Experience the
              full potential of our real estate services without any
              subscription fees.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                href="/"
                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
              >
                Start Exploring Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Premium Features, Zero Cost
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Discover all the powerful tools and features available to you at
              no cost during our promotional period.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-zinc-800/50 backdrop-blur-sm p-8 rounded-xl border border-zinc-700 hover:border-orange-500/30 transition-all duration-300"
              >
                <div className="mb-6 bg-zinc-900/70 w-14 h-14 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-b from-zinc-900 to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              Ready to Find Your Dream Property?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-gray-300 mb-10"
            >
              Start your journey today and take advantage of our free access to
              premium features. No credit card required, no hidden fees.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/search"
                className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-300 w-full sm:w-auto"
              >
                Explore Properties
              </Link>

              <Link
                href="/contact"
                className="px-8 py-4 bg-transparent border border-orange-500/30 text-orange-400 font-semibold rounded-lg hover:bg-orange-500/10 transition-all duration-300 w-full sm:w-auto"
              >
                Contact Support
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default FreePlanPage;
