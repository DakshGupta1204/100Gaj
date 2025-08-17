"use client";
import React, { useState } from "react";
import { BadgeCheck, Edit2, User, Mail, Phone, Calendar, ShieldCheck, Home, KeyRound, EyeOff, Eye, Moon, Bell, MessageCircle, Building, QrCode, Upload, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/(microestate)/Context/AuthProvider";
import axios from "axios";
import { useEffect } from "react";




export default function LandlordProfile() {
 const { user } = useAuth();
  const userId = user?.id;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [expanded, setExpanded] = useState({ password: false, settings: false, qrCode: false });

  const [name, setName] = useState("");
  const [lastname , setlastname] = useState("")
  const [role  , setrole] = useState("")
  const [UserId , setuserID] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("");

const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");

  // QR Code states
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
  const [uploadingQR, setUploadingQR] = useState(false);


  // Password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  // Fetch profile data
 useEffect(() => {
  const fetchCurrent = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await axios.get(`/microestate/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("microestate_user")}`,
        },
        withCredentials: true,
      });

      const userData = response.data.user;
      console.log("response", userData);

      // Set the values
      setName(userData.firstName || "");
      setlastname(userData.lastName || "")
      setPhone(userData.phone || "");
      setrole(userData.role || "")
      setuserID(userData._id || " ")
      setEmail(userData.email || " ")
      setQrCodeUrl(userData.qrCode || "");

     } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  fetchCurrent();
}, [userId]);


  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Password changed successfully!");
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setExpanded({ ...expanded, password: false });
      setTimeout(() => setSuccess(""), 2000);
    }, 1200);
  };

  const handleQrCodeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload JPEG, PNG, or WebP images only.");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size too large. Please upload an image smaller than 5MB.");
      return;
    }

    setQrCodeFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setQrCodePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadQrCode = async () => {
    if (!qrCodeFile) {
      toast.error("Please select a QR code image first");
      return;
    }

    try {
      setUploadingQR(true);
      const formData = new FormData();
      formData.append("qrCode", qrCodeFile);

      const response = await axios.post("/microestate/api/landlord/qr-code", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setQrCodeUrl(response.data.data.qrCodeUrl);
        setQrCodeFile(null);
        setQrCodePreview(null);
        toast.success("QR code uploaded successfully!");
        setExpanded({ ...expanded, qrCode: false });
      } else {
        toast.error(response.data.message || "Failed to upload QR code");
      }
    } catch (error: any) {
      console.error("Error uploading QR code:", error);
      toast.error(error.response?.data?.message || "Failed to upload QR code");
    } finally {
      setUploadingQR(false);
    }
  };

  const handleDeleteQrCode = async () => {
    if (!qrCodeUrl) return;

    if (!confirm("Are you sure you want to delete your QR code? This will remove payment functionality for your tenants.")) {
      return;
    }

    try {
      setUploadingQR(true);
      const response = await axios.delete("/microestate/api/landlord/qr-code");

      if (response.data.success) {
        setQrCodeUrl("");
        toast.success("QR code deleted successfully!");
      } else {
        toast.error(response.data.message || "Failed to delete QR code");
      }
    } catch (error: any) {
      console.error("Error deleting QR code:", error);
      toast.error(error.response?.data?.message || "Failed to delete QR code");
    } finally {
      setUploadingQR(false);
    }
  };

  const cancelQrCodeUpload = () => {
    setQrCodeFile(null);
    setQrCodePreview(null);
    setExpanded({ ...expanded, qrCode: false });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-8 flex flex-col gap-8">
        {/* Profile Overview */}

        <div className="bg-[#181c24] border border-orange-500/20 rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row gap-8 items-center animate-fadeIn">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full border-4 border-orange-500 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-4xl select-none">
                {name ? name.charAt(0).toUpperCase() : "L"}
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2 items-center sm:items-start">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{name} {lastname}</span>
                <span className="ml-2 px-2 py-1 text-xs rounded bg-green-500/20 text-green-400 font-semibold">Verified Landlord</span>
            </div>
            <div className="flex gap-2 flex-wrap text-sm text-gray-400">
              <span>ID: {userId}</span>
              <span>Role: {role}</span>
                         </div>
            {/* <div className="flex gap-2 flex-wrap text-sm text-gray-400">
              <span>Properties: {mockProfile.properties}</span>
              <span>Tenants: {mockProfile.tenants}</span>
              <span>Monthly Income: ₹{mockProfile.monthlyIncome.toLocaleString()}</span>
            </div> */}
          </div>
        </div>
        {/* Personal Info Form */}
        <form className="bg-[#181c24] border border-orange-500/20 rounded-2xl shadow-xl p-6 animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-6" >
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Full Name</label>
            <input type="text" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={name}  onChange={e => setName(e.target.value)} placeholder="Enter full name" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Email</label>
            <input type="email" className="w-full p-3 rounded bg-[#23232a] text-gray-400 border border-orange-500/20" value= {email} readOnly />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Phone Number</label>
            <input type="tel" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter phone number" required />
          </div>
          {/* <div>
            <label className="block text-sm font-semibold text-white mb-1">Alternate Contact</label>
            <input type="tel" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={altContact} onChange={e => setAltContact(e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Emergency Contact</label>
            <input type="tel" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} placeholder="Enter emergency contact" required />
          </div> */}
          {/* <div>
            <label className="block text-sm font-semibold text-white mb-1">Date of Birth</label>
            <input type="date" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={dob} onChange={e => setDob(e.target.value)} required />
          </div> */}
          {/* <div>
            <label className="block text-sm font-semibold text-white mb-1">Gender</label>
            <select className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={gender} onChange={e => setGender(e.target.value)} required>
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div> */}
          {/* <div>
            <label className="block text-sm font-semibold text-white mb-1">Aadhaar / Govt. ID</label>
            <input type="text" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={aadhaar} onChange={e => setAadhaar(e.target.value)} placeholder="Enter Aadhaar or Govt. ID" required />
          </div> */}
          {/* <div className="md:col-span-2 flex gap-4 justify-end mt-2">
            <button type="button" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition">Cancel</button>
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition">Save Changes</button>
          </div> */}
               </form>
        {/* Change Password Section */}
        <div className="bg-[#181c24] border border-orange-500/20 rounded-2xl shadow-xl p-6 animate-fadeIn">
          <button type="button" className="flex items-center gap-2 text-orange-400 font-bold mb-4" onClick={() => setExpanded({ ...expanded, password: !expanded.password })}>
            <KeyRound className="w-5 h-5" />
            Change Password
            <span className="ml-2 text-xs text-gray-400">{expanded.password ? "(Hide)" : "(Show)"}</span>
          </button>
          {expanded.password && (
            <form className="flex flex-col gap-3 mt-2" onSubmit={handleChangePassword}>
              <input type="password" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" placeholder="Old Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
              <input type="password" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              <input type="password" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg">Update Password</button>
            </form>
          )}
        </div>

        {/* QR Code Management Section */}
        <div className="bg-[#181c24] border border-orange-500/20 rounded-2xl shadow-xl p-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <button 
              type="button" 
              className="flex items-center gap-2 text-orange-400 font-bold" 
              onClick={() => setExpanded({ ...expanded, qrCode: !expanded.qrCode })}
            >
              <QrCode className="w-5 h-5" />
              Payment QR Code
              <span className="ml-2 text-xs text-gray-400">{expanded.qrCode ? "(Hide)" : "(Show)"}</span>
            </button>
            {qrCodeUrl && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Active</span>
            )}
          </div>

          {/* Current QR Code Display */}
          {qrCodeUrl && !expanded.qrCode && (
            <div className="mb-4 p-4 bg-[#23232a] rounded-lg">
              <div className="flex items-center gap-4">
                <img 
                  src={qrCodeUrl} 
                  alt="Payment QR Code" 
                  className="w-16 h-16 object-contain rounded-lg border border-orange-500/20"
                />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Payment QR Code Active</p>
                  <p className="text-gray-400 text-xs">Tenants can scan this code to pay rent</p>
                </div>
                <button
                  onClick={handleDeleteQrCode}
                  disabled={uploadingQR}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete QR Code"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* QR Code Management Interface */}
          {expanded.qrCode && (
            <div className="space-y-4">
              {/* Current QR Code (if exists) */}
              {qrCodeUrl && (
                <div className="p-4 bg-[#23232a] rounded-lg">
                  <h4 className="text-white font-medium mb-3">Current QR Code</h4>
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={qrCodeUrl} 
                      alt="Current Payment QR Code" 
                      className="w-24 h-24 object-contain rounded-lg border border-orange-500/20"
                    />
                    <div className="flex-1">
                      <p className="text-green-400 text-sm font-medium">✓ QR Code Active</p>
                      <p className="text-gray-400 text-xs mt-1">
                        Tenants can scan this code to pay rent directly to your account
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDeleteQrCode}
                    disabled={uploadingQR}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete QR Code
                  </button>
                </div>
              )}

              {/* Upload New QR Code */}
              <div className="p-4 bg-[#23232a] rounded-lg">
                <h4 className="text-white font-medium mb-3">
                  {qrCodeUrl ? "Update QR Code" : "Upload Payment QR Code"}
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  Upload your UPI QR code image so tenants can pay rent directly. 
                  Supported formats: JPEG, PNG, WebP (max 5MB)
                </p>

                {/* File Upload */}
                <div className="mb-4">
                  <label className="block w-full cursor-pointer">
                    <div className="border-2 border-dashed border-orange-500/30 rounded-lg p-6 text-center hover:border-orange-500/50 transition-colors">
                      <Upload className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                      <p className="text-white text-sm font-medium">Click to select QR code image</p>
                      <p className="text-gray-400 text-xs mt-1">JPEG, PNG, WebP up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleQrCodeFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preview */}
                {qrCodePreview && (
                  <div className="mb-4 p-4 border border-orange-500/20 rounded-lg">
                    <div className="flex items-center gap-4 mb-3">
                      <img 
                        src={qrCodePreview} 
                        alt="QR Code Preview" 
                        className="w-20 h-20 object-contain rounded border border-gray-600"
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">Preview</p>
                        <p className="text-gray-400 text-xs">
                          {qrCodeFile?.name} ({(qrCodeFile?.size || 0 / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                      <button
                        onClick={cancelQrCodeUpload}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {qrCodeFile && (
                    <button
                      onClick={handleUploadQrCode}
                      disabled={uploadingQR}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      {uploadingQR ? "Uploading..." : qrCodeUrl ? "Update QR Code" : "Upload QR Code"}
                    </button>
                  )}
                  <button
                    onClick={cancelQrCodeUpload}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  How to get your QR Code
                </h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Open your UPI app (GPay, PhonePe, Paytm, etc.)</li>
                  <li>• Go to "Receive Money" or "QR Code" section</li>
                  <li>• Download or screenshot your QR code</li>
                  <li>• Upload the image here</li>
                </ul>
              </div>
            </div>
          )}
        </div>  
      </main>
    </div>
  );
}

