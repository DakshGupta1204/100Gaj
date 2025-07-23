"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface NavItem {
  label: string;
  href: string;
}

export const SubNavbar = ({ items }: { items: NavItem[] }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Make navbar visible after scrolling past the hero section
      if (window.scrollY > window.innerHeight * 0.5) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Update active section based on scroll position
      const sections = items.map((item) => {
        const sectionId = item.href.replace('#', '');
        return document.getElementById(sectionId);
      });

      const currentSection = sections.findIndex((section) => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSection !== -1) {
        setActiveSection(items[currentSection].href);
      } else if (window.scrollY < window.innerHeight * 0.5) {
        // If at the top of the page, set Home as active
        setActiveSection('#home');
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const scrollToSection = (href: string) => {
    const sectionId = href.replace('#', '');
    const element = document.getElementById(sectionId);
    
    if (element) {
      // Special case for home - scroll to top
      if (href === '#home') {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      } else {
        const offset = 100; // Adjust offset based on your header/navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
      
      // Update active section
      setActiveSection(href);
    }
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 hidden md:flex justify-center items-center pb-4 md:pb-6 pointer-events-none"
      initial={{ y: 100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : 100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-black/60 backdrop-blur-lg rounded-full shadow-lg border border-white/20 px-2 py-1.5 pointer-events-auto">
        <div className="flex space-x-1 relative">
          {items.map((item) => (
            <button
              key={item.href}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                activeSection === item.href
                  ? "text-white"
                  : "text-orange-400 hover:text-orange-500"
              }`}
              onClick={() => scrollToSection(item.href)}
            >
              {activeSection === item.href && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full -z-10"
                  layoutId="indicator"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}; 