"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Eye, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import EquityNavigation from "../../components/EquityNavigation";
import BackgroundVideo from "../../components/BackgroundVideo";
import EquityAnimatedBackground from "../../EquityAnimatedBackground";
import axios from "axios";
export default function AdminKYCVerificationPage() {
    const [kycSubmissions, setKYCSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    useEffect(() => {
        fetchKYCSubmissions();
    }, []);
    const fetchKYCSubmissions = async () => {
        try {
            const response = await axios.get("/api/equity/admin/kyc-submissions");
            setKYCSubmissions(response.data.submissions);
        }
        catch (error) {
            console.error("Error fetching KYC submissions:", error);
            toast.error("Failed to fetch KYC submissions");
        }
        finally {
            setLoading(false);
        }
    };
    const handleVerification = async (submissionId, status) => {
        try {
            await axios.post(`/api/equity/admin/kyc-verify`, {
                submissionId,
                status,
            });
            // Update local state
            setKYCSubmissions(prev => prev.map(sub => sub.id === submissionId ? Object.assign(Object.assign({}, sub), { status }) : sub));
            // Show success message
            toast.success(`KYC ${status} successfully`);
            // Refresh the list
            fetchKYCSubmissions();
        }
        catch (error) {
            console.error("Error verifying KYC:", error);
            toast.error("Failed to verify KYC");
        }
    };
    return (<div className="min-h-screen bg-black">
      <BackgroundVideo />
      <EquityAnimatedBackground />
      <EquityNavigation />

      <div className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#a78bfa] to-white mb-4">
              KYC Verification Dashboard
            </h1>
            <p className="text-gray-400">
              Review and verify user KYC submissions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Submissions List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-2xl font-semibold text-white mb-6">Pending Verifications</h2>
              {loading ? (<div className="text-center text-gray-400">Loading submissions...</div>) : (kycSubmissions
            .filter(sub => sub.status === "pending")
            .map(submission => (<motion.div key={submission.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-[#14141F]/80 backdrop-blur-xl border border-[#a78bfa]/20 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:border-[#a78bfa]/50 ${(selectedSubmission === null || selectedSubmission === void 0 ? void 0 : selectedSubmission.id) === submission.id ? "border-[#a78bfa]" : ""}`} onClick={() => setSelectedSubmission(submission)}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">{submission.userName}</h3>
                        <span className="text-sm text-[#a78bfa]">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{submission.email}</p>
                    </motion.div>)))}
            </div>

            {/* Submission Details */}
            <div className="lg:col-span-2">
              {selectedSubmission ? (<div className="bg-[#14141F]/80 backdrop-blur-xl border-2 border-[#a78bfa] rounded-xl p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-white mb-2">
                        {selectedSubmission.userName}
                      </h2>
                      <p className="text-gray-400">Submitted on {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleVerification(selectedSubmission.id, "approved")} className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="w-4 h-4 mr-2"/>
                        Approve
                      </Button>
                      <Button onClick={() => handleVerification(selectedSubmission.id, "rejected")} variant="destructive">
                        <XCircle className="w-4 h-4 mr-2"/>
                        Reject
                      </Button>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400">PAN Number</p>
                        <p className="text-white">{selectedSubmission.panNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Date of Birth</p>
                        <p className="text-white">{selectedSubmission.dateOfBirth}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-400">Address</p>
                        <p className="text-white">{selectedSubmission.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Documents</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/30 rounded-lg p-4">
                        <p className="text-gray-400 mb-2">PAN Card</p>
                        <div className="flex gap-2">
                          <Button variant="outline" className="border-[#a78bfa]/50">
                            <Eye className="w-4 h-4 mr-2"/>
                            View
                          </Button>
                          <Button variant="outline" className="border-[#a78bfa]/50">
                            <Download className="w-4 h-4 mr-2"/>
                            Download
                          </Button>
                        </div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4">
                        <p className="text-gray-400 mb-2">Aadhaar Card</p>
                        <div className="flex gap-2">
                          <Button variant="outline" className="border-[#a78bfa]/50">
                            <Eye className="w-4 h-4 mr-2"/>
                            View
                          </Button>
                          <Button variant="outline" className="border-[#a78bfa]/50">
                            <Download className="w-4 h-4 mr-2"/>
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Bank Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400">Bank Name</p>
                        <p className="text-white">{selectedSubmission.bankDetails.bankName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Account Number</p>
                        <p className="text-white">{selectedSubmission.bankDetails.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">IFSC Code</p>
                        <p className="text-white">{selectedSubmission.bankDetails.ifscCode}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Branch</p>
                        <p className="text-white">{selectedSubmission.bankDetails.branch}</p>
                      </div>
                    </div>
                  </div>
                </div>) : (<div className="bg-[#14141F]/80 backdrop-blur-xl border border-[#a78bfa]/20 rounded-xl p-8 text-center">
                  <Mail className="w-12 h-12 text-[#a78bfa] mx-auto mb-4"/>
                  <h3 className="text-xl font-semibold text-white mb-2">Select a Submission</h3>
                  <p className="text-gray-400">
                    Click on a submission from the list to view its details
                  </p>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>);
}
