'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ChevronUp, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface PremiumFeature {
  title: string;
  description: string;
}

const features: PremiumFeature[] = [
  {
    title: 'Exclusive Listings',
    description: 'Access to premium properties not available to regular users'
  },
  {
    title: 'Advanced Filters',
    description: 'Use powerful search filters to find your perfect property'
  },
  {
    title: 'Priority Support',
    description: '24/7 dedicated customer support for all your queries'
  }
];

// For the floating particles effect
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));
};

export default function PremiumPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [particles] = useState(() => generateParticles(15));
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle user interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };

    // Add event listeners for user interaction
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted]);

  // Show popup after 10 seconds of user interaction
  useEffect(() => {
    if (hasInteracted && !isOpen && !isMinimized) {
      timerRef.current = setTimeout(() => {
        setIsOpen(true);
      }, 10000); // 10 seconds
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [hasInteracted, isOpen, isMinimized]);

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(true);
  };

  const handleMinimize = () => {
    setIsOpen(false);
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.5,
      }
    })
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div 
              className="bg-gray-900 border border-orange-500 rounded-lg shadow-xl max-w-md w-full overflow-hidden relative"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(_e) => _e.stopPropagation()}
            >
              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-orange-500 opacity-40"
                    style={{
                      width: particle.size,
                      height: particle.size,
                      left: `${particle.x}%`,
                      top: `${particle.y}%`,
                    }}
                    animate={{
                      x: [0, Math.random() * 100 - 50],
                      y: [0, Math.random() * -100],
                      opacity: [0.4, 0],
                    }}
                    transition={{
                      duration: particle.duration,
                      delay: particle.delay,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  />
                ))}
              </div>

              <div className="relative overflow-hidden">
                {/* Decorative header with gradient animation */}
                <motion.div 
                  className="h-24 bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-400"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                />
                
                {/* Control buttons */}
                <div className="absolute top-4 right-4 flex">
                  <button 
                    onClick={handleMinimize} 
                    className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white mr-2 transition-colors"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button 
                    onClick={handleClose} 
                    className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {/* Premium icon with pulse animation */}
                <motion.div
                  className="absolute top-12 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-gray-900 p-4 rounded-full border-2 border-orange-500"
                  initial={{ y: '50%' }}
                  animate={{ y: ['50%', '55%', '50%'] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        '0 0 0 0 rgba(249, 115, 22, 0.4)',
                        '0 0 0 10px rgba(249, 115, 22, 0)',
                        '0 0 0 0 rgba(249, 115, 22, 0)'
                      ]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="rounded-full"
                  >
                    <Sparkles className="h-8 w-8 text-orange-500" />
                  </motion.div>
                </motion.div>
              </div>
              
              <div className="px-6 pt-16 pb-6">
                <motion.h3 
                  className="text-xl font-semibold text-center text-orange-500 mb-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Upgrade to Premium
                </motion.h3>
                
                <motion.p 
                  className="text-gray-400 text-center mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Unlock exclusive features and get the most out of 100Gaj
                </motion.p>
                
                <div className="space-y-4 mb-6">
                  {features.map((feature, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start"
                      custom={index}
                      variants={featureVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <motion.div 
                          className="h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Check className="h-3 w-3 text-black" />
                        </motion.div>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-white font-medium">{feature.title}</h4>
                        <p className="text-sm text-gray-400">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  className="text-center mb-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="text-gray-400 text-sm">Starting at</span>
                  <div className="flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">₹499</span>
                    <span className="text-gray-400 ml-1">/month</span>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold group relative overflow-hidden"
                    onClick={() => window.location.href = '/subscription'}
                  >
                    <span className="relative z-10 flex items-center">
                      Upgrade Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <motion.span
                      className="absolute inset-0 bg-orange-400"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ type: 'tween' }}
                    />
                  </Button>
                </motion.div>
                
                <motion.div 
                  className="mt-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <button 
                    className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                    onClick={handleMinimize}
                  >
                    Maybe later
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized floating button */}
      <AnimatePresence>
        {isMinimized && !isOpen && (
          <motion.button
            className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-black rounded-full p-3 shadow-lg flex items-center gap-2 z-40 group"
            onClick={handleMaximize}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap">
              Premium
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
} 