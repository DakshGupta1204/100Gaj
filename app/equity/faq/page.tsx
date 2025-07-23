"use client";
import EquityFooter from "../EquityFooter";
import EquityNavigation from "../components/EquityNavigation";
import { motion } from "framer-motion";
import Image from "next/image";

const HouseIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
  </svg>
);

const CirclePattern = () => (
  <div className="absolute inset-0 opacity-10">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <pattern id="circle-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="2" fill="currentColor" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#circle-pattern)" />
    </svg>
  </div>
);

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <EquityNavigation />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.avif"
            alt="Luxury real estate"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#a78bfa]/40 z-10"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-[#a78bfa]/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B6FF3F]/10 rounded-full -ml-32 -mb-32"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B6FF3F]/10 rounded-full -mr-32 -mt-32"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-3xl text-center mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block bg-[#a78bfa]/60 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-[#B6FF3F]/20"
            >
              <span className="font-medium tracking-wide">Support Center</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 drop-shadow-sm">
                Welcome to Our <span className="text-[#B6FF3F]">Support Center</span>
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto drop-shadow-sm">
                We&apos;re here to help! Browse our support resources, find answers to common questions, or get in touch with our support team.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-black relative overflow-hidden" id="faq">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 text-white/50">
          <CirclePattern />
        </div>
        {/* Decorative Houses */}
        <div className="absolute left-0 top-1/3 w-24 h-24 text-white/10 transform -translate-x-1/2 rotate-12">
          <HouseIcon />
        </div>
        <div className="absolute right-0 bottom-1/3 w-28 h-28 text-[#a78bfa]/10 transform translate-x-1/2 -rotate-12">
          <HouseIcon />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block bg-[#a78bfa]/50 px-4 py-2 rounded-full mb-4"
            >
              <span className="text-white font-medium">FAQ</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              Frequently Asked Questions
            </motion.h2>
          </div>
          <div className="space-y-6">
            {[
              {
                question: "How do I create an account?",
                answer: "You can create an account by clicking on the 'Sign Up' button and following the prompts to enter your details.",
              },
              {
                question: "How can I reset my password?",
                answer: "To reset your password, click on the 'Forgot Password' link on the login page and follow the instructions sent to your email.",
              },
              {
                question: "What should I do if I encounter a technical issue?",
                answer: "If you encounter a technical issue, please contact our support team for assistance.",
              },
              {
                question: "How can I contact customer support?",
                answer: "You can contact our customer support team via email or phone. Our contact details are listed below.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 p-6 rounded-xl shadow-lg"
              >
                <h3 className="text-xl font-semibold text-[#B6FF3F] mb-2">{faq.question}</h3>
                <p className="text-white/90">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-24 bg-[#beacf6] relative overflow-hidden" id="contact-support">
        {/* Decorative Circle Pattern */}
        <div className="absolute inset-0 text-white/5">
          <CirclePattern />
        </div>
        {/* Floating Houses */}
        <div className="absolute left-1/4 top-0 w-20 h-20 text-white/10 transform -translate-y-1/2 rotate-30">
          <HouseIcon />
        </div>
        <div className="absolute right-1/4 bottom-0 w-16 h-16 text-white/10 transform translate-y-1/2 -rotate-30">
          <HouseIcon />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block bg-black px-4 py-2 rounded-full mb-6"
            >
              <span className="text-[#B6FF3F] font-medium">CONTACT SUPPORT</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              Get in Touch
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <p className="text-lg text-black/80">
                <strong>Email:</strong> support@100gaj.com
              </p>
              <p className="text-lg text-black/80">
                <strong>Phone:</strong> +91-123-456-7890
              </p>
              <p className="text-lg text-black/80">
                <strong>Office Hours:</strong> Mon-Fri, 9:00 AM - 6:00 PM
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Resources Section */}
      <section className="py-24 bg-black relative overflow-hidden" id="additional-resources">
        {/* Decorative Background */}
        <div className="absolute inset-0 text-white/5">
          <CirclePattern />
        </div>
        {/* Floating Elements */}
        <div className="absolute left-1/3 top-0 w-3 h-3 bg-white/20 rounded-full transform -translate-y-1/2"></div>
        <div className="absolute right-1/4 bottom-0 w-4 h-4 bg-white/20 rounded-full transform translate-y-1/2"></div>
        <div className="absolute left-2/3 top-1/2 w-2 h-2 bg-white/20 rounded-full"></div>
        {/* Corner Houses */}
        <div className="absolute left-0 bottom-0 w-24 h-24 text-white/10 transform -translate-x-1/2 translate-y-1/2 rotate-90">
          <HouseIcon />
        </div>
        <div className="absolute right-0 top-0 w-20 h-20 text-white/10 transform translate-x-1/2 -translate-y-1/2 -rotate-90">
          <HouseIcon />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block bg-white px-4 py-2 rounded-full mb-4"
            >
              <span className="text-[#B6FF3F] font-medium">RESOURCES</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-[#B6FF3F] mb-6"
            >
              Additional Resources
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "User Guides",
                description: "Step-by-step guides to help you navigate our platform and make the most of our services.",
              },
              {
                title: "Video Tutorials",
                description: "Watch our video tutorials to learn how to use our features and get the most out of your experience.",
              },
              {
                title: "Community Forum",
                description: "Join our community forum to connect with other users, ask questions, and share your experiences.",
              },
            ].map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 p-8 rounded-xl shadow-lg text-center"
              >
                <h3 className="text-xl font-semibold text-[#a78bfa] mb-4">{resource.title}</h3>
                <p className="text-white/90">{resource.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <EquityFooter />
    </main>
  );
}