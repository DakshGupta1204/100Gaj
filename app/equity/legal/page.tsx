"use client";
import EquityFooter from "../EquityFooter";
import EquityNavigation from "../components/EquityNavigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Legal() {
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
              <span className="font-medium tracking-wide">
                Legal Information
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 drop-shadow-sm">
                <span className="text-[#a78bfa]">Legal</span> Information
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto drop-shadow-sm">
                Welcome to our legal page. Here you will find important
                information about our terms of service, privacy policy, and
                other legal disclosures.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section className="py-24 bg-[#18181b]" id="privacy-policy">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block bg-[#B6FF3F]/50 px-4 py-2 rounded-full mb-6"
            >
              <span className="text-black font-medium">Privacy Policy</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-6 text-center text-[#B6FF3F]"
            >
              Privacy Policy
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-900 p-8 rounded-xl shadow-lg space-y-4  border border-[#a78bfa]"
            >
              <p className="text-lg text-white">
                <strong>1. Information We Collect</strong> <br />
                We may collect the following types of information:
              </p>
              <ul className="list-disc list-inside text-lg text-white space-y-2">
                <li>
                  Personal Information: Your name, email address, phone number,
                  and residential address.
                </li>
                <li>
                  Property Details: Information related to properties you list
                  or search for on our platform.
                </li>
                <li>
                  Usage Data: Information such as IP address, browser type,
                  device type, pages visited, and time spent on the site.
                </li>
                <li>
                  Cookies and Tracking Technologies: We use cookies and similar
                  technologies to enhance user experience and analyze website
                  usage.
                </li>
              </ul>
              <p className="text-lg text-white">
                <strong>2. How We Use Your Information</strong> <br />
                We use your information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-lg text-white space-y-2">
                <li>
                  To facilitate property listings and search functionality.
                </li>
                <li>
                  To communicate with you regarding your account or inquiries.
                </li>
                <li>To improve our services and develop new features.</li>
                <li>
                  To send promotional communications (you may opt-out at any
                  time).
                </li>
              </ul>
              <p className="text-lg text-white">
                <strong>3. Sharing Your Information</strong> <br />
                We may share your information under the following circumstances:
              </p>
              <ul className="list-disc list-inside text-lg text-white space-y-2">
                <li>
                  With Service Providers: Trusted partners who assist us in
                  operating the website and providing services.
                </li>
                <li>
                  Legal Requirements: When required by law, regulation, or legal
                  process.
                </li>
                <li>
                  Business Transfers: In the event of a merger, acquisition, or
                  sale of assets.
                </li>
              </ul>
              <p className="text-lg text-white">
                <strong>4. Data Security</strong>
                <br />
                We implement appropriate security measures to protect your
                information from unauthorized access, disclosure, or misuse.
              </p>
              <p className="text-lg text-white">
                <strong>5. Your Rights</strong>
                <br />
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-lg text-white space-y-2">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction or deletion of your data.</li>
                <li>Object to or restrict certain processing activities.</li>
              </ul>
              <p className="text-lg text-white">
                To exercise these rights, please contact us at:
                support@100gaj.com
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Terms of Service Section */}
      <section className="py-24 bg-[#18181b]" id="terms-of-service">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block bg-[#a78bfa]/50 px-4 py-2 rounded-full mb-6"
            >
              <span className="text-white font-medium">Terms Of Service</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-6 text-center text-[#a78bfa]"
            >
              Terms of Service
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-900 p-8 rounded-xl shadow-lg space-y-4  border border-[#a78bfa]"
            >
              <p className="text-lg text-white">
                <strong>1. Eligibility</strong>
                You must be at least 18 years old to use this website.
              </p>
              <p className="text-lg text-white">
                <strong>2. User Responsibilities</strong>
                By using this site, you agree to:
              </p>
              <ul className="list-disc list-inside text-lg text-white space-y-2">
                <li>Provide accurate and current information.</li>
                <li>Maintain confidentiality of your account credentials.</li>
                <li>Use the website in compliance with applicable laws.</li>
                <li>
                  Refrain from posting any prohibited or harmful content.
                </li>
              </ul>
              <p className="text-lg text-white">
                <strong>3. Property Listings</strong>
              </p>
              <ul className="list-disc list-inside text-lg text-white space-y-2">
                <li>
                  Users are solely responsible for the accuracy of the
                  information provided in property listings.
                </li>
                <li>
                  Listings that violate our policies or applicable laws may be
                  removed without notice.
                </li>
                <li>
                  We reserve the right to moderate, edit, or delete content at
                  our discretion.
                </li>
              </ul>
              <p className="text-lg text-white">
                <strong>4. Intellectual Property</strong>
                All content on this website—including logos, text, images, and
                software—is the property of 100gaj or its content suppliers, and
                is protected by intellectual property laws.
              </p>
              <p className="text-lg text-white">
                <strong>5. Limitation of Liability</strong>
                100gaj is not liable for:
              </p>
              <ul className="list-disc list-inside text-lg text-white space-y-2">
                <li>
                  Any direct or indirect damages arising from the use of the
                  site.
                </li>
                <li>Errors or inaccuracies in property listings.</li>
                <li>Unauthorized access to user data.</li>
              </ul>
              <p className="text-lg text-white">
                <strong>6. Termination</strong>
                We reserve the right to suspend or terminate user accounts for
                any violation of these terms or misuse of our platform.
              </p>
              <p className="text-lg text-white">
                <strong>7. Governing Law</strong>
                These Terms shall be governed by the laws of India. Any disputes
                shall be subject to the jurisdiction of courts in Delhi
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-24 bg-[#18181b]" id="disclaimer">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block bg-[#B6FF3F]/50 px-4 py-2 rounded-full mb-6"
            >
              <span className="text-black font-medium">DISCLAIMER</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-6 text-center text-[#B6FF3F]"
            >
              Disclaimer
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-900 p-8 rounded-xl shadow-lg space-y-4  border border-[#a78bfa]"
            >
              <ul className="list-disc list-inside text-lg text-white space-y-2">
                <li>
                  100gaj acts solely as a platform for property listings and
                  user interactions.
                </li>
                <li>
                  We do not endorse or verify any listings, users, or property
                  details.
                </li>
                <li>
                  Users are solely responsible for conducting their own due
                  diligence before engaging in any transactions.
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <EquityFooter />
    </main>
  );
}
