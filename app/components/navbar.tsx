"use client";
import Link from "next/link";
import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  User2,
  Building2,
  Headset,
  Info,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import GoogleLoginButton from "./GoogleLoginButton";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [currentView, setCurrentView] = useState<
    "main" | "forgot-password" | "verify-email"
  >("main");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for auth errors in URL parameters and auth token
  useEffect(() => {
    // Check for error parameters
    const url = new URL(window.location.href);
    const errorParam = url.searchParams.get("error");
    // const callbackUrl = url.searchParams.get('callbackUrl');

    if (errorParam) {
      // Open auth modal if there's an error
      // setIsAuthModalOpen(true); // Removed AuthModal state
      setActiveTab("login");

      // Handle specific OAuth errors
      if (errorParam === "OAuthAccountNotLinked") {
        setError(
          "Google account not linked. If this is your first time signing in, please try signing up first. If you have previously used another sign-in method (like email/password), please use that method.",
        );
        toast.error(
          "Google account not linked. Try signing up first or use your original sign-in method.",
        );
      } else {
        setError("An error occurred during sign in. Please try again.");
        toast.error("Authentication error. Please try again.");
      }

      // Clean up URL by removing error parameters
      if (typeof window !== "undefined") {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }

    // Check for auth token in cookies and store in sessionStorage
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    const authToken =
      sessionStorage.getItem("authToken") || getCookie("authToken");
    if (authToken && typeof window !== "undefined") {
      // Store token in session storage
      sessionStorage.setItem("authToken", authToken);
      setIsAuthenticated(true);
    }
  }, []);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAgent, setIsAgent] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] as string[] });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const authToken = sessionStorage.getItem("authToken");
      if (params.get("modal") === "auth" && !authToken) {
        router.push("/microestate/auth");
      }
    }
  }, []);

  // Clear errors and success messages when switching tabs
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [activeTab, currentView]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset form state when modal closes
  // useEffect(() => {
  //   if (!isAuthModalOpen) {
  //     resetFormState();
  //   }
  // }, [isAuthModalOpen]);

  const resetFormState = () => {
    setEmail("");
    setPassword("");
    setName("");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(null);
    setCurrentView("main");
    setShowPassword(false);
    setIsAgent(false);
    setActiveTab("login");
    setUserId(null);
  };

  const router = useRouter();
  
  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    const feedback = [];
    let score = 0;
    
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }
    
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Both uppercase and lowercase letters");
    }
    
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push("At least one number");
    }
    
    if (/[@$!%*?&]/.test(password)) {
      score += 1;
    } else {
      feedback.push("At least one special character (@$!%*?&)");
    }
    
    return { score, feedback };
  };

  // Show the auth modal
  // const openAuthModal = () => {
  //   resetFormState();
  //   setIsAuthModalOpen(true);
  //   const url = new URL(window.location.href);
  //   url.searchParams.set("modal", "auth");
  //   router.replace(url.pathname + url.search, { scroll: false });
  // };

  // Handle logout
  const handleLogout = async () => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      // Clear sessionStorage
      sessionStorage.removeItem("authToken");

      // Clear cookies
      document.cookie =
        "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Check if user was logged in via Google (NextAuth)

      setIsAuthenticated(false);
      toast.success("Successfully Logged out");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (_error) {

      toast.error("Logout failed");
    }
  };

  // Handle login
  const handleLogin = async (_e?: FormEvent) => {
    _e?.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    // Client-side email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Basic password validation for login
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        // Store the token
        if (typeof window === "undefined") {
          return;
        }

        document.cookie = `authToken=${response.data.token}; path=/;`;
        sessionStorage.setItem("authToken", response.data.token);
        toast.success("Successfully Logged In!!");
        // Update the UI
        setSuccess("Login successful!");
        const url = new URL(window.location.href);
        url.searchParams.delete("modal");
        router.replace(url.pathname + url.search, { scroll: false });
        // Close the auth modal after a brief delay to show success message
        setTimeout(() => {
          // setIsAuthModalOpen(false); // Removed AuthModal state
          window.location.reload(); // Refresh to update auth state
        }, 1000);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || "Login failed. Please try again.";
      setError(errorMsg);
      toast.error("Login failed. Please try again.");
      // Check if email verification is required
      if (err.response?.status === 403 && err.response?.data?.userId) {
        setUserId(err.response.data.userId);
        setCurrentView("verify-email");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle signup
  const handleSignup = async (_e?: FormEvent) => {
    _e?.preventDefault();

    if (!name || !email || !password) {
      setError("Name, email, and password are required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Simple password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
        isAgent,
      });

      if (response.data.userId) {
        setUserId(response.data.userId);
        setSuccess("Account created! Please verify your email.");
        setCurrentView("verify-email");
        toast.success("Successfully Signed Up !");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || "Signup failed. Please try again.";
      toast.error("Signup failed. Please try again.");
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle email verification
  const handleVerifyEmail = async (_e?: FormEvent) => {
    _e?.preventDefault();

    if (!userId || !verificationCode) {
      setError("Verification code is required");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Verification code must be exactly 6 digits");
      return;
    }

    if (!/^\d{6}$/.test(verificationCode)) {
      setError("Verification code must contain only numbers");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("/api/auth/verify-email", {
        userId,
        code: verificationCode,
      });

      if (response.data.token) {
        // Store the token
        if (typeof window === "undefined") {
          return;
        }
        sessionStorage.setItem("authToken", response.data.token);
        document.cookie = `authToken=${response.data.token}; path=/;`;

        setSuccess("Email verified successfully!");
        const url = new URL(window.location.href);
        url.searchParams.delete("modal");
        router.replace(url.pathname + url.search, { scroll: false });
        // Close the auth modal after a brief delay
        setTimeout(() => {
          // setIsAuthModalOpen(false); // Removed AuthModal state
          window.location.reload(); // Refresh to update auth state
        }, 1000);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || "Verification failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle resend verification code
  const handleResendCode = async () => {
    if (!userId) {
      setError("User ID is missing. Please try logging in again.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("/api/auth/resend-code", {
        userId,
      });

      if (response.data.success) {
        setSuccess("Verification code sent! Please check your email.");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || "Failed to resend code. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const handleForgotPassword = async (_e?: FormEvent) => {
    _e?.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("/api/auth/forgot-password", {
        email,
      });

      if (response.data.userId) {
        setUserId(response.data.userId);
        setSuccess("Password reset instructions sent to your email!");
        setCurrentView("verify-email");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error ||
        "Failed to process request. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = async (_e?: FormEvent) => {
    _e?.preventDefault();

    if (!userId || !verificationCode || !newPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("/api/auth/reset-password", {
        userId,
        code: verificationCode,
        newPassword,
      });

      if (response.data.success) {
        setSuccess(
          "Password reset successful! You can now login with your new password.",
        );

        // Switch back to the login view after a brief delay
        setTimeout(() => {
          setCurrentView("main");
          setActiveTab("login");
        }, 2000);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || "Password reset failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // const closeAuthModal = () => {
  //   setIsAuthModalOpen(false);
  //   const url = new URL(window.location.href);
  //   url.searchParams.delete("modal");
  //   router.replace(url.pathname + url.search, { scroll: false });
  // };
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 bg-black/65`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main navigation - desktop */}
          <nav className="hidden custom:flex items-center space-x-8 justify-between">
            <div className="flex items-center space-x-8">
              <Link
                href="/search?filter=sale"
                className={`text-white hover:text-orange-400 transition-all relative group ${scrolled ? "text-orange-500" : ""}`}
              >
                Buy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/search?filter=rent"
                className={`text-white hover:text-orange-400 transition-all relative group ${scrolled ? "text-orange-500" : ""}`}
              >
                Rent
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <div className="relative group">
                <button
                  className={`text-white hover:text-orange-400 transition-all flex items-center space-x-1 ${scrolled ? "text-orange-500" : ""}`}
                >
                  <span>Tools</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mt-0.5 transition-transform duration-300 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left">
                  <div
                    className={`py-2 rounded-md shadow-lg ${scrolled ? "bg-black" : "bg-black/90 backdrop-blur-md"} border border-orange-500/10`}
                  >
                    <Link
                      href="/comingsoon"
                      className={`block px-4 py-2 text-sm hover:bg-orange-500/10 ${scrolled ? "text-orange-500" : "text-white"}`}
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.69.345a1.125 1.125 0 11-1.366 1.764l-.252-.126a1.125 1.125 0 01-.562-.97V9m1.5-1.5l5.25-5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Virtual Property Tour</span>
                      </div>
                    </Link>
                    <Link
                      href="/delhi-area-analyzer"
                      className={`block px-4 py-2 text-sm hover:bg-orange-500/10 ${scrolled ? "text-orange-500" : "text-white"}`}
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="w-6 h-6 text-orange-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 2.25c-3.9 0-7.5 3.2-7.5 7.5 0 5.25 7.5 12 7.5 12s7.5-6.75 7.5-12c0-4.3-3.6-7.5-7.5-7.5z"
                          />
                          <circle cx="12" cy="9.75" r="2.25" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 3.75l4.5 4.5m-4.5-4.5v3m0-3h3"
                          />
                        </svg>

                        <span>Delhi Area Analyzer</span>
                      </div>
                    </Link>
                    <Link
                      href="/house-price-prediction"
                      className={`block px-4 py-2 text-sm hover:bg-orange-500/10 ${scrolled ? "text-orange-500" : "text-white"}`}
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                          />
                        </svg>
                        <span>Price Prediction</span>
                      </div>
                    </Link>
                    <Link
                      href="/comingsoon"
                      className={`block px-4 py-2 text-sm hover:bg-orange-500/10 ${scrolled ? "text-orange-500" : "text-white"}`}
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                          />
                        </svg>
                        <span>Neighborhood Analysis</span>
                      </div>
                    </Link>
                    <div className="border-t border-orange-500/10 my-1"></div>
                    <Link
                      href="/tools/emi-calculator"
                      className={`block px-4 py-2 text-sm hover:bg-orange-500/10 ${scrolled ? "text-orange-500" : "text-white"}`}
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z"
                          />
                        </svg>
                        <span>Loan/EMI Calculator</span>
                      </div>
                    </Link>
                    <Link
                      href="/compare"
                      className={`block px-4 py-2 text-sm hover:bg-orange-500/10 ${scrolled ? "text-orange-500" : "text-white"}`}
                    >
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 mr-3" />
                        <span>Property Comparison</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center pl-52">
              <Link href="/" className="flex items-center group mr-16">
                <div className="h-16 w-18 flex items-center justify-center text-white font-bold text-xs transition-all duration-300">
                  <Image
                    src={`/logo.png`}
                    alt="100Gaj"
                    className="object-contain"
                    width={72}
                    height={36}
                    style={{ width: "auto", height: "100%" }}
                    priority
                  />
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <Link
                href="/sell"
                className="relative inline-flex items-center justify-center overflow-hidden text-sm font-medium text-white rounded-lg shadow-md bg-orange-600 hover:bg-orange-700 transition-all duration-300 group"
              >
                <span className="relative px-6 py-3 flex items-center gap-2 font-bold">
                  Post Property
                  <span className="ml-1 bg-white text-orange-600 rounded-md px-2 py-0.5 text-xs font-bold">
                    FREE
                  </span>
                </span>
              </Link>
              <div></div>
              <Link
                href="/equity"
                className={`text-white hover:text-orange-400 transition-all relative group ${scrolled ? "text-orange-500" : ""}`}
              >
                <Building2 className="h-5 w-5 mr-2 hover:text-orange-500" />
              </Link>
              <Link
                href="/contact"
                className={`text-white hover:text-orange-400 transition-all relative group ${scrolled ? "text-orange-500" : ""}`}
              >
                <Headset className="h-5 w-5 mr-2 hover:text-orange-500" />
              </Link>
              <Link
                href="/about"
                className={`text-white hover:text-orange-400 transition-all relative group ${scrolled ? "text-orange-500" : ""}`}
              >
                <Info className="h-5 w-5 mr-2 hover:text-orange-500" />
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <div className="group relative">
                    <div className="flex items-center gap-2 cursor-pointer">
                      <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                        <User2 className="h-6 w-6 m-2" />
                      </div>
                    </div>

                    {/* User dropdown menu */}
                    <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <div className="py-2 rounded-md shadow-lg bg-black/90 backdrop-blur-md border border-orange-500/10">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-white hover:bg-orange-500/10"
                        >
                          Profile
                        </Link>
                        <Link
                          href="/favourites"
                          className="block px-4 py-2 text-sm text-white hover:bg-orange-500/10"
                        >
                          Favourites
                        </Link>
                        <div className="border-t border-orange-500/10 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-white hover:bg-orange-500/10 cursor-pointer"
                        >
                          <LogOut size={16} className="mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => router.push("/microestate/auth")}
                  className={`luxury-button ml-4 cursor-pointer ${scrolled ? "bg-orange-500 hover:bg-orange-600" : "bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30"}`}
                >
                  Sign In
                </button>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="custom:hidden flex items-center justify-between py-2">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-12 flex items-center justify-center text-white">
                <Image
                  src={`/logo.png`}
                  alt="100Gaj"
                  className="object-contain"
                  width={48}
                  height={24}
                  style={{ width: "auto", height: "100%" }}
                />
              </div>
            </Link>

            <button
              type="button"
              className={`p-2 rounded-md ${scrolled ? "text-orange-500" : "text-white"}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6H20M4 12H20M4 18H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="custom:hidden bg-black/65 backdrop-blur-md sticky top-14 z-50 w-full"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              <Link
                href="/search?filter=sale"
                className="block px-4 py-3 text-white hover:bg-gray-700 rounded-md transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Buy
              </Link>
              <Link
                href="/search?filter=rent"
                className="block px-4 py-3 text-white hover:bg-gray-700 rounded-md transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Rent
              </Link>
              <Link
                href="/sell"
                className="block px-4 py-3 text-white hover:bg-gray-700 rounded-md transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Sell
              </Link>
              <Link
                href="/equity"
                className="block px-4 py-3 text-white hover:bg-gray-700 rounded-md transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Equity Investment
              </Link>
              {/* Tools dropdown for mobile */}
              <div className="block px-4 py-1 text-white">
                <div className="font-medium py-2">Tools</div>
                <div className="pl-4 space-y-1">
                  <Link
                    href="/comingsoon"
                    className="block px-2 py-2 text-white hover:bg-gray-700 rounded-md transition-all text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Virtual Property Tour
                  </Link>
                  <Link
                    href="/delhi-area-analyzer"
                    className="block px-2 py-2 text-white hover:bg-gray-700 rounded-md transition-all text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Area Analyzer
                  </Link>
                  <Link
                    href="/house-price-prediction"
                    className="block px-2 py-2 text-white hover:bg-gray-700 rounded-md transition-all text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Price Prediction
                  </Link>
                  <Link
                    href="/comingsoon"
                    className="block px-2 py-2 text-white hover:bg-gray-700 rounded-md transition-all text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Neighborhood Analysis
                  </Link>
                  <Link
                    href="/tools/emi-calculator"
                    className="block px-2 py-2 text-white hover:bg-gray-700 rounded-md transition-all text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Loan/EMI Calculator
                  </Link>
                </div>
              </div>
              <Link
                href="/support"
                className="block px-4 py-3 text-white hover:bg-gray-700 rounded-md transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {isAuthenticated ? (
                <>
                  <div className="block px-4 py-3 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center"></div>
                      <span className="font-medium">{"User"}</span>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-2 py-2 text-white hover:bg-gray-700 rounded-md transition-all text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/my-properties"
                      className="block px-2 py-2 text-white hover:bg-gray-700 rounded-md transition-all text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Properties
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full px-2 py-2 text-white hover:bg-gray-700 rounded-md transition-all text-sm mt-2"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/microestate/auth");
                  }}
                  className="block w-full px-4 py-3 bg-orange-500 text-white rounded-md font-medium text-center cursor-pointer hover:bg-orange-600 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      {/* Removed Auth Modal */}
    </>
  );
}
