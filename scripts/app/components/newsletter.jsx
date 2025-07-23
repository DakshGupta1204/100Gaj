'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (_e) => {
        _e.preventDefault();
        // Here you would normally send the email to your API
        setSubmitted(true);
        setEmail('');
    };
    return (<section className="py-20 bg-stone-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Stay Updated</h2>
            <p className="text-lg text-brown-dark/80 mb-8">
              Subscribe to our newsletter for exclusive property listings, market insights, and real estate tips.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }} className="bg-white rounded-xl shadow-md p-8">
            {!submitted ? (<form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                <input type="email" value={email} onChange={(_e) => setEmail(_e.target.value)} placeholder="Enter your email address" required className="flex-grow px-4 py-3 rounded-md border border-beige focus:outline-none focus:ring-2 focus:ring-brown-light"/>
                <button type="submit" className="px-6 py-3 bg-gradient-to-r from-brown to-brown-light text-white font-semibold rounded-md hover:shadow-md transition-all whitespace-nowrap">
                  Subscribe Now
                </button>
              </form>) : (<div className="text-center py-4">
                <div className="text-green-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-brown-dark mb-2">Thank you for subscribing!</h3>
                <p className="text-brown">You&apos;ll receive our latest updates in your inbox.</p>
              </div>)}
            <p className="text-xs text-brown-dark/60 mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </motion.div>
        </div>
      </div>
    </section>);
}
