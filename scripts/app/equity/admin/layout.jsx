"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Users, FileCheck, LayoutDashboard, LogOut, Menu, X, Building2, Settings, Bell, } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
export default function AdminLayout({ children, }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [adminName, setAdminName] = useState("");
    useEffect(() => {
        // Fetch admin info
        const fetchAdminInfo = async () => {
            try {
                const response = await axios.get("/api/equity/admin/me");
                setAdminName(response.data.user.name);
            }
            catch (error) {
                router.push("/equity/admin/login");
            }
        };
        fetchAdminInfo();
    }, []);
    const handleLogout = async () => {
        try {
            await axios.post("/api/equity/admin/logout");
            toast.success("Logged out successfully");
            router.push("/equity/admin/login");
        }
        catch (error) {
            toast.error("Logout failed");
        }
    };
    const navigationItems = [
        {
            name: "Dashboard",
            href: "/equity/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "KYC Verification",
            href: "/equity/admin/kyc-verification",
            icon: FileCheck,
        },
        {
            name: "Users",
            href: "/equity/admin/users",
            icon: Users,
        },
        {
            name: "Properties",
            href: "/equity/admin/properties",
            icon: Building2,
        },
        {
            name: "Settings",
            href: "/equity/admin/settings",
            icon: Settings,
        },
    ];
    return (<div className="min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-40 h-screen w-64 bg-[#14141F]/80 backdrop-blur-xl border-r border-[#a78bfa]/20 hidden lg:block">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-center h-16 border-b border-[#a78bfa]/20">
            <h1 className="text-xl font-bold text-white">Admin Portal</h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (<Link key={item.name} href={item.href} className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive
                    ? "bg-[#a78bfa] text-white"
                    : "text-gray-400 hover:bg-[#a78bfa]/10 hover:text-white"}`}>
                  <item.icon className="w-5 h-5 mr-3"/>
                  {item.name}
                </Link>);
        })}
          </nav>

          <div className="p-4 border-t border-[#a78bfa]/20">
            <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all">
              <LogOut className="w-5 h-5 mr-3"/>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#14141F]/80 backdrop-blur-xl border-b border-[#a78bfa]/20">
        <div className="flex items-center justify-between px-4 h-16">
          <h1 className="text-xl font-bold text-white">Admin Portal</h1>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-400 hover:text-white">
            {isMobileMenuOpen ? (<X className="w-6 h-6"/>) : (<Menu className="w-6 h-6"/>)}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (<motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="fixed inset-0 z-20 lg:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}/>
            <nav className="absolute top-16 left-0 bottom-0 w-64 bg-[#14141F] border-r border-[#a78bfa]/20 p-4 space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (<Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive
                        ? "bg-[#a78bfa] text-white"
                        : "text-gray-400 hover:bg-[#a78bfa]/10 hover:text-white"}`}>
                    <item.icon className="w-5 h-5 mr-3"/>
                    {item.name}
                  </Link>);
            })}
            </nav>
          </motion.div>)}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-[#14141F]/80 backdrop-blur-xl border-b border-[#a78bfa]/20 hidden lg:block">
          <div className="flex items-center justify-between px-8 h-16">
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Welcome back,</span>
              <span className="text-white font-medium">{adminName}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white relative">
                <Bell className="w-5 h-5"/>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"/>
              </button>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                <LogOut className="w-5 h-5"/>
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 pt-20 lg:pt-8">{children}</div>
      </main>
    </div>);
}
