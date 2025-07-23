"use client";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { ThreeDCard } from "@/components/ui/3d-card";
import { InfiniteCarousel } from "@/components/ui/infinite-carousel";
import { SubNavbar } from "@/components/ui/sub-navbar";
import { useState, useEffect } from "react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { PropertyNewsSection } from "@/components/ui/property-news";
import Link from "next/link";
// const defaultCards = [
//   {
//     icon: <Sparkles className="size-4 text-blue-300" />,
//     title: "Featured",
//     description: "Discover amazing content",
//     date: "Just now",
//     iconClassName: "text-blue-500",
//     titleClassName: "text-blue-500",
//     className:
//       "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
//   },
//   {
//     icon: <Sparkles className="size-4 text-blue-300" />,
//     title: "Popular",
//     description: "Trending this week",
//     date: "2 days ago",
//     iconClassName: "text-blue-500",
//     titleClassName: "text-blue-500",
//     className:
//       "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
//   },
//   {
//     icon: <Sparkles className="size-4 text-blue-300" />,
//     title: "New",
//     description: "Latest updates and features",
//     date: "Today",
//     iconClassName: "text-blue-500",
//     titleClassName: "text-blue-500",
//     className:
//       "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
//   },
// ];
export default function Home() {
    const testimonials = [
        {
            src: "/airpirt.jpeg",
        },
        {
            src: "/canada.jpeg",
        },
        {
            src: "/dwarka.jpeg",
        },
        {
            src: "/image1.jpg",
        },
        {
            src: "/image3.webp",
        },
    ];
    const trendingLocalities = [
        {
            imageUrl: "/dwarka.jpeg",
            title: "Dwarka",
            description: "Modern apartments with excellent connectivity to the city center and airport",
        },
        {
            imageUrl: "/canada.jpeg",
            title: "Golf Course Road",
            description: "Luxury high-rise apartments with world-class amenities and golf views",
        },
        {
            imageUrl: "/image1.jpg",
            title: "South Delhi",
            description: "Premium villas and bungalows in Delhi's most prestigious neighborhoods",
        },
        {
            imageUrl: "/airpirt.jpeg",
            title: "Gurgaon",
            description: "Corporate hubs with modern residential complexes and urban infrastructure",
        },
    ];
    const popularBuilders = [
        {
            id: "1",
            title: "DLF Limited",
            image: "/image3.webp",
            logo: "/dwarka.jpeg",
            projects: 48,
        },
        {
            id: "2",
            title: "Godrej Properties",
            image: "/airpirt.jpeg",
            logo: "/canada.jpeg",
            projects: 36,
        },
        {
            id: "3",
            title: "Prestige Group",
            image: "/image1.jpg",
            logo: "/dwarka.jpeg",
            projects: 52,
        },
        {
            id: "4",
            title: "Sobha Limited",
            image: "/canada.jpeg",
            logo: "/image3.webp",
            projects: 29,
        },
        {
            id: "5",
            title: "Lodha Group",
            image: "/dwarka.jpeg",
            logo: "/image1.jpg",
            projects: 41,
        },
    ];
    const popularAgents = [
        {
            name: "Rahul Sharma",
            role: "Luxury Property Specialist",
            image: "/a1.jpg",
            properties: 24,
            rating: 4.9,
        },
        {
            name: "Priya Patel",
            role: "Commercial Real Estate",
            image: "/a2.jpg",
            properties: 18,
            rating: 4.7,
        },
        {
            name: "Vikram Singh",
            role: "Investment Advisor",
            image: "/a4.jpg",
            properties: 31,
            rating: 4.8,
        },
        {
            name: "Neha Khanna",
            role: "Residential Expert",
            image: "/a5.jpg",
            properties: 27,
            rating: 4.9,
        },
    ];
    const aiTools = [
        {
            name: "Virtual Property Tour",
            description: "AI-powered 3D walkthroughs of properties without physical visits",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"/>
        </svg>),
        },
        {
            name: "Delhi Area Analyzer",
            description: "A Powerful AI tool to analyze the pros and cons of different areas in Delhi",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-orange-500">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-3.9 0-7.5 3.2-7.5 7.5 0 5.25 7.5 12 7.5 12s7.5-6.75 7.5-12c0-4.3-3.6-7.5-7.5-7.5z"/>
  <circle cx="12" cy="9.75" r="2.25"/>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75l4.5 4.5m-4.5-4.5v3m0-3h3"/>
            </svg>),
        },
        {
            name: "Price Prediction",
            description: "Machine learning algorithms to predict property value trends",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>
        </svg>),
        },
        {
            name: "Smart Home Integration",
            description: "AI systems to control lighting, security and climate",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
        </svg>),
        },
        {
            name: "Chatbot Assistant",
            description: "24/7 AI-powered assistant to answer property queries",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/>
        </svg>),
        },
        {
            name: "Neighborhood Analysis",
            description: "AI algorithms analyzing area safety, amenities and investment potential",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
        </svg>),
        },
        {
            name: "Document Analysis",
            description: "Automated legal document review with key term extraction",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
        </svg>),
        },
    ];
    const navItems = [
        { label: "Home", href: "#home" },
        { label: "Localities", href: "#localities" },
        { label: "Builders", href: "#builders" },
        { label: "Agents", href: "#agents" },
        { label: "AI Tools", href: "#ai-tools" },
        { label: "Features", href: "#features" },
        { label: "Process", href: "#process" },
        { label: "News", href: "#news" },
    ];
    const [favorites, setFavorites] = useState({});
    useEffect(() => {
        // Load favorites from sessionStorage on component mount
        const savedFavorites = sessionStorage.getItem("favorites");
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);
    const toggleFavorite = (id) => {
        const newFavorites = Object.assign({}, favorites);
        newFavorites[id] = !newFavorites[id];
        setFavorites(newFavorites);
        sessionStorage.setItem("favorites", JSON.stringify(newFavorites));
    };
    return (<main className="min-h-screen bg-black text-white overflow-y-hidden">
      <Navbar />
      <SubNavbar items={navItems}/>
      {/* Mobile Navigation Dots - Alternative to SubNavbar on mobile */}
      {/* <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center md:hidden">
          <div className="bg-black/70 backdrop-blur-sm rounded-full py-2 px-4 flex space-x-3">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="w-3 h-3 rounded-full bg-gray-500 hover:bg-orange-500 transition-colors duration-200"
                aria-label={item.label}
              />
            ))}
          </div>
        </div> */}

      {/* Hero Section with background paths */}
      <section id="home" className="relative overflow-hidden">
        <BackgroundPaths />

        {/* Connector elements for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10"></div>
      </section>

      {/* Featured Properties Section */}
      <section className="pt-20 md:pt-16 pb-16 md:pb-24 bg-gradient-to-b from-black to-gray-900 relative">
        {/* Decorative background elements for continuity */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent_70%)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.05),transparent_70%)]"></div>
          <svg className="absolute right-0 bottom-1/2 h-96 w-96 text-orange-500/5 transform translate-x-1/3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M37.5,-65.1C48.9,-55.1,58.9,-44.4,65.9,-31.3C73,-18.2,77.1,-2.7,73.8,10.8C70.5,24.2,59.7,35.7,48.3,45.3C36.8,54.9,24.6,62.5,10.9,65.8C-2.9,69.1,-18.2,68.1,-33.2,63.3C-48.2,58.6,-62.9,50.2,-70.1,37.4C-77.3,24.6,-76.9,7.3,-73.3,-8.7C-69.7,-24.7,-62.9,-39.4,-51.3,-49.9C-39.7,-60.4,-23.3,-66.7,-6.9,-68.1C9.6,-69.5,26.1,-75.1,37.5,-65.1Z" transform="translate(100 100)"/>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/10 to-transparent rounded-3xl blur-xl opacity-70"></div>
                <AnimatedTestimonials testimonials={testimonials}/>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="w-full lg:w-1/2 mt-12 lg:mt-0">
              <div className="text-center lg:text-left mb-8 px-4 lg:px-0">
                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                  Choose from Our Collection
                </motion.h2>
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} viewport={{ once: true }} className="text-base md:text-xl text-gray-300 mt-4 max-w-2xl mx-auto lg:mx-0 px-4 lg:px-0">
                  Discover properties that match your style, from modern
                  apartments to luxury villas.
                </motion.p>

                <div className="mt-8 space-y-6 md:space-y-8 px-4 lg:px-0">
                  <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="relative p-6 rounded-xl bg-gradient-to-br from-black to-zinc-900 border border-orange-500/10">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-500/20 to-transparent rounded-xl blur opacity-30"></div>
                    <div className="relative">
                      <h3 className="text-2xl font-semibold text-white flex items-center">
                        <span className="text-orange-400 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                          </svg>
                        </span>
                        Explore Our Services
                      </h3>
                      <p className="text-gray-300 mt-4">
                        We offer a range of services to help you find your dream
                        home. From personalized consultations to virtual tours,
                        we are here to assist you every step of the way.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="relative p-6 rounded-xl bg-gradient-to-br from-black to-zinc-900 border border-orange-500/10">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-500/20 to-transparent rounded-xl blur opacity-30"></div>
                    <div className="relative">
                      <h3 className="text-2xl font-semibold text-white flex items-center">
                        <span className="text-orange-400 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
                          </svg>
                        </span>
                        Meet Our Team
                      </h3>
                      <p className="text-gray-300 mt-4">
                        Our team of experienced real estate professionals is
                        dedicated to providing you with the best service. Get to
                        know the people behind our success.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
      </section>

      {/* Trending Localities Section */}
      <section id="localities" className="py-10 md:py-14 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden mb-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ">
          <div className="text-center mb-8 md:mb-12 px-4 md:px-0">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="inline-block bg-orange-500/20 px-4 py-2 rounded-full mb-4">
              <span className="text-orange-400 font-medium">
                POPULAR LOCATIONS
              </span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 px-4 md:px-0">
              Trending Localities
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto px-4 md:px-0">
              Discover the most sought-after neighborhoods with excellent
              amenities, connectivity, and investment potential
            </motion.p>
          </div>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 max-w-6xl mx-auto mb-10 justify-items-center" variants={{
            hidden: { opacity: 0 },
            show: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.2,
                },
            },
        }} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {trendingLocalities.map((locality, index) => (<motion.div key={index} variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
            }} className="z-10">
                <ThreeDCard imageUrl={locality.imageUrl} title={locality.title} description={locality.description}/>
                <button onClick={() => toggleFavorite(`locality-${index}`)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 shadow-md z-20">
                  {favorites[`locality-${index}`] ? (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-500">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-5.201-3.893 12.126 12.126 0 01-2.176-2.76C3.046 12.21 2.25 10.042 2.25 7.75 2.25 4.169 4.556 2 7.75 2c1.747 0 3.332.665 4.5 1.89C13.4 2.665 14.984 2 16.75 2c3.194 0 5.5 2.169 5.5 5.75 0 2.293-.796 4.46-2.089 6.481a12.019 12.019 0 01-2.176 2.76 15.112 15.112 0 01-5.201 3.893l-.022.012-.001.001a.75.75 0 01-.717 0l-.001-.001z"/>
                    </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                    </svg>)}
                </button>
              </motion.div>))}
          </motion.div>
        </div>

        {/* Transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-gray-900 to-black z-10"></div>
      </section>

      {/* Popular Builders Section */}
      <section id="builders" className="py-12 md:py-24 bg-white relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-500/30 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-orange-500/30 blur-3xl"></div>
          <svg className="absolute right-0 bottom-0 w-72 h-72 text-orange-500/10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M37.5,-65.1C48.9,-55.1,58.9,-44.4,65.9,-31.3C73,-18.2,77.1,-2.7,73.8,10.8C70.5,24.2,59.7,35.7,48.3,45.3C36.8,54.9,24.6,62.5,10.9,65.8C-2.9,69.1,-18.2,68.1,-33.2,63.3C-48.2,58.6,-62.9,50.2,-70.1,37.4C-77.3,24.6,-76.9,7.3,-73.3,-8.7C-69.7,-24.7,-62.9,-39.4,-51.3,-49.9C-39.7,-60.4,-23.3,-66.7,-6.9,-68.1C9.6,-69.5,26.1,-75.1,37.5,-65.1Z" transform="translate(100 100)"/>
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 md:mb-16 px-4 md:px-0">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="inline-block bg-orange-500/10 px-4 py-2 rounded-full mb-4">
              <span className="text-orange-600 font-semibold">
                TRUSTED DEVELOPERS
              </span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-6 px-4 md:px-0">
              Premium Builders & Developers
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Partner with India&apos;s most reputable builders known for
              their quality construction, timely delivery, and innovative design
              principles
            </motion.p>
          </div>

          {/* Builder Cards Section */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="mt-12 relative">
            {/* Carousel with shadow effect */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-white to-transparent z-10"></div>
              <div className="absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-white to-transparent z-10"></div>
              <InfiniteCarousel items={popularBuilders} speed={60} direction="right"/>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="mt-16 text-center">
            <button className="group relative px-8 py-4 overflow-hidden bg-gray-200 border-2 border-gray-300 text-black font-semibold rounded-xl transition-all duration-300 hover:text-white shadow-md hover:border-orange-500" onClick={() => (window.location.href = "/builders")}>
              <span className="relative z-10">View All Premium Builders</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            </button>
          </motion.div>
        </div>

        {/* Transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-950 via-gray-800 to-white z-10"></div>
      </section>

      {/* Popular Agents Section */}
      <section id="agents" className="py-12 md:py-24 bg-gradient-to-br from-zinc-950 to-black relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.08),transparent_70%)]"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="inline-block bg-orange-500/20 px-4 py-2 rounded-full mb-4">
              <span className="text-orange-400 font-medium">
                EXPERT PROFESSIONALS
              </span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-white mb-6">
              Meet Our Top Agents
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="text-lg text-gray-300 max-w-2xl mx-auto">
              Our team of experienced real estate professionals is dedicated to
              helping you find your perfect property with personalized service
              and local expertise
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 max-w-6xl mx-auto mb-10 justify-items-center">
            {popularAgents.map((agent, index) => (<motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="group relative">
                {/* Card with hover effect */}
                <div className="relative rounded-xl overflow-hidden aspect-[3/4] shadow-xl w-60">
                  {/* Image container with gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                  {/* Agent image */}
                  <Image src={agent.image} alt={agent.name} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"/>

                  {/* Properties badge */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium z-20">
                    {agent.properties} Properties
                  </div>

                  {/* Rating stars */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md flex items-center space-x-1 z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-orange-400">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-xs">{agent.rating}</span>
                  </div>

                  {/* Agent info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                    <h3 className="font-bold text-xl text-white">
                      {agent.name}
                    </h3>
                    <p className="text-orange-300 text-sm font-medium">
                      {agent.role}
                    </p>
                  </div>
                </div>

                {/* View profile button that appears on hover */}
               
              </motion.div>))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="mt-24 text-center">
            <button className="group relative px-8 py-4 bg-transparent border-2 border-orange-500/30 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:border-orange-500" onClick={() => (window.location.href = "/agents")}>
              <span className="relative z-10 flex items-center justify-center gap-2">
                View All Agents
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </motion.div>
        </div>

        {/* Transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-gray-800 to-black z-10"></div>
      </section>

      {/* AI Tools Section */}
      <section id="ai-tools" className="py-12 md:py-24 bg-white relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.3),transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.3),transparent_70%)]"></div>
          <svg className="absolute left-0 top-1/4 w-72 h-72 text-orange-500/10 -translate-x-1/3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M37.5,-65.1C48.9,-55.1,58.9,-44.4,65.9,-31.3C73,-18.2,77.1,-2.7,73.8,10.8C70.5,24.2,59.7,35.7,48.3,45.3C36.8,54.9,24.6,62.5,10.9,65.8C-2.9,69.1,-18.2,68.1,-33.2,63.3C-48.2,58.6,-62.9,50.2,-70.1,37.4C-77.3,24.6,-76.9,7.3,-73.3,-8.7C-69.7,-24.7,-62.9,-39.4,-51.3,-49.9C-39.7,-60.4,-23.3,-66.7,-6.9,-68.1C9.6,-69.5,26.1,-75.1,37.5,-65.1Z" transform="translate(100 100)"/>
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="inline-block bg-orange-500/10 px-4 py-2 rounded-full mb-4">
              <span className="text-orange-600 font-semibold">
                CUTTING-EDGE TECHNOLOGY
              </span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              AI-Powered Real Estate Tools
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of real estate with our innovative
              AI-powered tools that make finding and purchasing property easier
              than ever
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-4">
            {aiTools.map((tool, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/15 rounded-bl-full transform transition-transform duration-500 group-hover:scale-150"></div>

                <div className="relative">
                  <div className="bg-orange-500/10 rounded-full w-14 h-14 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors duration-300">
                    <div className="text-orange-600">{tool.icon}</div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                    {tool.name}
                  </h3>
                  <p className="text-gray-600">{tool.description}</p>

                  <div className="mt-6 overflow-hidden">
                    <div className="h-0.5 w-12 bg-orange-500/40 transform translate-x-0 group-hover:translate-x-full transition-transform duration-700"></div>
                  </div>

                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a href="/ai-tools" className="text-orange-600 font-medium flex items-center text-sm">
                      Learn more
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} viewport={{ once: true }} className="mt-16 text-center">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-zinc-900 to-black text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl" onClick={() => (window.location.href = "/ai-tools")}>
              <span className="relative z-10 flex items-center gap-2">
                Explore All AI Features
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </motion.div>
        </div>

        {/* Transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black via-gray-800 to-white z-10"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-16 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-white text-4xl font-bold text-center mb-10">
            Why Choose Us?
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto mt-10 md:mt-20 px-4 md:px-0">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }} className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all duration-300">
              <div className="text-orange-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Verified Listings
              </h3>
              <p className="text-gray-400">
                Every property is verified by our team to ensure accuracy and
                reliability.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all duration-300">
              <div className="text-orange-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Price Alerts
              </h3>
              <p className="text-gray-400">
                Stay updated with price changes and new listings in your
                preferred areas.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }} className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all duration-300">
              <div className="text-orange-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Expert Advice
              </h3>
              <p className="text-gray-400">
                Connect with real estate experts for guidance on buying,
                selling, or renting properties.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all duration-300">
              <div className="text-orange-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Legal Assistance
              </h3>
              <p className="text-gray-400">
                Get help with documentation, legal checks, and paperwork from
                our professional team.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="process" className="py-12 md:py-24 bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="inline-block bg-orange-500/20 px-4 py-2 rounded-full mb-4">
              <span className="text-orange-400 font-medium">
                SIMPLE PROCESS
              </span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-white mb-6">
              How It Works
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="text-lg text-gray-300 max-w-2xl mx-auto">
              Finding your dream property has never been easier with our simple
              process.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 max-w-5xl mx-auto px-4 md:px-0">
            {[
            {
                number: "01",
                title: "Search Properties",
                description: "Browse through thousands of verified properties matching your criteria.",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                  </svg>),
            },
            {
                number: "02",
                title: "Schedule Visits",
                description: "Book property visits with just a few clicks and tour your favorite properties.",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
                  </svg>),
            },
            {
                number: "03",
                title: "Get Support",
                description: "Our experts will guide you through the entire process, from viewing to closing the deal.",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
                  </svg>),
            },
            {
                number: "04",
                title: "Close the Deal",
                description: "Finalize your property transaction with confidence and start your new chapter.",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                  </svg>),
            },
        ].map((step, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }} className="text-center relative">
                <div className="bg-zinc-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 relative group">
                  <div className="bg-orange-500 w-20 h-20 rounded-full flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
                    {step.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold text-orange-500 mb-2">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="mt-16 mb-16 text-center">
            <Link href="/search" className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-400 text-white font-semibold rounded-md hover:shadow-lg transition-all duration-300">
              Explore Properties
            </Link>
          </motion.div>
        </div>

        {/* Transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-black z-10"></div>
      </section>

      {/* Property News & Blog Section */}
      <section className="bg-black py-20 relative" id="news">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Property News & Insights
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Stay updated with the latest trends, insights, and news from the
              real estate world
            </p>
          </motion.div>

          <PropertyNewsSection />
        </div>

        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-zinc-900 to-transparent z-10"></div>
      </section>

      <Footer />
    </main>);
}
