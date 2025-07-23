"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
export default function AdminLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        var _a, _b;
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/api/equity/admin/login", formData);
            if (response.data.success) {
                toast.success("Login successful!");
                router.push("/equity/admin/dashboard");
            }
        }
        catch (error) {
            toast.error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || "Login failed");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#a78bfa]/20 via-black to-black"/>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-[#14141F]/80 backdrop-blur-xl border-2 border-[#a78bfa] rounded-3xl p-8 shadow-2xl shadow-[#a78bfa]/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#a78bfa] to-[#9333ea] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white"/>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-400">Secure admin portal for 100Gaj Equity</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Input type="email" value={formData.email} onChange={(e) => setFormData(Object.assign(Object.assign({}, formData), { email: e.target.value }))} className="bg-black/50 border-[#a78bfa]/30 text-white pl-10 placeholder-gray-500" placeholder="admin@100gaj.com" required/>
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"/>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData(Object.assign(Object.assign({}, formData), { password: e.target.value }))} className="bg-black/50 border-[#a78bfa]/30 text-white pl-10 pr-10 placeholder-gray-500" placeholder="••••••••" required/>
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword ? (<EyeOff className="w-4 h-4"/>) : (<Eye className="w-4 h-4"/>)}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#a78bfa] to-[#9333ea] hover:from-[#9333ea] hover:to-[#a78bfa] text-white py-6">
              {loading ? "Authenticating..." : "Login to Admin Portal"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              This is a secure area. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </motion.div>
    </div>);
}
