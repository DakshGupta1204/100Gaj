"use client";

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, Building, Users, FileText } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        { name: "home", path: "/microestate", icon: Home },
        { name: "properties", path: "/microestate/properties", icon: Building },
        { name: "landlords", path: "/microestate/landlord", icon: Users },
        { name: "tenants", path: "/microestate/tenant", icon: FileText },
    ];

    const isActive = (path: string) => pathname === path;

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    if (pathname.includes('/microestate/auth')) {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#101014] shadow-lg border-b border-[#23232a]">
            <div className="container mx-auto px-8 py-3 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-3 mr-8">
                    <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-wide">microestate</span>
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex items-center space-x-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => router.push(item.path)}
                                    className={cn(
                                "flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all duration-200",
                                        isActive(item.path)
                                    ? "bg-orange-500 text-white shadow-md"
                                    : "text-white hover:bg-orange-500/10 hover:text-orange-400"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="capitalize">{item.name}</span>
                                </button>
                            ))}
                </div>

                {/* CTA Button */}
                <div className="hidden md:block ml-8">
                            <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg px-6 py-2 shadow-md transition-all duration-200"
                        onClick={() => router.push("/microestate/auth")}
                            >
                                let&apos;s talk
                            </Button>
                        </div>
            </div>
        </nav>
    );
};

export default Navbar;