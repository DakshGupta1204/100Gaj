"use client";
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface BackgroundVideoProps {
  className?: string;
}

export default function BackgroundVideo({ className = "" }: BackgroundVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation variables
    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      opacity: number;
      type: 'data' | 'chart' | 'grid';
    }> = [];

    // Create particles
    const createParticles = () => {
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          color: ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 4)],
          opacity: Math.random() * 0.5 + 0.1,
          type: ['data', 'chart', 'grid'][Math.floor(Math.random() * 3)] as 'data' | 'chart' | 'grid'
        });
      }
    };

    // Draw grid lines
    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = 0; x < canvas.width; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    // Draw data streams
    const drawDataStreams = () => {
      const streams = [
        { x: 0, y: canvas.height * 0.3, color: '#10b981' },
        { x: 0, y: canvas.height * 0.6, color: '#3b82f6' },
        { x: 0, y: canvas.height * 0.8, color: '#8b5cf6' }
      ];

      streams.forEach((stream, index) => {
        ctx.strokeStyle = stream.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3;
        
        ctx.beginPath();
        ctx.moveTo(stream.x, stream.y);
        
        for (let x = 0; x < canvas.width; x += 20) {
          const y = stream.y + Math.sin(x * 0.01 + Date.now() * 0.001 + index) * 30;
          ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      });
      
      ctx.globalAlpha = 1;
    };

    // Draw particles
    const drawParticles = () => {
      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;
        
        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        
        if (particle.type === 'data') {
          // Data point
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.type === 'chart') {
          // Chart bar
          ctx.fillRect(particle.x, particle.y, particle.size * 2, particle.size * 4);
        } else {
          // Grid point
          ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        }
        
        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const distance = Math.sqrt(
              Math.pow(particle.x - otherParticle.x, 2) + 
              Math.pow(particle.y - otherParticle.y, 2)
            );
            
            if (distance < 100) {
              ctx.strokeStyle = particle.color;
              ctx.lineWidth = 0.5;
              ctx.globalAlpha = (100 - distance) / 100 * 0.2;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });
      });
      
      ctx.globalAlpha = 1;
    };

    // Draw floating numbers (simulating stock prices)
    const drawFloatingNumbers = () => {
      const numbers = [
        { x: canvas.width * 0.1, y: canvas.height * 0.2, value: '₹12.5L', color: '#10b981' },
        { x: canvas.width * 0.8, y: canvas.height * 0.3, value: '+8.2%', color: '#3b82f6' },
        { x: canvas.width * 0.2, y: canvas.height * 0.7, value: '₹28.5K', color: '#8b5cf6' },
        { x: canvas.width * 0.7, y: canvas.height * 0.8, value: '31.5%', color: '#ec4899' }
      ];

      numbers.forEach((num, index) => {
        ctx.fillStyle = num.color;
        ctx.globalAlpha = 0.1;
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        
        const y = num.y + Math.sin(Date.now() * 0.001 + index) * 10;
        ctx.fillText(num.value, num.x, y);
      });
      
      ctx.globalAlpha = 1;
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawGrid();
      drawDataStreams();
      drawParticles();
      drawFloatingNumbers();
      
      animationId = requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
    </motion.div>
  );
} 