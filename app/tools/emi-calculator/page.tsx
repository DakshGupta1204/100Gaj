"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { EMICalculator } from '@/components/ui/emi-calculator';
import Image from 'next/image';
import Link from 'next/link';

export default function EMICalculatorPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/70 z-10"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 ">
          <div className="max-w-3xl text-center mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block bg-black/60 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-orange-500/20"
            >
              <span className="text-white font-medium tracking-wide">EXCLUSIVE MEMBERSHIP PLANS</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-sm">
                Loan <span className="text-orange-500">EMI Calculator</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
                <p className="text-xl md:text-2xl text-white mb-10 max-w-2xl mx-auto drop-shadow-sm">
                Plan your home loan with our interactive EMI calculator. Adjust loan amount, interest rate, and tenure to find the perfect plan for your budget.
                </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Calculator Section */}
      <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            <EMICalculator />
          </motion.div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-orange-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-black mb-8 text-center"
            >
              Frequently Asked Questions
            </motion.h2>
            
            <div className="space-y-6">
              {[
                {
                  question: "What is EMI?",
                  answer: "EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are applied to both interest and principal each month so that over a specified number of years, the loan is paid off in full."
                },
                {
                  question: "How is EMI calculated?",
                  answer: "EMI is calculated using the formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1], where P is the principal loan amount, R is the interest rate per month, and N is the number of monthly installments."
                },
                {
                  question: "How can I reduce my EMI?",
                  answer: "You can reduce your EMI by increasing the loan tenure, making a larger down payment to reduce the principal, negotiating a lower interest rate, or opting for a balance transfer to a lender offering better terms."
                },
                {
                  question: "What factors affect my home loan eligibility?",
                  answer: "Home loan eligibility is determined by factors including your age, income, employment stability, credit score, existing financial obligations, and the property's value and location."
                },
                {
                  question: "Can I pay more than my EMI amount?",
                  answer: "Yes, most lenders allow prepayment of home loans, which can reduce your overall interest burden. However, some lenders may charge a prepayment penalty, especially for fixed-rate loans."
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-orange-500/10"
                >
                  <h3 className="text-xl font-semibold text-black mb-3">{faq.question}</h3>
                  <p className="text-black/80">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-black to-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-6"
            >
              Ready to Find Your Dream Home?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg opacity-90 mb-8 max-w-2xl mx-auto"
            >
              Our property experts are ready to help you find the perfect property within your budget. Get personalized assistance with home loans and property selection.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/contact"
                className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-all duration-300"
              >
                Contact an Expert
              </Link>
              <Link
                href="/search"
                className="px-8 py-3 bg-transparent border border-orange-500 text-white font-semibold rounded-md hover:bg-orange-500/10 transition-all duration-300"
              >
                Browse Properties
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}