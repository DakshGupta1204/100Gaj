'use client';
import { motion } from 'framer-motion';
import Image from "next/image";
const testimonials = [
    {
        quote: "100Gaj made finding our family home incredibly easy. The virtual tours saved us so much time, and their expert advice helped us negotiate a great deal.",
        author: "Rahul Sharma",
        role: "Homeowner",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        quote: "As a first-time buyer, I was nervous about the process. The 100Gaj team guided me through every step and found me a perfect apartment within my budget.",
        author: "Priya Patel",
        role: "First-time Buyer",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        quote: "I needed to sell my property quickly due to relocation. 100Gaj connected me with serious buyers and handled all the paperwork seamlessly.",
        author: "Vikram Malhotra",
        role: "Property Seller",
        image: "https://randomuser.me/api/portraits/men/62.jpg",
    },
];
export default function Testimonials() {
    return (<section className="py-20 gradient-bg" id="testimonials">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
          <p className="text-lg text-stone-light max-w-2xl mx-auto">
            Hear from people who have found their perfect homes with 100Gaj.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="bg-white/95 p-6 rounded-xl shadow-lg">
              <div className="mb-4">
                {[...Array(5)].map((_, i) => (<svg key={i} className="w-5 h-5 inline-block text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>))}
              </div>
              
              <p className="text-brown-dark mb-6 italic">`&quot;`{testimonial.quote}`&quot;`</p>
              
                              <div className="flex items-center">
                  <div className="relative w-12 h-12 mr-4">
                    <Image src={testimonial.image} alt={testimonial.author} fill sizes="48px" className="rounded-full object-cover"/>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brown-dark">{testimonial.author}</h4>
                  <p className="text-sm text-brown-light">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>))}
        </div>
      </div>
    </section>);
}
