"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Link from 'next/link';
const HouseIcon = () => (<svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"/>
    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"/>
  </svg>);
const CirclePattern = () => (<div className="absolute inset-0 opacity-10">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <pattern id="circle-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="2" fill="currentColor"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#circle-pattern)"/>
    </svg>
  </div>);
export default function AboutUs() {
    return (<main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/hero.avif" alt="Luxury real estate" fill priority className="object-cover opacity-70"/>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/50 z-10"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-orange-500/80 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
              <span className="text-white font-medium tracking-wider text-sm">ABOUT US</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Learn about our <span className="text-orange-500">Company</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              We are a team of dedicated professionals who are committed to providing exceptional service and expertise in luxury real estate.
            </p>
            
            <div className="flex justify-center gap-4">
              <Link href="/search" className="px-8 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium">
                Browse Properties
              </Link>
              <Link href="/contact" className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-white/10 transition-colors font-medium">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-24 bg-gradient-to-b from-black to-zinc-900 relative overflow-hidden" id="mission-vision">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 text-orange-500/5">
          <CirclePattern />
        </div>

        {/* Decorative Houses */}
        <div className="absolute left-0 top-1/4 w-24 h-24 text-orange-500/10 transform -translate-x-1/2 animate-float-slow">
          <HouseIcon />
        </div>
        <div className="absolute right-0 bottom-1/4 w-28 h-28 text-orange-500/10 transform translate-x-1/2 rotate-180 animate-float-slow-reverse">
          <HouseIcon />
        </div>
        
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="inline-block bg-orange-500/20 px-4 py-2 rounded-full mb-4">
              <span className="text-orange-400 font-medium">OUR CORE VALUES</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-bold text-white mb-6">
              Mission and Vision
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="text-lg text-gray-300">
              Our mission is to provide an unparalleled real estate experience, connecting clients with their dream properties through personalized service and meticulous curation.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }} viewport={{ once: true }} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-orange-600/30 to-orange-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-zinc-900 to-black p-8 rounded-xl shadow-xl border border-orange-500/10 group-hover:border-orange-500/30 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-orange-500/30 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-white group-hover:text-orange-400 transition-colors duration-300">Our Mission</h3>
                </div>
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                  To deliver exceptional real estate experiences by offering a curated selection of luxury properties and providing personalized, high-quality service to our clients.
                </p>
                
                {/* Animated underline */}
                <div className="mt-6 w-full h-0.5 bg-gradient-to-r from-orange-600/0 via-orange-600/50 to-orange-600/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-orange-600/30 to-orange-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-zinc-900 to-black p-8 rounded-xl shadow-xl border border-orange-500/10 group-hover:border-orange-500/30 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-orange-500/30 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-white group-hover:text-orange-400 transition-colors duration-300">Our Vision</h3>
                </div>
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                  To be the premier choice for luxury real estate, setting new standards in the industry through innovation, integrity, and an unwavering commitment to client satisfaction.
                </p>
                
                {/* Animated underline */}
                <div className="mt-6 w-full h-0.5 bg-gradient-to-r from-orange-600/0 via-orange-600/50 to-orange-600/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-24 bg-white relative overflow-hidden" id="our-team">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Background patterns */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.08),transparent_70%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.08),transparent_70%)]"></div>
          
          {/* Orange accents */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
          
          {/* Floating Houses */}
          <div className="absolute left-1/3 top-0 w-20 h-20 text-orange-500/10 transform -translate-y-1/2 rotate-45 animate-float-slow">
            <HouseIcon />
          </div>
          <div className="absolute right-1/3 bottom-0 w-16 h-16 text-orange-500/10 transform translate-y-1/2 -rotate-45 animate-float-slow-reverse">
            <HouseIcon />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="inline-block bg-orange-500/10 px-4 py-2 rounded-full mb-4">
              <span className="text-orange-600 font-medium">MEET THE TEAM</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Expert Team
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="text-lg text-gray-600">
              Our team of dedicated professionals is committed to delivering exceptional service and expertise in luxury real estate.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
            {
                name: 'Aryan Panda',
                role: 'CEO',
                description: 'Meet our CEO, a visionary leader at the start of an exciting journey, driven by innovation and bold ambition.With fresh perspectives and unwavering dedication, he\'s shaping the future of our company from day one.',
                social: {
                    linkedin: '#',
                    twitter: '#',
                    email: 'john@example.com'
                }
            },
            {
                name: 'Bhoomi Singh',
                role: 'Chief Operating Officer',
                description: 'Our COO brings energy and precision to operations, laying strong foundations for scalable growth from the ground up.With a sharp focus on efficiency and execution, he\'s committed to turning strategy into lasting impact.',
                social: {
                    linkedin: '#',
                    twitter: '#',
                    email: 'jane@example.com'
                }
            },
            {
                name: 'Shrishti Parihar',
                role: 'HR Manager',
                description: 'Our HR Manager champions a people-first culture, building a supportive and inclusive environment from the very start.She is passionate about nurturing talent, fostering collaboration, and shaping a thriving workplace.',
                social: {
                    linkedin: '#',
                    twitter: '#',
                    email: 'emily@example.com'
                }
            },
        ].map((member, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.15 }} viewport={{ once: true }} className="group relative">
                {/* Decorative glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-500/30 to-orange-600/30 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                
                <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-orange-200">
                
                  {/* Content area */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">{member.name}</h3>
                    <p className="text-orange-600 font-medium text-sm mb-4">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                  </div>
                </div>
              </motion.div>))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 text-orange-500/5">
          <CirclePattern />
        </div>
        
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl transform -translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
            {
                value: '15+',
                label: 'Years Experience',
                icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>)
            },
            {
                value: '200+',
                label: 'Properties Sold',
                icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                  </svg>)
            },
            {
                value: '95%',
                label: 'Client Satisfaction',
                icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"/>
                  </svg>)
            },
            {
                value: '20+',
                label: 'Awards Won',
                icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"/>
                  </svg>)
            },
        ].map((stat, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-500/30 to-orange-600/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-zinc-900 to-black p-6 rounded-lg border border-orange-500/10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-4 text-orange-500 group-hover:bg-orange-500/30 transition-colors duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 group-hover:text-orange-400 transition-colors duration-300">{stat.label}</div>
                </div>
              </motion.div>))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 text-orange-500/5">
          <CirclePattern />
        </div>

        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>

        {/* Floating Elements */}
        <div className="absolute left-1/4 top-1/4 w-3 h-3 bg-orange-500/40 rounded-full animate-pulse"></div>
        <div className="absolute right-1/3 bottom-1/4 w-4 h-4 bg-orange-500/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-2/3 top-1/2 w-2 h-2 bg-orange-500/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Corner Houses */}
        <div className="absolute left-0 bottom-0 w-24 h-24 text-orange-500/10 transform -translate-x-1/2 translate-y-1/2 animate-float-slow">
          <HouseIcon />
        </div>
        <div className="absolute right-0 top-0 w-20 h-20 text-orange-500/10 transform translate-x-1/2 -translate-y-1/2 rotate-90 animate-float-slow-reverse">
          <HouseIcon />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="max-w-5xl mx-auto">
            <div className="group relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-orange-500/30 to-orange-600/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              
              <div className="relative bg-gradient-to-br from-zinc-900 to-black rounded-xl p-12 shadow-xl overflow-hidden border border-orange-500/10">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.3),transparent_50%)]"></div>
                  <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.3),transparent_50%)]"></div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl"></div>
                <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center">
                  <div className="md:w-2/3 mb-8 md:mb-0 md:pr-10">
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-white mb-6">
                      Ready to Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Dream Home</span>?
                    </motion.h2>
                    
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="text-lg text-gray-300 mb-8 max-w-xl">
                      Whether youre looking to buy, sell, or invest, our team is here to guide you every step of the way. Let&apos;s build your dream together.
                    </motion.p>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="flex flex-col sm:flex-row gap-4">
                      <a href="/contact" className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5">
                        <span className="relative z-10 flex items-center gap-2">
                          Get in Touch
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                          </svg>
                        </span>
                      </a>
                      
                      <Link href="/search" className="group relative inline-flex items-center justify-center px-8 py-4 bg-transparent border border-orange-500/30 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10">
                        <span className="relative z-10 flex items-center gap-2">
                          View Properties
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                          </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-orange-500/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      </Link>
                    </motion.div>
                  </div>
                  
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.4 }} viewport={{ once: true }} className="md:w-1/3 relative">
                    <div className="relative w-64 h-64 mx-auto">
                      <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-pulse-slow"></div>
                      <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                        <Image src="/image1.jpg" alt="Luxury Property" fill className="object-cover opacity-60 mix-blend-overlay"/>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>);
}
