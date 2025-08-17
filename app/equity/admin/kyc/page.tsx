"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import EquityNavigation from "@/app/equity/components/EquityNavigation";
import { toast } from "sonner";
import { UserAPI } from "@/app/lib/api-helpers";

export default function AdminKycPage() {
  const router = useRouter();
  const [pending, setPending] = useState<any[]>([]);
  const [reviewed, setReviewed] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Check if user has auth token
        const authToken = sessionStorage.getItem("authToken");
        if (!authToken) {
          toast.error("Please login to access this page. Redirecting to home page!");
          setTimeout(() => {
            router.push("/");
          }, 1000);
          return;
        }

        // Get user profile to check admin status
        const userData = await UserAPI.getProfile();
        
        console.log("🔍 User data retrieved:", { 
          email: userData.email, 
          admin: userData.admin, 
          role: userData.role,
          id: userData._id 
        });
        
        // Check if user has admin privileges (either admin boolean is true OR role is "admin")
        const isAdmin = userData.admin === true || userData.role === "admin";
        
        console.log("🔐 Admin check result:", {
          adminField: userData.admin,
          roleField: userData.role,
          isAdminResult: isAdmin
        });
        
        if (!isAdmin) {
          console.log("❌ Access denied - User is not admin:", { admin: userData.admin, role: userData.role });
          toast.error("You do not have permission to access this page. Admin access required.");
          setTimeout(() => {
            router.push("/equity");
          }, 1500);
          return;
        }

        console.log("✅ Admin access verified for user:", userData.email);
        setIsCheckingAuth(false);
        
      } catch (error) {
        console.error("❌ Failed to verify admin access:", error);
        toast.error("Failed to verify your permissions. Please try again later.");
        setTimeout(() => {
          router.push("/equity");
        }, 1500);
      }
    };

    checkAdminAccess();
  }, [router]);

  // Fetch KYC requests from backend
  const fetchKyc = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/kyc", { method: "GET" });
      const data = await res.json();
      if (res.ok) {
        setPending(data.pending || []);
        setReviewed(data.reviewed || []);
      }
    } catch (err) {
      setPending([]);
      setReviewed([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Only fetch KYC data after admin access is verified
    if (!isCheckingAuth) {
      fetchKyc();
    }
  }, [isCheckingAuth]);

  const handleAction = async (id: string, action: "accepted" | "rejected") => {
    setActionLoading(id + action);
    try {
      const res = await fetch(`/api/admin/kyc/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      const data = await res.json();
      if (res.ok) {
        if (action === "accepted") {
          setToastMessage(`KYC for ${data.kyc.name} has been ${action}. User can now post properties.`);
        } else {
          setToastMessage(`KYC for ${data.kyc.name} has been ${action}.`);
        }
        setTimeout(() => setToastMessage(""), 5000);
        // Re-fetch KYC requests to update UI
        fetchKyc();
      }
    } catch (err) {
      setToastMessage("Failed to update KYC status.");
      setTimeout(() => setToastMessage(""), 3000);
    }
    setActionLoading(null);
  };

  // Show loading screen while checking admin access
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#2d1a4a] to-[#a78bfa]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-black via-[#2d1a4a] to-[#a78bfa] px-4 relative">
      <EquityNavigation />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-4xl mx-auto mt-24 mb-12"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Admin KYC Review
        </h2>
        {toastMessage && (
          <div className="mb-6 text-center text-green-400 font-semibold bg-black/60 rounded-lg py-2">
            {toastMessage}
          </div>
        )}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Pending KYC Requests</h3>
          {loading ? (
            <div className="text-gray-400 text-center">Loading...</div>
          ) : pending.length === 0 ? (
            <div className="text-gray-400 text-center">No pending KYC requests.</div>
          ) : (
            <div className="grid gap-6">
              {pending.map((req) => (
                <div key={req._id} className="bg-black/80 rounded-xl p-6 border border-purple-400/30 flex flex-col sm:flex-row items-center gap-6 shadow-lg">
                  <div className="flex flex-col items-center gap-2">
                    <img src={req.panImageUrl || "https://via.placeholder.com/120x80.png?text=PAN"} alt="PAN" className="w-32 h-20 object-cover rounded-lg border border-purple-400/30" />
                    {req.panImageUrl && (
                      <button
                        className="mt-1 px-3 py-1 rounded bg-gradient-to-r from-purple-500 to-purple-700 text-white text-xs font-semibold shadow-md hover:from-purple-600 hover:to-purple-800 transition-all duration-300"
                        onClick={() => setModalImage(req.panImageUrl)}
                      >
                        View
                      </button>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-lg font-bold text-white mb-1">{req.name}</div>
                    <div className="text-purple-300 text-sm mb-1">{req.email}</div>
                    <div className="text-gray-300 text-sm mb-1">PAN: <span className="font-mono text-purple-400">{req.pan}</span></div>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <Button
                      className="bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-2 rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300"
                      onClick={() => handleAction(req._id, "accepted")}
                      disabled={actionLoading === req._id + "accepted"}
                    >
                      {actionLoading === req._id + "accepted" ? "Accepting..." : "Accept"}
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold py-2 rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-300"
                      onClick={() => handleAction(req._id, "rejected")}
                      disabled={actionLoading === req._id + "rejected"}
                    >
                      {actionLoading === req._id + "rejected" ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Reviewed KYC Requests</h3>
          {loading ? (
            <div className="text-gray-400 text-center">Loading...</div>
          ) : reviewed.length === 0 ? (
            <div className="text-gray-400 text-center">No reviewed KYC requests.</div>
          ) : (
            <div className="grid gap-6">
              {reviewed.map((req) => (
                <div key={req._id} className={`bg-black/70 rounded-xl p-6 border ${req.status === "accepted" ? "border-green-500/30" : "border-red-500/30"} flex flex-col sm:flex-row items-center gap-6 shadow-lg`}>                  <img src={req.panImageUrl || "https://via.placeholder.com/120x80.png?text=PAN"} alt="PAN" className="w-32 h-20 object-cover rounded-lg border border-purple-400/30" />
                  <div className="flex-1 text-left">
                    <div className="text-lg font-bold text-white mb-1">{req.name}</div>
                    <div className="text-purple-300 text-sm mb-1">{req.email}</div>
                    <div className="text-gray-300 text-sm mb-1">PAN: <span className="font-mono text-purple-400">{req.pan}</span></div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-semibold text-center ${req.status === "accepted" ? "bg-green-700 text-green-200" : "bg-red-700 text-red-200"}`}>
                    {req.status === "accepted" ? "Accepted" : "Rejected"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Decorative blurred gradients */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500 rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-700 rounded-full opacity-20 blur-2xl" />
      </div>
      {/* Modal for viewing PAN image */}
      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-black rounded-lg p-4 shadow-2xl max-w-2xl w-full flex flex-col items-center">
            <img src={modalImage} alt="PAN Full" className="max-h-[70vh] rounded-lg border border-purple-400/30 mb-4" />
            <button
              className="px-6 py-2 rounded bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold shadow-md hover:from-purple-600 hover:to-purple-800 transition-all duration-300"
              onClick={() => setModalImage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}