import { Building, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
function Footer() {
    return (<footer className="bg-gradient-to-br w-full from-black via-gray-900 to-black text-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/5 rounded-full -mr-48 -mt-48"></div>
                <div className="absolute left-0 bottom-0 w-96 h-96 bg-orange-500/5 rounded-full -ml-48 -mb-48"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
            </div>

            <div className="container mx-auto px-6 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <div className="md:col-span-4">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Building className="w-6 h-6 text-white"/>
                            </div>
                            <h3 className="text-2xl font-bold text-white ml-4 bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                                MicroEstate
                            </h3>
                        </div>
                        <p className="mb-6 text-sm leading-relaxed text-gray-300">
                            Revolutionizing property management with AI-powered solutions.
                            Your trusted partner for seamless landlord-tenant relationships and efficient real estate operations.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="group h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 hover:text-white hover:bg-orange-500 transition-all duration-300 transform hover:scale-110">
                                <Facebook className="w-5 h-5"/>
                            </a>
                            <a href="#" className="group h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 hover:text-white hover:bg-orange-500 transition-all duration-300 transform hover:scale-110">
                                <Twitter className="w-5 h-5"/>
                            </a>
                            <a href="#" className="group h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 hover:text-white hover:bg-orange-500 transition-all duration-300 transform hover:scale-110">
                                <Instagram className="w-5 h-5"/>
                            </a>
                            <a href="#" className="group h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 hover:text-white hover:bg-orange-500 transition-all duration-300 transform hover:scale-110">
                                <Linkedin className="w-5 h-5"/>
                            </a>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="text-lg font-semibold mb-6 text-orange-400">Quick Links</h4>
                        <ul className="space-y-3">
                            {["Dashboard", "Properties", "Tenants", "Reports", "Settings"].map((item) => (<li key={item}>
                                    <Link href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm">
                                        {item}
                                    </Link>
                                </li>))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="text-lg font-semibold mb-6 text-orange-400">Services</h4>
                        <ul className="space-y-3">
                            {["Property Management", "Tenant Screening", "Rent Collection", "Maintenance", "Analytics"].map((item) => (<li key={item}>
                                    <Link href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm">
                                        {item}
                                    </Link>
                                </li>))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="text-lg font-semibold mb-6 text-orange-400">Support</h4>
                        <ul className="space-y-3">
                            {["Help Center", "Documentation", "API Reference", "Community", "Contact"].map((item) => (<li key={item}>
                                    <Link href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm">
                                        {item}
                                    </Link>
                                </li>))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="text-lg font-semibold mb-6 text-orange-400">Contact</h4>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                    <Mail className="w-4 h-4 text-orange-400"/>
                                </div>
                                <span className="text-gray-300 text-sm">info@microestate.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                    <Phone className="w-4 h-4 text-orange-400"/>
                                </div>
                                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-orange-400"/>
                                </div>
                                <span className="text-gray-300 text-sm">Delhi, India</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-orange-500/20">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm mb-4 md:mb-0">
                            © 2024 MicroEstate. All rights reserved. Powered by innovation.
                        </p>
                        <div className="flex space-x-6">
                            <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm">
                                Terms of Service
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </footer>);
}
export default Footer;
