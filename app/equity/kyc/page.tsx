"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import EquityNavigation from "@/app/equity/components/EquityNavigation";

function validatePan(pan: string) {
  // PAN format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
}

export default function KycPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pan, setPan] = useState("");
  const [panImage, setPanImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [panError, setPanError] = useState("");
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    if (e.target.files && e.target.files[0]) {
      setPanImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setPanError("");
    setFileError("");
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validatePan(pan)) {
      setPanError("Invalid PAN number. Format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)");
      return;
    }
    if (!panImage) {
      setFileError("Please upload your PAN card image.");
      return;
    }
    setSubmitting(true);
    try {
      // Equity platform stores token in sessionStorage, not localStorage
      const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
      
      if (!token) {
        setError("You must be logged in to complete KYC.");
        setSubmitting(false);
        return;
      }
      
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("pan", pan);
      if (panImage) formData.append("panImage", panImage);

      // Replace with your actual KYC API endpoint
      const res = await fetch("/api/kyc", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Failed to submit KYC");
        setSubmitting(false);
        return;
      }
      setSuccess("KYC submitted successfully!");
      setName("");
      setEmail("");
      setPan("");
      setPanImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSubmitting(false);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#2d1a4a] to-[#a78bfa] px-4 relative">
      <EquityNavigation />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-black/90 rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-lg z-10 border border-purple-400/30 mt-24"
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-white">
          Complete Your KYC
        </h2>
        <p className="text-center text-purple-300 mb-6">
          Please fill in your details and upload your PAN card to complete your KYC process.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-purple-400/30 focus:border-purple-400 outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-purple-400/30 focus:border-purple-400 outline-none"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">PAN Number</label>
            <input
              type="text"
              className={`w-full px-4 py-2 rounded-lg bg-gray-900 text-white border ${panError ? "border-red-400" : "border-purple-400/30"} focus:border-purple-400 outline-none uppercase`}
              value={pan}
              onChange={e => setPan(e.target.value.toUpperCase())}
              required
              minLength={10}
              maxLength={10}
              placeholder="ABCDE1234F"
            />
            {panError && <div className="text-red-400 text-xs mt-1">{panError}</div>}
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Upload PAN Card</label>
            <div className="relative flex items-center">
              <input
                type="file"
                accept="image/*,application/pdf"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                required
              />
              <div className="w-full flex items-center bg-gray-900 border border-purple-400/30 rounded-lg px-4 py-2 cursor-pointer hover:border-purple-400 transition-all duration-300">
                <span className="text-purple-300 text-sm flex-1 truncate">
                  {panImage ? panImage.name : "Choose file..."}
                </span>
                <span className="ml-2 px-3 py-1 rounded bg-gradient-to-r from-purple-500 to-purple-700 text-white text-xs font-semibold shadow-md">
                  Browse
                </span>
              </div>
            </div>
            {fileError && <div className="text-red-400 text-xs mt-1">{fileError}</div>}
          </div>
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          {success && <div className="text-green-400 text-sm text-center">{success}</div>}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold py-2 rounded-lg mt-2 hover:from-purple-600 hover:to-purple-800 transition-all duration-300"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit KYC"}
          </Button>
        </form>
      </motion.div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Decorative blurred gradients */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500 rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-700 rounded-full opacity-20 blur-2xl" />
      </div>
    </div>
  );
} 