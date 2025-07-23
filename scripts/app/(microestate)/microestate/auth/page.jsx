"use client";
import React, { useState, useEffect } from "react";
import { Mail, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft, Building, } from "lucide-react";
import { FloatingCircles, ParticleBackground, } from "../../_components/Background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "../../_components/GoogleLoginButton";
const Login = () => {
    const router = useRouter();
    const [currentView, setCurrentView] = useState("main");
    const [activeTab, setActiveTab] = useState("login");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        role: "tenant",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState(0);
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
        if (formData.password.length >= 8)
            strength++;
        if (/[A-Z]/.test(formData.password))
            strength++;
        if (/[a-z]/.test(formData.password))
            strength++;
        if (/\d/.test(formData.password))
            strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(formData.password))
            strength++;
        setPasswordStrength(Math.min(4, strength));
    }, [formData.password]);
    const getPasswordStrengthColor = (level) => {
        const colors = [
            "bg-red-500",
            "bg-orange-500",
            "bg-yellow-500",
            "bg-green-400",
            "bg-green-500",
        ];
        return colors[level] || "bg-gray-600";
    };
    const getPasswordStrengthLabel = (level) => {
        const labels = ["Very weak", "Weak", "Medium", "Strong", "Very strong"];
        return labels[level] || "";
    };
    const handleInputChange = (field, value) => {
        setFormData((prev) => (Object.assign(Object.assign({}, prev), { [field]: value })));
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError("Email and password are required");
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const response = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });
            if (response === null || response === void 0 ? void 0 : response.error) {
                setError(response.error);
            }
            else {
                setSuccess("Logged in successfully!");
            }
            if (response === null || response === void 0 ? void 0 : response.ok) {
                router.push("/microestate");
            }
        }
        catch (error) {
            setError("An error occurred during login");
            console.error("Login error:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSignup = async (e) => {
        var _a, _b, _c, _d;
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
            const response = await axios.post("/microestate/api/signup", formData);
            console.log("signup resp", response);
            if ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.success) {
                setSuccess((_b = response.data) === null || _b === void 0 ? void 0 : _b.message);
            }
            router.push("/microestate");
        }
        catch (error) {
            if ((_d = (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.error) {
                console.error(error.response.data.error);
                setError(error.response.data.error);
            }
            else {
                console.error(error, "Error in signup");
                setError("An error occurred during signup");
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        setTimeout(() => {
            setLoading(false);
            setSuccess("Reset instructions have been sent to your email.");
        }, 1000);
    };
    const renderInputField = (field) => (<div key={field.id} className="group">
      <Label className="text-gray-300 text-sm font-medium mb-2 block">
        {field.label}
      </Label>
      <div className="relative">
        <Input type={field.hasToggle ? (showPassword ? "text" : "password") : field.type} value={field.value} onChange={(e) => handleInputChange(field.id, e.target.value)} placeholder={field.placeholder} className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-orange-500/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 backdrop-blur-sm hover:border-orange-500/40 h-auto"/>
        {field.hasToggle && (<Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-400 transition-colors duration-200 hover:bg-transparent h-auto" tabIndex={-1}>
            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
          </Button>)}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>

      {field.showStrength && formData.password && (<div className="mt-2 animate-fadeIn">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-400">Password strength:</span>
            <span className={`text-xs font-medium ${passwordStrength === 0
                ? "text-red-400"
                : passwordStrength === 1
                    ? "text-orange-400"
                    : passwordStrength === 2
                        ? "text-yellow-400"
                        : "text-green-400"}`}>
              {getPasswordStrengthLabel(passwordStrength)}
            </span>
          </div>
          <div className="w-full flex space-x-1">
            {[1, 2, 3, 4].map((bar) => (<div key={bar} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${bar <= passwordStrength
                    ? getPasswordStrengthColor(passwordStrength)
                    : "bg-gray-700"}`}/>))}
          </div>
          <div className="mt-2 space-y-1 text-xs text-gray-400">
            <p>• At least 8 characters • Mix of letters and numbers</p>
            <p>• At least 1 special character • Upper and lowercase letters</p>
          </div>
        </div>)}
    </div>);
    return (<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden flex items-center justify-center py-12">
      <FloatingCircles />
      <ParticleBackground />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/5 via-transparent to-orange-400/5"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto px-2">
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-orange-500/20 rounded-3xl shadow-2xl shadow-orange-500/10 overflow-hidden transform hover:scale-[1.01] transition-all duration-500">
          <div className="relative px-8 py-6 bg-gradient-to-r from-orange-600/10 to-orange-400/10">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-400/5"></div>
            <div className="relative flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 transform hover:rotate-12 transition-transform duration-300">
                <Building className="w-6 h-6 text-white"/>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent mb-2">
              Welcome to 100 GAJ
            </h2>
            <p className="text-center text-gray-300 text-sm">
              Your gateway to modern real estate management
            </p>
          </div>

          <div className="px-4 py-4">
            {currentView === "main" && (<>
                {/* Tabs */}
                <div className="flex mb-6 bg-gray-800/50 rounded-2xl p-1 backdrop-blur-sm border border-orange-500/10">
                  <Button variant="ghost" onClick={() => setActiveTab("login")} className={`flex-1 py-2 px-4 text-center font-semibold rounded-xl transition-all duration-300 h-auto hover:bg-transparent ${activeTab === "login"
                ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/30 transform scale-105 hover:bg-gradient-to-r hover:from-orange-600 hover:to-orange-500"
                : "text-gray-400 hover:text-orange-400"}`}>
                    Sign in
                  </Button>
                  <Button variant="ghost" onClick={() => setActiveTab("signup")} className={`flex-1 py-2 px-4 text-center font-semibold rounded-xl transition-all duration-300 h-auto hover:bg-transparent ${activeTab === "signup"
                ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/30 transform scale-105 hover:bg-gradient-to-r hover:from-orange-600 hover:to-orange-500"
                : "text-gray-400 hover:text-orange-400"}`}>
                    New account
                  </Button>
                </div>

                {/* Alerts */}
                {error && (<Alert className="mb-4 p-3 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm backdrop-blur-sm animate-fadeIn">
                    <AlertCircle size={16}/>
                    <AlertDescription className="ml-2">
                      {error}
                    </AlertDescription>
                  </Alert>)}
                {success && (<Alert className="mb-4 p-3 rounded-2xl border border-green-500/20 bg-green-500/10 text-green-400 text-sm backdrop-blur-sm animate-fadeIn">
                    <CheckCircle size={16}/>
                    <AlertDescription className="ml-2">
                      {success}
                    </AlertDescription>
                  </Alert>)}

                {/* Login Form */}
                {activeTab === "login" && (<form onSubmit={handleLogin} className="space-y-4 animate-slideIn">
                    <div className="space-y-4">
                      {loginFields.map(renderInputField)}
                    </div>

                    <Button type="submit" disabled={loading} className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg shadow-orange-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden h-auto">
                      <span className="relative z-10">
                        {loading ? "Signing in..." : "Sign in"}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                    </Button>

                    <div className="text-center pt-2">
                      <Button type="button" variant="link" onClick={() => setCurrentView("forgot-password")} className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors duration-200 p-0 h-auto">
                        Forgot your password?
                      </Button>
                    </div>
                  </form>)}

                {/* Signup Form */}
                {activeTab === "signup" && (<form onSubmit={handleSignup} className="space-y-4 animate-slideIn">
                    <div className="space-y-4">
                      {signupFields.map(renderInputField)}
                    </div>

                    <div className="flex items-center space-x-3 group">
                      <Checkbox id="isAgent" checked={formData.role === "landlord"} onCheckedChange={(checked) => handleInputChange("role", checked ? "landlord" : "tenant")} className="w-4 h-4 rounded border-2 border-orange-500/40 text-orange-500 focus:ring-orange-500/50 bg-gray-800/50 transition-all duration-200 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"/>
                      <Label htmlFor="isAgent" className="text-gray-300 text-sm cursor-pointer group-hover:text-orange-400 transition-colors duration-200">
                        I am a landlord or industry professional
                      </Label>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg shadow-orange-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden h-auto">
                      <span className="relative z-10">
                        {loading ? "Creating account..." : "Create account"}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                    </Button>

                    <p className="text-xs text-gray-400 text-center pt-2">
                      By submitting, I accept 100 GAJ&apos;s{" "}
                      <a href="#" className="text-orange-400 hover:text-orange-300 transition-colors duration-200">
                        terms of use
                      </a>
                      .
                    </p>
                  </form>)}

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-gray-700"/>
                  <span className="text-sm text-gray-400 whitespace-nowrap">
                    Or continue with
                  </span>
                  <div className="flex-1 h-px bg-gray-700"/>
                </div>

                <div variant="outline" className="w-full py-3 px-6 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 hover:border-gray-500 text-white font-medium rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 backdrop-blur-sm group relative overflow-hidden h-auto">
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {/* <FaGoogle /> */}
                    {/* Continue with Google */}
                    <GoogleLoginButton />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-700/20 to-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </>)}

            {/* Forgot Password View */}
            {currentView === "forgot-password" && (<div className="animate-slideIn">
                <Button variant="link" onClick={() => setCurrentView("main")} className="flex items-center text-orange-400 hover:text-orange-300 mb-6 transition-colors duration-200 group p-0 h-auto">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200"/>
                  Back to login
                </Button>

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Reset your password
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Enter your email address and we&apos;ll send you a link to
                    reset your password.
                  </p>
                </div>

                {error && (<Alert className="mb-4 p-3 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm backdrop-blur-sm animate-fadeIn">
                    <AlertCircle size={16}/>
                    <AlertDescription className="ml-2">
                      {error}
                    </AlertDescription>
                  </Alert>)}
                {success && (<Alert className="mb-4 p-3 rounded-2xl border border-green-500/20 bg-green-500/10 text-green-400 text-sm backdrop-blur-sm animate-fadeIn">
                    <CheckCircle size={16}/>
                    <AlertDescription className="ml-2">
                      {success}
                    </AlertDescription>
                  </Alert>)}

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="group">
                    <Label className="text-gray-300 text-sm font-medium mb-2 block">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="Enter your email" className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-orange-500/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 backdrop-blur-sm hover:border-orange-500/40 h-auto"/>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg shadow-orange-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden h-auto">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5"/>
                      {loading ? "Sending..." : "Send Reset Instructions"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </Button>
                </form>
              </div>)}
          </div>
        </div>
      </div>
    </div>);
};
export default Login;
