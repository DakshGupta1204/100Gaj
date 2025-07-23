"use client";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building, Users, FileText, Shield, TrendingUp, Clock, Mail } from "lucide-react";
import { FloatingCircles, ParticleBackground } from "../_components/Background";
function Page() {
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    useEffect(() => {
        // Dynamically import GSAP to avoid SSR issues
        import("gsap").then((gsap) => {
            const tl = gsap.default.timeline();
            tl.fromTo(".hero-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
                .fromTo(".hero-subtitle", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
                .fromTo(".hero-form", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.3");
            gsap.default.set(".feature-card", { opacity: 0, y: 30 });
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.default.to(entry.target, {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            ease: "power3.out",
                            delay: parseFloat(entry.target.getAttribute("data-delay") || "0")
                        });
                    }
                });
            });
            document.querySelectorAll(".feature-card").forEach((card, index) => {
                card.setAttribute("data-delay", (index * 0.1).toString());
                observer.observe(card);
            });
            return () => observer.disconnect();
        });
    }, []);
    const features = [
        {
            icon: Building,
            title: "Property Management",
            description: "Efficiently manage all your properties from a single dashboard with real-time updates."
        },
        {
            icon: Users,
            title: "Tenant Portal",
            description: "Provide tenants with easy access to lease documents, payments, and maintenance requests."
        },
        {
            icon: FileText,
            title: "Document Management",
            description: "Store and organize all lease agreements, contracts, and important documents securely."
        },
        {
            icon: Shield,
            title: "Secure Platform",
            description: "Bank-level security ensures your data and transactions are always protected."
        },
        {
            icon: TrendingUp,
            title: "Analytics & Reports",
            description: "Get insights into your portfolio performance with detailed analytics and reports."
        },
        {
            icon: Clock,
            title: "24/7 Support",
            description: "Round-the-clock support to help you manage your real estate operations smoothly."
        }
    ];
    return (<div className="min-h-screen bg-gradient-to-br from-[#181c24] to-[#101014] relative overflow-hidden">
            <FloatingCircles />

            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 bg-transparent">
                <ParticleBackground />

                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <div className="relative">
                            <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                                Elevate Your{" "}
                                <span className="relative">
                                    <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                                        Real Estate
                                    </span>
                                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 to-red-500 rounded-full opacity-60"></div>
                                </span>{" "}
                                Experience
                            </h1>

                            <div className="absolute -top-8 -left-8 w-4 h-4 bg-orange-400 rounded-full opacity-60 animate-bounce"></div>
                            <div className="absolute -top-4 -right-12 w-3 h-3 bg-orange-500 rounded-full opacity-80 animate-bounce delay-300"></div>
                            <div className="absolute -bottom-6 left-1/4 w-2 h-2 bg-orange-300 rounded-full opacity-70 animate-bounce delay-700"></div>
                        </div>

                        <p className="hero-subtitle text-lg md:text-xl text-white mb-4 max-w-3xl mx-auto leading-relaxed">
                            Streamline property management with our all-in-one platform. Manage properties, leases, and payments with ease while providing exceptional experiences for both{" "}
                            <span className="text-orange-400 font-semibold">landlords</span> and{" "}
                            <span className="text-orange-400 font-semibold">tenants</span>.
                        </p>

                        <div className="hero-form flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-16">
                            <div className="relative flex-1 group">
                                <Input placeholder="Enter your email address" className="w-full h-14 bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-2 border-orange-500/20 backdrop-blur-md text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-500 px-6 rounded-2xl shadow-xl hover:shadow-orange-500/20 focus:shadow-orange-500/30 text-lg group-hover:border-orange-500/40"/>
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"></div>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-sm pointer-events-none"></div>
                            </div>

                            <Button className="relative h-14 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-500 hover:to-red-400 text-white font-bold px-8 rounded-2xl shadow-xl hover:shadow-orange-500/40 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 border border-orange-500/30 overflow-hidden group" onClick={() => { }}>
                                <span className="relative z-10 flex items-center gap-2 text-lg">
                                    <Mail className="w-5 h-5"/>
                                    Say Hello
                                </span>

                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-300 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

                                <div className="absolute inset-0 bg-orange-400/20 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Button variant="outline" size="lg" onClick={() => { }} className="group relative w-full sm:w-auto border-2 border-orange-500/40 text-orange-500 px-10 py-7 rounded-2xl font-bold text-lg transition-all duration-700 overflow-hidden backdrop-blur-sm shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-2 hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out origin-left rounded-2xl"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                                <div className="absolute inset-0 border-2 border-orange-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg shadow-orange-500/50"></div>
                                <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-700">
                                    <Building className="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-500"/>
                                    <span>Landlord Dashboard</span>
                                </span>

                                <div className="absolute top-2 right-2 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
                                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-orange-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-700"></div>
                            </Button>

                            <Button variant="outline" size="lg" onClick={() => { }} className="group relative w-full sm:w-auto border-2 border-orange-400/40 text-orange-400 px-10 py-7 rounded-2xl font-bold text-lg transition-all duration-700 overflow-hidden backdrop-blur-sm shadow-lg hover:shadow-orange-400/30 transform hover:-translate-y-2 hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out origin-right rounded-2xl"></div>

                                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-orange-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                                <div className="absolute inset-0 border-2 border-orange-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg shadow-orange-400/50"></div>

                                <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-700">
                                    <Users className="w-6 h-6 transform group-hover:-rotate-12 transition-transform duration-500"/>
                                    <span>Tenant Portal</span>
                                </span>

                                <div className="absolute top-2 left-2 w-2 h-2 bg-orange-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
                                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-700"></div>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section ref={featuresRef} className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {features.map((feature, idx) => (<div key={feature.title} className="feature-card min-h-[260px] min-w-[320px] flex-1 bg-[#23232a] bg-opacity-80 rounded-2xl shadow-lg border border-orange-500/10 p-8 flex flex-col items-center text-center backdrop-blur-md transition-all duration-300 overflow-hidden hover:scale-105 hover:-translate-y-2 hover:border-orange-400 hover:shadow-orange-400/30">
                                <div className="w-14 h-14 flex items-center justify-center rounded-full mb-6 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                                            <feature.icon className="w-8 h-8 text-white"/>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-300">{feature.description}</p>
                            </div>))}
                    </div>
                </div>
            </section>


            <section className="relative z-10 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/5 via-transparent to-orange-400/5"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="w-full px-6 py-24 text-center relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            <h2 className="text-4xl md:text-6xl font-bold mb-8">
                                Ready to{" "}
                                <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 bg-clip-text text-transparent">
                                    Transform
                                </span>{" "}
                                Your Real Estate Business?
                            </h2>
                            <div className="absolute -top-4 -right-8 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                            <div className="absolute -bottom-4 -left-6 w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-500"></div>
                        </div>

                        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                            Join thousands of landlords and tenants who trust{" "}
                            <span className="text-orange-400 font-semibold">MicroEstate</span>{" "}
                            for their property management needs.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button size="lg" className="group relative bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold px-10 py-6 text-lg rounded-2xl shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-orange-500/20 overflow-hidden" onClick={() => { }}>
                                <span className="relative z-10 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6"/>
                                    Get Started Today
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-white/20 rounded-full group-hover:scale-125 transition-transform duration-500 opacity-80"></div>
                            </Button>

                            <Button variant="outline" size="lg" onClick={() => { }} className="group relative border-2 border-orange-500/30 text-orange-500 hover:bg-orange-500/10 hover:border-orange-500 px-10 py-6 text-lg rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-1">
                                <span className="relative z-10 flex items-center gap-2">
                                    <Clock className="w-6 h-6"/>
                                    Schedule Demo
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

        </div>);
}
;
export default Page;
