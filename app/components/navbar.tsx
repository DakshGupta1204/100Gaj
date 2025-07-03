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

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
      setIsAuthModalOpen(true);
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

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const authToken = sessionStorage.getItem("authToken");
      if (params.get("modal") === "auth" && !authToken) {
        setIsAuthModalOpen(true); // or your setIsAuthModal(true)
      } else {
        setIsAuthModalOpen(false);
      }
    }
  }, []);

  // useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     if (typeof window !== "undefined") {
  //       // First check sessionStorage for custom auth token
  //       const token = sessionStorage.getItem("authToken");

  //       if (token) {
  //         try {
  //           const authData = JSON.parse(token);
  //           // Check if it's a Google auth session or custom auth
  //           if (authData.provider === "google") {
  //             // For Google auth, also verify the NextAuth session is still valid
  //             const session = await getSession();
  //             if (session?.user) {
  //               setIsAuthenticated(true);
  //             } else {
  //               // Session expired, clear storage
  //               sessionStorage.removeItem("authToken");
  //               setIsAuthenticated(false);
  //             }
  //           } else {
  //             // For custom auth, just check if token exists
  //             setIsAuthenticated(true);
  //           }
  //         } catch (error) {
  //           console.error("Error parsing auth token:", error);
  //           sessionStorage.removeItem("authToken");
  //           setIsAuthenticated(false);
  //         }
  //       } else {
  //         // Check if there's a NextAuth session without our custom token
  //         const session = await getSession();
  //         if (session?.user) {
  //           // Create our custom auth data for existing NextAuth session
  //           const customAuthData = {
  //             user: session.user,
  //             expires: session.expires,
  //             provider: "google",
  //             timestamp: Date.now(),
  //           };
  //           sessionStorage.setItem("authToken", JSON.stringify(customAuthData));
  //           setIsAuthenticated(true);
  //         }
  //       }
  //     }
  //   };

  //   checkAuthStatus();
  // }, []);

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
  useEffect(() => {
    if (!isAuthModalOpen) {
      resetFormState();
    }
  }, [isAuthModalOpen]);

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
  // Handle login with NextAuth Google

  // Show the auth modal
  const openAuthModal = () => {
    resetFormState();
    setIsAuthModalOpen(true);
    const url = new URL(window.location.href);
    url.searchParams.set("modal", "auth");
    router.replace(url.pathname + url.search, { scroll: false });
  };

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
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  // Handle login
  const handleLogin = async (e?: FormEvent) => {
    e?.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });
      console.log("Login response:", response.data.token);
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
          setIsAuthModalOpen(false);
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
  const handleSignup = async (e?: FormEvent) => {
    e?.preventDefault();

    if (!name || !email || !password) {
      setError("Name, email, and password are required");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long. Mix of letters, numbers, special character, uppercase and lowercase required.");
      setError("Password must be at least 8 characters long");
      return;
    }

    // Simple password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
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
  const handleVerifyEmail = async (e?: FormEvent) => {
    e?.preventDefault();

    if (!userId || !verificationCode) {
      setError("Verification code is required");
      return;
    }
    if (!/^\d{6}$/.test(verificationCode)) {
      setError("Verification code must be exactly 6 digits");
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
          setIsAuthModalOpen(false);
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
  const handleForgotPassword = async (e?: FormEvent) => {
    e?.preventDefault();

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
  const handleResetPassword = async (e?: FormEvent) => {
    e?.preventDefault();

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

    if (!/^\d{6}$/.test(verificationCode)) {
      setError("Verification code must be exactly 6 digits");
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

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("modal");
    router.replace(url.pathname + url.search, { scroll: false });
  };
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
                  <img
                    src={`/logo.png`}
                    alt="100Gaj"
                    className="w-full h-full object-cover"
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
                  onClick={openAuthModal}
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
                <img
                  src={`/logo.png`}
                  alt="100Gaj"
                  className="w-full h-full object-cover"
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
                    openAuthModal();
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
      <AnimatePresence>
        {isAuthModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuthModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-2"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative w-full max-w-md">
                {/* Close button */}
                <button
                  onClick={() => closeAuthModal()}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
                >
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
                </button>

                <div className="p-8">
                  {/* Title */}
                  <h2 className="text-2xl font-bold text-orange-500 text-center mb-6">
                    Welcome to 100 GAJ
                  </h2>

                  {/* Main auth view (login/signup) */}
                  {currentView === "main" && (
                    <>
                      {/* Tabs */}
                      <div className="flex text-xl mb-6 border-b border-gray-200">
                        <button
                          onClick={() => setActiveTab("login")}
                          className={`flex-1 pb-4 text-center font-medium ${
                            activeTab === "login"
                              ? "text-orange-500 border-b-2 border-orange-500"
                              : "text-gray-500"
                          }`}
                        >
                          Sign in
                        </button>
                        <button
                          onClick={() => setActiveTab("signup")}
                          className={`flex-1 pb-4 text-center font-medium ${
                            activeTab === "signup"
                              ? "text-orange-500 border-b-2 border-orange-500"
                              : "text-gray-500"
                          }`}
                        >
                          New account
                        </button>
                      </div>

                      {/* Error/Success Messages */}
                      {error && (
                        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-500 text-sm flex items-start">
                          <AlertCircle
                            size={16}
                            className="mr-2 mt-0.5 flex-shrink-0"
                          />
                          <span>{error}</span>
                        </div>
                      )}

                      {success && (
                        <div className="mb-4 p-3 rounded-md bg-green-50 text-green-500 text-sm flex items-start">
                          <CheckCircle
                            size={16}
                            className="mr-2 mt-0.5 flex-shrink-0"
                          />
                          <span>{success}</span>
                        </div>
                      )}

                      {/* Login Form */}
                      {activeTab === "login" && (
                        <form onSubmit={handleLogin} className="flex flex-col gap-2 p-2 bg-white rounded-xl shadow-lg">
                          <div>
                            <label className="text-gray-700 text-xs font-medium mb-1 block">Email</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                <Mail size={16} className="text-gray-400" />
                              </div>
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-gray-700 text-xs font-medium mb-1 block">Password</label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full pl-2 pr-8 py-1.5 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-2 flex items-center"
                              >
                                {showPassword ? (
                                  <EyeOff size={16} className="text-gray-400" />
                                ) : (
                                  <Eye size={16} className="text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-1.5 px-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                          >
                            {loading ? "Signing in..." : "Sign in"}
                          </button>
                          <div className="text-center">
                            <button
                              type="button"
                              onClick={() => setCurrentView("forgot-password")}
                              className="text-orange-500 hover:text-orange-600 text-xs font-medium"
                            >
                              Forgot your password?
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Signup Form */}
                      {activeTab === "signup" && (
                        <form onSubmit={handleSignup} className="flex flex-col gap-1 p-1 max-h-[400px] overflow-y-auto bg-white rounded-xl shadow-lg">
                          <div>
                            <label className="text-gray-700 text-xs font-medium mb-0.5 block">Name</label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Enter your full name"
                              className="w-full px-1 py-1 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="text-gray-700 text-xs font-medium mb-0.5 block">Email</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                                <Mail size={16} className="text-gray-400" />
                              </div>
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                className="w-full pl-7 pr-1 py-1 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-gray-700 text-xs font-medium mb-0.5 block">Password</label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create password"
                                className="w-full pl-1 pr-7 py-1 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-1 flex items-center"
                              >
                                {showPassword ? (
                                  <EyeOff size={16} className="text-gray-400" />
                                ) : (
                                  <Eye size={16} className="text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <input
                              type="checkbox"
                              id="isAgent"
                              checked={isAgent}
                              onChange={(e) => setIsAgent(e.target.checked)}
                              className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                            />
                            <label htmlFor="isAgent" className="text-gray-700 text-xs">
                              I am a landlord or industry professional
                            </label>
                          </div>
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-1 px-1 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed text-xs"
                          >
                            {loading ? "Creating account..." : "Create account"}
                          </button>
                          <p className="text-xs text-gray-600 text-center mt-1 mb-0">
                            By submitting, I accept 100 GAJ&apos;s {" "}
                            <a href="#" className="text-orange-500 hover:text-orange-600">
                              terms of use
                            </a>
                            .
                          </p>
                        </form>
                      )}

                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">
                            Or connect with
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <GoogleLoginButton />
                      </div>
                    </>
                  )}

                  {/* Forgot Password View */}
                  {currentView === "forgot-password" && (
                    <>
                      <button
                        type="button"
                        onClick={() => setCurrentView("main")}
                        className="flex items-center text-orange-500 hover:text-orange-600 mb-6"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Back to login
                      </button>

                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Reset your password
                      </h3>

                      <p className="text-gray-600 mb-6">
                        Enter your email address and we&apos;ll send you a link
                        to reset your password.
                      </p>

                      {/* Error/Success Messages */}
                      {error && (
                        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-500 text-sm flex items-start">
                          <AlertCircle
                            size={16}
                            className="mr-2 mt-0.5 flex-shrink-0"
                          />
                          <span>{error}</span>
                        </div>
                      )}

                      {success && (
                        <div className="mb-4 p-3 rounded-md bg-green-50 text-green-500 text-sm flex items-start">
                          <CheckCircle
                            size={16}
                            className="mr-2 mt-0.5 flex-shrink-0"
                          />
                          <span>{success}</span>
                        </div>
                      )}

                      <form
                        onSubmit={handleForgotPassword}
                        className="space-y-4"
                      >
                        <div>
                          <label className="text-gray-700 text-sm font-medium mb-2 block">
                            Email
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail size={16} className="text-gray-400" />
                            </div>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email"
                              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {loading ? "Sending..." : "Send Reset Code"}
                        </button>
                      </form>
                    </>
                  )}

                  {/* Verify Email / OTP View */}
                  {currentView === "verify-email" && (
                    <>
                      <button
                        type="button"
                        onClick={() => setCurrentView("main")}
                        className="flex items-center text-orange-500 hover:text-orange-600 mb-6"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Back
                      </button>

                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Verification Code
                      </h3>

                      <p className="text-gray-600 mb-6">
                        {activeTab === "signup"
                          ? "Please enter the verification code sent to your email to complete your registration."
                          : "Please enter the verification code sent to your email to reset your password."}
                      </p>

                      {/* Error/Success Messages */}
                      {error && (
                        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-500 text-sm flex items-start">
                          <AlertCircle
                            size={16}
                            className="mr-2 mt-0.5 flex-shrink-0"
                          />
                          <span>{error}</span>
                        </div>
                      )}

                      {success && (
                        <div className="mb-4 p-3 rounded-md bg-green-50 text-green-500 text-sm flex items-start">
                          <CheckCircle
                            size={16}
                            className="mr-2 mt-0.5 flex-shrink-0"
                          />
                          <span>{success}</span>
                        </div>
                      )}

                      {/* Verification Form */}
                      <form
                        onSubmit={
                          activeTab === "signup"
                            ? handleVerifyEmail
                            : handleResetPassword
                        }
                        className="space-y-4"
                      >
                        <div>
                          <label className="text-gray-700 text-sm font-medium mb-2 block">
                            Verification Code
                          </label>
                          <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => {
                              // Only allow up to 6 digits
                              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                              setVerificationCode(val);
                            }}
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent"
                          />
                        </div>

                        {/* Additional fields for password reset */}
                        {activeTab === "login" && (
                          <>
                            <div>
                              <label className="text-gray-700 text-sm font-medium mb-2 block">
                                New Password
                              </label>
                              <div className="relative">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  value={newPassword}
                                  onChange={(e) =>
                                    setNewPassword(e.target.value)
                                  }
                                  placeholder="Enter new password"
                                  className="w-full pl-4 pr-10 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                  {showPassword ? (
                                    <EyeOff
                                      size={16}
                                      className="text-gray-400"
                                    />
                                  ) : (
                                    <Eye size={16} className="text-gray-400" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="text-gray-700 text-sm font-medium mb-2 block">
                                Confirm New Password
                              </label>
                              <div className="relative">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  value={confirmPassword}
                                  onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                  }
                                  placeholder="Confirm new password"
                                  className="w-full pl-4 pr-10 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {loading
                            ? "Processing..."
                            : activeTab === "signup"
                              ? "Verify Email"
                              : "Reset Password"}
                        </button>

                        <button
                          type="button"
                          onClick={handleResendCode}
                          disabled={loading}
                          className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                        >
                          Resend Code
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
