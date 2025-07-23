"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail } from "lucide-react";
import { toast } from "sonner";
import EquityFooter from "../EquityFooter";
import EquityAnimatedBackground from "../EquityAnimatedBackground";
export default function EquityProfile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
        else {
            toast.error("Please log in to access your profile.");
            router.push("/equity/auth?callbackUrl=/equity/profile");
        }
    }, [router]);
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        toast.success("Logged out successfully!");
        router.push("/equity/auth");
    };
    if (!user) {
        return (<div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <User className="w-12 h-12 mx-auto mb-4 text-[#a78bfa]"/>
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-transparent flex flex-col items-center justify-between px-4 py-0">
      <EquityAnimatedBackground />
      {/* Profile Hero Section */}
      <div className="w-full flex flex-col items-center pt-12 pb-8">
        <div className="relative flex flex-col items-center">
          {/* Avatar */}
          {user.image ? (<img src={user.image} alt={user.name} className="w-32 h-32 rounded-full border-4 border-[#a78bfa] object-cover shadow-lg mb-4"/>) : (<div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#6d28d9] flex items-center justify-center text-5xl font-bold text-white border-4 border-[#a78bfa] shadow-lg mb-4">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>)}
          {/* Name */}
          <h1 className="text-4xl font-extrabold text-white mb-2">{user.name || "User"}</h1>
          {/* Role Badge */}
          {user.role && (<span className="bg-[#a78bfa] text-black text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wide">{user.role}</span>)}
        </div>
      </div>
      {/* Email Card Only */}
      <div className="w-full max-w-md bg-black/70 border-2 border-[#a78bfa] rounded-3xl shadow-2xl shadow-[#a78bfa]/20 p-8 flex flex-col items-center mb-12 backdrop-blur-md">
        <h3 className="text-lg font-semibold text-[#a78bfa] flex items-center gap-2 mb-6">
          <User className="w-5 h-5"/> Contact Information
        </h3>
        <div className="flex items-center gap-2 text-gray-300 mb-2">
          <Mail className="w-4 h-4 text-[#a78bfa]"/>
          <span>{user.email}</span>
        </div>
      </div>
      {/* Footer */}
      <EquityFooter />
    </div>);
}
