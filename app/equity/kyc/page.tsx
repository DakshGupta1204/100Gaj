"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, FileText, Camera, CreditCard, Upload, X, Image as ImageIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import EquityNavigation from "../components/EquityNavigation";
import BackgroundVideo from "../components/BackgroundVideo";
import EquityAnimatedBackground from "../EquityAnimatedBackground";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
// Removed DatePicker import

interface FileUpload {
  file: File | null;
  preview: string;
}

export default function KYCPage() {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [panCard, setPanCard] = useState<FileUpload>({ file: null, preview: "" });
  const [aadhaarCard, setAadhaarCard] = useState<FileUpload>({ file: null, preview: "" });
  const [panNumber, setPanNumber] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const panInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  // Add state for full name and address
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  // Add state for bank details
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [branch, setBranch] = useState("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'pan' | 'aadhaar') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPG, PNG, or WebP)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    try {
      // Create preview URL
      const preview = URL.createObjectURL(file);

      // Update state based on type
      if (type === 'pan') {
        setPanCard({ file, preview });
      } else {
        setAadhaarCard({ file, preview });
      }

      toast.success(`${type === 'pan' ? 'PAN' : 'Aadhaar'} card image selected`);
    } catch (error) {
      console.error("Error handling file:", error);
      toast.error("Error processing image");
    }
  };

  const removeFile = (type: 'pan' | 'aadhaar') => {
    if (type === 'pan') {
      setPanCard({ file: null, preview: "" });
      if (panInputRef.current) panInputRef.current.value = "";
    } else {
      setAadhaarCard({ file: null, preview: "" });
      if (aadhaarInputRef.current) aadhaarInputRef.current.value = "";
    }
  };

  const validatePan = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
  const validateAadhaar = (aadhaar: string) => /^[0-9]{12}$/.test(aadhaar);

  const handleUpload = async () => {
    setError("");
    if (!validatePan(panNumber)) {
      setError("Invalid PAN number. Format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)");
      toast.error("Invalid PAN number. Format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)");
      return;
    }
    if (!validateAadhaar(aadhaarNumber)) {
      setError("Invalid Aadhaar number. It should be 12 digits.");
      toast.error("Invalid Aadhaar number. It should be 12 digits.");
      return;
    }
    if (!panCard.file || !aadhaarCard.file) {
      setError("Please upload both PAN and Aadhaar card images.");
      toast.error("Please upload both PAN and Aadhaar card images");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      if (panCard && panCard.file) formData.append("panCard", panCard.file);
      if (aadhaarCard && aadhaarCard.file) formData.append("aadhaarCard", aadhaarCard.file);
      formData.append("panNumber", panNumber);
      formData.append("aadhaarNumber", aadhaarNumber);
      await axios.post("/api/equity/kyc/upload-documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Documents uploaded successfully!");
      setStep(3); // Move to next step
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload documents. Please try again.");
      toast.error("Failed to upload documents");
    } finally {
      setUploading(false);
    }
  };

  const renderUploadBox = (
    type: 'pan' | 'aadhaar',
    file: FileUpload,
    inputRef: React.RefObject<HTMLInputElement>
  ) => {
    const title = type === 'pan' ? 'PAN Card' : 'Aadhaar Card';

    return (
      <div className="border-2 border-dashed border-[#a78bfa]/30 rounded-xl p-6 relative">
        <input
          type="file"
          ref={inputRef}
          onChange={(e) => handleFileSelect(e, type)}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          id={`${type}-upload`}
        />

        {file.preview ? (
          <div className="relative">
            <Image
              src={file.preview}
              alt={`${title} Preview`}
              width={400}
              height={250}
              className="rounded-lg w-full h-[250px] object-cover"
            />
            <button
              onClick={() => removeFile(type)}
              className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 p-1.5 rounded-full text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor={`${type}-upload`}
            className="flex flex-col items-center justify-center h-[250px] cursor-pointer group w-full"
            style={{ width: '100%' }}
          >
            <div className="mb-4 p-4 bg-[#a78bfa]/10 rounded-full group-hover:bg-[#a78bfa]/20 transition-colors">
              <ImageIcon className="w-8 h-8 text-[#a78bfa]" />
            </div>
            <p className="text-gray-300 mb-2">Upload {title}</p>
            <p className="text-sm text-gray-500 mb-4">JPG, PNG or WebP (Max 5MB)</p>
          </label>
        )}
      </div>
    );
  };

  const steps = [
    {
      title: "Personal Information",
      icon: <FileText className="w-6 h-6" />,
      fields: [
        { label: "Full Name", type: "text", placeholder: "Enter your full name" },
        { label: "PAN Number", type: "text", placeholder: "Enter PAN number" },
        { label: "Date of Birth", type: "date", placeholder: "Select date of birth" },
        { label: "Address", type: "text", placeholder: "Enter your address" },
      ]
    },
    {
      title: "Document Upload",
      icon: <Upload className="w-6 h-6" />,
      description: "Upload clear photos of your documents"
    },
    {
      title: "Bank Details",
      icon: <CreditCard className="w-6 h-6" />,
      fields: [
        { label: "Bank Name", type: "text", placeholder: "Enter bank name" },
        { label: "Account Number", type: "text", placeholder: "Enter account number" },
        { label: "IFSC Code", type: "text", placeholder: "Enter IFSC code" },
        { label: "Branch", type: "text", placeholder: "Enter branch name" },
      ]
    }
  ];

  // Prevent next step if required fields are missing
  const handleNextStep = () => {
    if (step === 1) {
      if (!fullName.trim() || !dateOfBirth.trim() || !address.trim()) {
        toast.error("Please fill in all required fields.");
        return;
      }
      setStep(step + 1);
    } else if (step === 2) {
      handleUpload();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <BackgroundVideo />
      <EquityAnimatedBackground />

      {/* Navigation */}
      <EquityNavigation />

      <div className="relative pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#a78bfa] to-white mb-4">
              Complete Your KYC
            </h1>
            <p className="text-gray-400">
              Verify your identity to start investing in properties
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: step === i + 1 ? 1.1 : 1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step > i
                        ? "bg-[#a78bfa] text-white"
                        : step === i + 1
                        ? "bg-[#a78bfa]/20 border-2 border-[#a78bfa] text-[#a78bfa]"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {s.icon}
                  </motion.div>
                  {i < steps.length - 1 && (
                    <div
                      className={`h-1 w-24 md:w-48 mx-2 rounded ${
                        step > i + 1 ? "bg-[#a78bfa]" : "bg-gray-800"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#14141F]/80 backdrop-blur-xl border-2 border-[#a78bfa] rounded-3xl p-8 shadow-2xl shadow-[#a78bfa]/20"
          >
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Full Name</label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm bg-transparent text-white placeholder-gray-500 border-[#a78bfa]/30 focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa] transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Date of Birth</label>
                  <Input
                    type="date"
                    value={dateOfBirth}
                    onChange={e => setDateOfBirth(e.target.value)}
                    className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm bg-transparent text-white placeholder-gray-500 border-[#a78bfa]/30 focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa] transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Address</label>
                  <Input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Enter your address"
                    className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm bg-transparent text-white placeholder-gray-500 border-[#a78bfa]/30 focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa] transition-colors duration-200"
                  />
                </div>
              </div>
            )}

            {/* Document Upload Step */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">PAN Number</label>
                  <Input
                    type="text"
                    value={panNumber}
                    onChange={e => setPanNumber(e.target.value)}
                    placeholder="Enter PAN number"
                    className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm bg-transparent text-white placeholder-gray-500 border-[#a78bfa]/30 focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa] transition-colors duration-200"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Aadhaar Number</label>
                  <Input
                    type="text"
                    value={aadhaarNumber}
                    onChange={e => setAadhaarNumber(e.target.value)}
                    placeholder="Enter Aadhaar number"
                    className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm bg-transparent text-white placeholder-gray-500 border-[#a78bfa]/30 focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa] transition-colors duration-200"
                  />
                </div>
                <div className="space-y-6">
                  {renderUploadBox('pan', panCard, panInputRef)}
                  {renderUploadBox('aadhaar', aadhaarCard, aadhaarInputRef)}
                </div>

                {error && (
                  <div className="text-red-500 text-sm mb-2">{error}</div>
                )}
              </motion.div>
            )}

            {/* Bank Details Step (previously Confirmation Step) */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Bank Name</label>
                  <Input
                    type="text"
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    placeholder="Enter bank name"
                    className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm bg-transparent text-white placeholder-gray-500 border-[#a78bfa]/30 focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa] transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Account Number</label>
                  <Input
                    type="text"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    placeholder="Enter account number"
                    className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm bg-transparent text-white placeholder-gray-500 border-[#a78bfa]/30 focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa] transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">IFSC Code</label>
                  <Input
                    type="text"
                    value={ifscCode}
                    onChange={e => setIfscCode(e.target.value)}
                    placeholder="Enter IFSC code"
                    className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm bg-transparent text-white placeholder-gray-500 border-[#a78bfa]/30 focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa] transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Branch</label>
                  <Input
                    type="text"
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    placeholder="Enter branch name"
                    className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm bg-transparent text-white placeholder-gray-500 border-[#a78bfa]/30 focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa] transition-colors duration-200"
                  />
                </div>
                {/* Removed Post Now button */}
              </div>
            )}

            <div className="mt-8 flex justify-end">
              {step > 1 && (
                <Button
                  onClick={() => setStep(step - 1)}
                  variant="outline"
                  className="mr-4 border-[#a78bfa]/50 text-[#a78bfa] hover:bg-[#a78bfa]/10"
                  disabled={step === 2 && uploading} // Disable "Back" during upload on step 2
                >
                  Back
                </Button>
              )}
              {step < steps.length ? (
                <Button
                  onClick={handleNextStep}
                  disabled={step === 2 && uploading}
                  className="bg-gradient-to-r from-[#a78bfa] to-[#9333ea] hover:from-[#9333ea] hover:to-[#a78bfa] text-white"
                >
                  {step === 2 && uploading ? "Uploading..." : "Next Step"}
                </Button>
              ) : ( // This is for the final step (step 3 in this case)
                <Button
                  onClick={() => {
                    if (!bankName.trim() || !accountNumber.trim() || !ifscCode.trim() || !branch.trim()) {
                      toast.error("Please fill in all required bank details.");
                      return;
                    }
                    toast.success("KYC submission complete!");
                    router.push("/equity/postproperty");
                  }}
                  className="bg-gradient-to-r from-[#a78bfa] to-[#9333ea] hover:from-[#9333ea] hover:to-[#a78bfa] text-white"
                >
                  Submit KYC
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}