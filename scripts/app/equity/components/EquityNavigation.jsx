"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Building2, Target, BarChart3, Menu, X, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
export default function EquityNavigation() {
    const { data: session } = useSession();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const pathname = usePathname();
    // Check authentication status on component mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const authStatus = localStorage.getItem("isAuthenticated");
            setIsAuthenticated(authStatus === "true");
        }
    }, []);
    const navItems = [
        { href: "/equity", label: "Dashboard", icon: Home },
        { href: "/equity/property", label: "Properties", icon: Building2 },
        { href: "/equity/portfolio", label: "Portfolio", icon: Target },
        { href: "/equity/dashboard", label: "Analytics", icon: BarChart3 },
        { href: "/equity/postproperty", label: "Post Property", icon: Building2 },
    ];
    const handlePostPropertyClick = () => {
        if (!isAuthenticated) {
            // Redirect to auth page with callback URL
            router.push(`/equity/auth?callbackUrl=${encodeURIComponent("/equity/postproperty")}`);
            return;
        }
        router.push("/equity/postproperty");
    };
    const handleLogout = async () => {
        try {
            // Clear all authentication data
            localStorage.removeItem("isAuthenticated");
            sessionStorage.removeItem("authToken");
            sessionStorage.removeItem("user");
            // Clear auth cookie
            document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            // Update authentication state
            setIsAuthenticated(false);
            setShowUserMenu(false);
            // Show success message and redirect
            toast.success("Successfully logged out!");
            router.push("/equity");
        }
        catch (error) {
            console.error("Logout error:", error);
            toast.error("Error during logout. Please try again.");
        }
    };
    return (<>
      {/* Horizontal Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-[#a78bfa]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#a78bfa] rounded-lg flex items-center justify-center mr-3">
                <Building2 className="w-5 h-5 text-white"/>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg">100Gaj</span>
                <span className="text-gray-300 text-xs">Equity Platform</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (<Link key={item.href} href={item.href} onClick={item.href === "/equity/postproperty" ? handlePostPropertyClick : undefined} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive
                    ? "bg-[#a78bfa] text-white"
                    : "text-gray-300 hover:text-white hover:bg-[#a78bfa]/20 hover:border hover:border-[#a78bfa]/30"}`}>
                    <item.icon className="w-4 h-4"/>
                    <span className="font-medium">{item.label}</span>
                  </Link>);
        })}

              {/* User Menu */}
              {isAuthenticated && (<div className="relative">
                  <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-gray-300 hover:text-white hover:bg-[#a78bfa]/20 hover:border hover:border-[#a78bfa]/30">
                    <User className="w-4 h-4"/>
                    <span className="font-medium">Account</span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (<div className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-sm border border-[#a78bfa]/30 rounded-lg shadow-lg py-1 z-50">
                      <button onClick={() => {
                    setShowUserMenu(false);
                    router.push('/equity/profile');
                }} className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-[#a78bfa]/20 transition-all duration-200">
                        <User className="w-4 h-4"/>
                        <span>Profile</span>
                      </button>
                      <button onClick={handleLogout} className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-[#a78bfa]/20 transition-all duration-200">
                        <LogOut className="w-4 h-4"/>
                        <span>Logout</span>
                      </button>
                    </div>)}
                </div>)}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-white p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
                {mobileOpen ? (<X className="w-6 h-6"/>) : (<Menu className="w-6 h-6"/>)}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-black/95 backdrop-blur-sm border-t border-[#a78bfa]/30">
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (<Link key={item.href} href={item.href} onClick={item.href === "/equity/postproperty"
                        ? (e) => {
                            setMobileOpen(false);
                            handlePostPropertyClick();
                        }
                        : () => setMobileOpen(false)} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                        ? "bg-[#a78bfa]/10 text-[#a78bfa] border border-[#a78bfa]/30"
                        : "text-gray-300 hover:text-white hover:bg-[#a78bfa]/10"}`}>
                      <item.icon className="w-5 h-5"/>
                      <span className="font-medium">{item.label}</span>
                    </Link>);
            })}

                {/* Mobile Logout Button */}
                {isAuthenticated && (<button onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                }} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-300 hover:text-white hover:bg-[#a78bfa]/10">
                    <LogOut className="w-5 h-5"/>
                    <span className="font-medium">Logout</span>
                  </button>)}
              </div>
            </motion.div>)}
        </AnimatePresence>

        {/* Overlay for mobile menu */}
        {mobileOpen && (<div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu overlay"/>)}
      </nav>
    </>);
}
