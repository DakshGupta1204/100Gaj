"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, FileText, CreditCard, User, Menu, Users, Building, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import Image from "next/image";

const navLinks = [
  { href: "/microestate/landlord", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
  { href: "/microestate/landlord/properties", label: "Properties", icon: <Building className="w-4 h-4" /> },
  { href: "/microestate/landlord/tenants", label: "Tenants", icon: <Users className="w-4 h-4" /> },
];

export default function LandlordNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = { name: "Amit Verma", avatar: "" };
  const initial = user.name ? user.name[0] : "L";

  React.useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      const dropdown = document.getElementById("profile-dropdown");
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      // Clear microestate-specific storage
      localStorage.removeItem("microestate_user");
      localStorage.removeItem("userRole");
      
      // Clear main platform authentication as well
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("authToken");
        localStorage.removeItem("authToken");
        document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }

      // Sign out from NextAuth
      await signOut({
        redirect: false,
        callbackUrl: "/microestate",
      });
      
      // Dispatch custom logout event for other components
      window.dispatchEvent(new CustomEvent("userLogout"));

      // Redirect to microestate home
      router.push("/microestate");
      toast.success("You have been logged out.");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout");
      // Still redirect even if there's an error
      router.push("/microestate");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#181c24] border-b border-[#23232a] shadow-lg flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 transition-all duration-300 min-h-[60px] sm:min-h-[68px]">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <button className="lg:hidden flex-shrink-0" onClick={() => setDrawerOpen(!drawerOpen)} aria-label="Open menu">
            <Menu className="w-6 h-6 sm:w-7 sm:h-7 text-orange-400" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <Image 
              src="/logoSettle.png" 
              alt="Settle Logo" 
              width={56} 
              height={56}
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-contain flex-shrink-0"
            />
          </div>
          <span className="ml-1 sm:ml-3 text-xs sm:text-sm font-semibold text-orange-200 bg-orange-500/10 px-2 sm:px-3 py-1 rounded-lg hidden md:inline whitespace-nowrap">Landlord Portal</span>
        </div>
        <div className="hidden lg:flex gap-2 xl:gap-4 ml-4 xl:ml-8 items-center">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 lg:px-6 xl:px-7 py-2 lg:py-3 rounded-full font-bold text-sm lg:text-base xl:text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 whitespace-nowrap
                  ${isActive ? "bg-[#23232a] text-orange-400 shadow-md border border-orange-400" : "bg-transparent text-white/80 hover:bg-[#23232a]/80 hover:text-orange-400"}
                `}
                style={{ boxShadow: isActive ? "0 2px 16px 0 #ff990033" : undefined }}
              >
                {link.icon}
                <span className="hidden xl:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Settle Home Button */}
          <button
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2 rounded-full bg-orange-500/10 border border-orange-400/40 text-orange-400 hover:bg-orange-500/20 hover:border-orange-400 transition-all duration-200 font-medium text-xs sm:text-sm lg:text-base"
            onClick={() => router.push("/microestate")}
            aria-label="Go to Settle Home"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Settle</span>
          </button>
          
          {/* Avatar with tooltip */}
          <div className="relative group">
            <button
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-[#23232a] border border-orange-400/40 shadow hover:bg-orange-500/10 transition-all"
              aria-label="Landlord Profile"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full object-cover" />
              ) : (
                <span className="text-white font-bold text-sm sm:text-lg lg:text-xl">{initial}</span>
              )}
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-black/80 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">Landlord Profile</span>
            {/* Dropdown menu */}
            {dropdownOpen && (
              <div
                id="profile-dropdown"
                className="absolute right-0 mt-3 w-40 sm:w-44 bg-[#181c24] border border-orange-500/20 rounded-xl shadow-2xl z-50 py-2 flex flex-col animate-fadeIn"
              >
                <button
                  className="w-full text-left px-4 sm:px-5 py-2 text-sm sm:text-base text-white hover:bg-orange-500/20 hover:text-orange-400 rounded-t-xl transition-colors"
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push("/microestate/landlord/profile");
                  }}
                >
                  Profile
                </button>
                <button
                  className="w-full text-left px-4 sm:px-5 py-2 text-sm sm:text-base text-white hover:bg-orange-500/20 hover:text-orange-400 rounded-b-xl transition-colors"
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl flex flex-col lg:hidden">
            <div className="flex flex-col gap-3 sm:gap-4 p-6 sm:p-8 pt-20">
              {navLinks.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 sm:px-6 py-3 rounded-full font-semibold text-base sm:text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400
                      ${isActive ? "bg-[#23232a] text-orange-400 shadow-md border border-orange-400" : "bg-transparent text-white/80 hover:bg-[#23232a]/80 hover:text-orange-400"}
                    `}
                    style={{ boxShadow: isActive ? "0 2px 16px 0 #ff990033" : undefined }}
                    onClick={() => setDrawerOpen(false)}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
      {/* Glass/blur separator */}
    </>
  );
} 