"use client";
import React, { useEffect, useRef } from 'react';
const ParticleBackground = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        let animationFrameId;
        let particles = [];
        const colors = [
            'hsl(20, 100%, 60%)',
            'hsl(0, 100%, 70%)',
            'hsl(200, 100%, 70%)',
            'hsl(20, 100%, 80%)',
            'hsl(200, 100%, 85%)',
        ];
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        const createParticles = () => {
            particles = [];
            const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000));
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.2,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.02 + 0.01,
                });
            }
        };
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach((otherParticle) => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 150) {
                        const opacity = (150 - distance) / 150 * 0.15;
                        const connectionGradient = ctx.createLinearGradient(particle.x, particle.y, otherParticle.x, otherParticle.y);
                        connectionGradient.addColorStop(0, particle.color.replace('hsl', 'hsla').replace(')', `, ${opacity})`));
                        connectionGradient.addColorStop(0.5, 'hsla(200, 100%, 70%, ' + opacity * 0.8 + ')');
                        connectionGradient.addColorStop(1, otherParticle.color.replace('hsl', 'hsla').replace(')', `, ${opacity})`));
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = connectionGradient;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            });
            particles.forEach((particle) => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.pulse += particle.pulseSpeed;
                if (particle.x < 0)
                    particle.x = canvas.width;
                if (particle.x > canvas.width)
                    particle.x = 0;
                if (particle.y < 0)
                    particle.y = canvas.height;
                if (particle.y > canvas.height)
                    particle.y = 0;
                const pulseOpacity = particle.opacity * (0.7 + 0.3 * Math.sin(particle.pulse));
                const glowSize = particle.size * (1 + 0.3 * Math.sin(particle.pulse));
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
                ctx.fillStyle = particle.color.replace('hsl', 'hsla').replace(')', `, ${pulseOpacity})`);
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animate);
        };
        resizeCanvas();
        createParticles();
        animate();
        const handleResize = () => {
            resizeCanvas();
            createParticles();
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    return (<canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" style={{ background: "transparent" }}/>);
};
const FloatingCircles = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        let animationFrameId;
        let circles = [];
        const colors = [
            'hsl(20, 100%, 60%)',
            'hsl(200, 100%, 70%)',
        ];
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        const createCircles = () => {
            circles = [];
            const circleCount = 15;
            for (let i = 0; i < circleCount; i++) {
                circles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 40 + 10,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    opacity: Math.random() * 0.1 + 0.05,
                });
            }
        };
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            circles.forEach((circle) => {
                circle.x += circle.vx;
                circle.y += circle.vy;
                if (circle.x < -circle.radius)
                    circle.x = canvas.width + circle.radius;
                if (circle.x > canvas.width + circle.radius)
                    circle.x = -circle.radius;
                if (circle.y < -circle.radius)
                    circle.y = canvas.height + circle.radius;
                if (circle.y > canvas.height + circle.radius)
                    circle.y = -circle.radius;
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
                ctx.fillStyle = circle.color.replace('hsl', 'hsla').replace(')', `, ${circle.opacity})`);
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animate);
        };
        resizeCanvas();
        createCircles();
        animate();
        const handleResize = () => {
            resizeCanvas();
            createCircles();
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    return (<canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }}/>);
};
export default ParticleBackground;
export { FloatingCircles, ParticleBackground };
