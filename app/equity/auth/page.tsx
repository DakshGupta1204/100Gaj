"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle, CheckCircle, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import EquityNavigation from "../components/EquityNavigation";
import BackgroundVideo from "../components/BackgroundVideo";
import EquityAnimatedBackground from "../EquityAnimatedBackground";
// Removed Dialog imports

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const toastShownRef = useRef(false);

  useEffect(() => {
    // Show toast message only once when redirected from post property
    if (callbackUrl?.includes("postproperty") && !toastShownRef.current) {
      toast.info("Please login to post a property");
      toastShownRef.current = true;
    }
  }, [callbackUrl]);

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "investor",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<0 | 1 | 2 | 3 | 4>(0);
// Removed verification modal state
// Removed OTP modal state

  const loginFields = [
    {
      id: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter your email",
      value: formData.email,
      required: true,
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      value: formData.password,
      required: true,
      hasToggle: true,
    },
  ];

  const signupFields = [
    {
      id: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
      value: formData.name,
      required: true,
    },
    {
      id: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter your email",
      value: formData.email,
      required: true,
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "Create a strong password",
      value: formData.password,
      required: true,
      hasToggle: true,
      showStrength: true,
    },
  ];

  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[a-z]/.test(formData.password)) strength++;
    if (/\d/.test(formData.password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) strength++;

    setPasswordStrength(Math.min(4, strength) as 0 | 1 | 2 | 3 | 4);
  }, [formData.password]);

  const getPasswordStrengthColor = (level: number) => {
    const colors = [
      "bg-red-500",
      "bg-[#a78bfa]",
      "bg-yellow-500",
      "bg-green-400",
      "bg-green-500",
    ];
    return colors[level] || "bg-gray-600";
  };

  const getPasswordStrengthLabel = (level: number) => {
    const labels = ["Very weak", "Weak", "Medium", "Strong", "Very strong"];
    return labels[level] || "";
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("/api/equity/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      const { success, token, user, error } = response.data;
      if (success && token) {
        document.cookie = `authToken=${token}; path=/; secure; samesite=strict`;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true");
        toast.success("Successfully logged in!");
        router.push("/equity/postproperty");
      } else {
        throw new Error(error || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMsg = error.response?.data?.error || error.message || "Invalid email or password";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, email, and password are required");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await axios.post("/api/equity/auth/signup", formData);

      if (response.data.success) {
        setSuccess("Account created successfully! Please check your email for verification.");
        setActiveTab("login");
        toast.success("Account created! Please verify your email.");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Signup failed. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

// Removed handleVerifyEmail and related logic

// Removed handleVerifyOtp and related logic

  const renderInputField = (field: any) => (
    <div key={field.id} className="group">
      <Label className="text-gray-300 text-sm font-medium mb-2 block">
        {field.label}
      </Label>
      <div className="relative">
        <Input
          type={field.hasToggle ? (showPassword ? "text" : "password") : field.type}
          value={field.value}
          onChange={(e) => handleInputChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm bg-transparent text-white placeholder-gray-500 border-[#a78bfa]/30 focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa] transition-colors duration-200"
        />
        {field.hasToggle && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#a78bfa] transition-colors duration-200 hover:bg-transparent h-auto"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </Button>
        )}
      </div>

      {field.showStrength && formData.password && (
        <div className="mt-2 animate-fadeIn">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-400">Password strength:</span>
            <span
              className={`text-xs font-medium ${
                passwordStrength === 0
                  ? "text-red-400"
                  : passwordStrength === 1
                  ? "text-[#a78bfa]"
                  : passwordStrength === 2
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {getPasswordStrengthLabel(passwordStrength)}
            </span>
          </div>
          <div className="w-full flex space-x-1">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  bar <= passwordStrength
                    ? getPasswordStrengthColor(passwordStrength)
                    : "bg-gray-700"
                }`}
              />
            ))}
          </div>
          <div className="mt-2 space-y-1 text-xs text-gray-400">
            <p>• At least 8 characters • Mix of letters and numbers</p>
            <p>• At least 1 special character • Upper and lowercase letters</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Video Background */}
      <BackgroundVideo />
      {/* Animated SVG Background */}
      <EquityAnimatedBackground />
      
      {/* Navigation */}
      <EquityNavigation />

      {/* Main Content */}
      <div className="pt-20 relative z-10">
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="bg-[#14141F]/80 backdrop-blur-xl border-2 border-[#a78bfa] rounded-3xl shadow-2xl shadow-[#a78bfa]/20 overflow-hidden transform transition-all duration-300 hover:shadow-[#a78bfa]/30">
            <div className="relative px-8 py-6 bg-gradient-to-r from-[#a78bfa]/10 to-[#a78bfa]/5">
              <div className="absolute inset-0 bg-gradient-to-r from-[#a78bfa]/5 to-[#a78bfa]/5"></div>
              <div className="relative flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#a78bfa] to-[#a78bfa] rounded-2xl flex items-center justify-center shadow-lg shadow-[#a78bfa]/30">
                  <Building className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-[#a78bfa] to-[#a78bfa] bg-clip-text text-transparent mb-2">
                Welcome to 100 GAJ Equity
              </h2>
              <p className="text-center text-gray-300 text-sm">
                Your gateway to real estate investment opportunities
              </p>
            </div>

            <div className="p-6">
              {/* Tabs */}
              <div className="flex mb-6 bg-black/50 rounded-2xl p-1 backdrop-blur-sm border border-[#a78bfa]/20">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("login")}
                  className={`flex-1 py-2 px-4 text-center font-semibold rounded-xl transition-all duration-300 h-auto hover:bg-transparent ${
                    activeTab === "login"
                      ? "bg-gradient-to-r from-[#a78bfa] to-[#a78bfa] text-white shadow-lg shadow-[#a78bfa]/30 transform scale-105"
                      : "text-gray-400 hover:text-[#a78bfa]"
                  }`}
                >
                  Sign in
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("signup")}
                  className={`flex-1 py-2 px-4 text-center font-semibold rounded-xl transition-all duration-300 h-auto hover:bg-transparent ${
                    activeTab === "signup"
                      ? "bg-gradient-to-r from-[#a78bfa] to-[#a78bfa] text-white shadow-lg shadow-[#a78bfa]/30 transform scale-105"
                      : "text-gray-400 hover:text-[#a78bfa]"
                  }`}
                >
                  New account
                </Button>
              </div>

              {/* Alerts */}
              {error && (
                <Alert className="mb-4 p-3 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm backdrop-blur-sm">
                  <AlertCircle size={16} />
                  <AlertDescription className="ml-2">{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="mb-4 p-3 rounded-2xl border border-green-500/20 bg-green-500/10 text-green-400 text-sm backdrop-blur-sm">
                  <CheckCircle size={16} />
                  <AlertDescription className="ml-2">{success}</AlertDescription>
                </Alert>
              )}

              {/* Login Form */}
              {activeTab === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-4">
                    {loginFields.map(renderInputField)}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 bg-gradient-to-r from-[#a78bfa] to-[#a78bfa] hover:from-[#a78bfa]/90 hover:to-[#a78bfa]/90 text-white font-bold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg shadow-[#a78bfa]/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none h-auto"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              )}

              {/* Signup Form */}
              {activeTab === "signup" && (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-4">
                    {signupFields.map(renderInputField)}
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="isInvestor"
                      checked={formData.role === "investor"}
                      onCheckedChange={(checked) =>
                        handleInputChange("role", checked ? "investor" : "owner")
                      }
                      className="w-4 h-4 rounded border-2 border-[#a78bfa]/40 text-[#a78bfa] focus:ring-[#a78bfa]/50 bg-black/50"
                    />
                    <Label
                      htmlFor="isInvestor"
                      className="text-gray-300 text-sm cursor-pointer"
                    >
                      I want to invest in properties
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 bg-gradient-to-r from-[#a78bfa] to-[#a78bfa] hover:from-[#a78bfa]/90 hover:to-[#a78bfa]/90 text-white font-bold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg shadow-[#a78bfa]/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none h-auto"
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </Button>

                  <p className="text-xs text-gray-400 text-center">
                    By submitting, I accept 100 GAJ&apos;s{" "}
                    <a href="#" className="text-[#a78bfa] hover:text-[#a78bfa]/80">
                      terms of use
                    </a>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
}