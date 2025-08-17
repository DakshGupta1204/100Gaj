"use client";

import React, { useEffect, useState } from "react";
import {
  Building,
  Calendar,
  CreditCard,
  QrCode,
  User,
  Mail,
  Phone,
  Edit,
  Home,
  AlertTriangle,
  Settings,
  Loader2,
} from "lucide-react";
import TenantNavbar from "./components/TenantNavbar";
import TenantFooter from "./components/TenantFooter";
import { FloatingCircles, ParticleBackground, AnimatedGradient } from "../../_components/Background";
import { motion } from "framer-motion";
import { useAuth } from "../../Context/AuthProvider";
import axios from "axios";
import { toast } from "sonner";

// --- API Response Interfaces ---
interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: any;
}

interface TenantProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePic?: string;
  role: string;
}
interface PopulatedLandlord {
  _id: string;
  name: string;
  email: string;
  phone: string;
  qrCode?: string;
}

interface PopulatedProperty {
  _id: string;
  title: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface LeaseDetails {
  _id: string;
  propertyId: PopulatedProperty;
  landlordId: PopulatedLandlord;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  rentDueDate: number;
  status: "draft" | "active" | "expired" | "terminated";
  terms: string;
}

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  qrCodeUrl?: string;
}

function QRCodeModal({ isOpen, onClose, amount, qrCodeUrl }: QRCodeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Pay Rent</h3>
          <div className="text-lg text-gray-600 mb-6">Amount: ₹{amount.toLocaleString()}</div>
          
          {/* QR Code */}
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
            <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="Payment QR Code" 
                  className="w-44 h-44 object-contain rounded-lg"
                />
              ) : (
                <QrCode className="w-24 h-24 text-gray-400" />
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            Scan this QR code with your UPI app to pay rent
          </p>
          
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TenantDashboard() {
  const { user } = useAuth();

  const [lease, setLease] = useState<LeaseDetails | null>(null);
  const [tenantProfile, setTenantProfile] = useState<TenantProfile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [wasRemoved, setWasRemoved] = useState(false);
  const [removalMessage, setRemovalMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTenantData = async () => {
      if (!user?.id) {
        setError("Please log in to view your dashboard.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("🔍 Fetching tenant data for user:", user.id);
        
        // Fetch all data in parallel
        const [leaseResponse, profileResponse, notificationsResponse] = await Promise.all([
          axios.get("/microestate/api/tenants/property"),
          axios.get(`/microestate/api/users/${user.id}`),
          axios.get(`/api/users/notifications?unread=false&limit=5`).catch(() => ({ data: { notifications: [] } }))
        ]);

        // Handle lease data
        if (leaseResponse.data && leaseResponse.data.hasTerminatedLeases === true && leaseResponse.data.activeLeases?.length === 0) {
          // Tenant was removed from property
          setWasRemoved(true);
          setRemovalMessage(leaseResponse.data.message || "You have been removed from your property.");
          setLease(null);
        } else if (
          leaseResponse.data &&
          Array.isArray(leaseResponse.data) &&
          leaseResponse.data.length > 0
        ) {
          const activeLease =
            leaseResponse.data.find((l) => l.status === "active") ||
            leaseResponse.data[0];
          setLease(activeLease);
          setWasRemoved(false);
          console.log("Lease data fetched:", activeLease);
        } else {
          setError("No active lease found for your account.");
        }

        // Handle tenant profile data
        if (profileResponse.data && profileResponse.data.user) {
          setTenantProfile(profileResponse.data.user);
          console.log("Tenant profile fetched:", profileResponse.data.user);
        }

        // Handle notifications data
        if (notificationsResponse.data && notificationsResponse.data.notifications) {
          setNotifications(notificationsResponse.data.notifications);
          console.log("Notifications fetched:", notificationsResponse.data.notifications);
        }

      } catch (err: any) {
        console.error("Error fetching tenant data:", err);
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching your details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-white ml-4">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col overflow-x-hidden">
      <FloatingCircles />
      <ParticleBackground />
      <AnimatedGradient />
      <TenantNavbar />

      {error && !lease && !tenantProfile && !wasRemoved && (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-white z-10">
          <AlertTriangle className="w-16 h-16 text-red-500 mt-16 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Could Not Load Dashboard</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      )}

      {wasRemoved && tenantProfile && (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-white z-10 px-4">
          <motion.div
            className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-8 max-w-md mx-auto mt-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-red-400">Property Access Removed</h2>
            <p className="text-gray-300 mb-6">{removalMessage}</p>
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">What happened?</h3>
              <p className="text-sm text-gray-400">
                Your landlord has removed you from the property. This could be due to lease termination, 
                property transfer, or other administrative reasons.
              </p>
            </div>
            <div className="text-sm text-gray-400">
              <p>If you believe this is an error or need more information, please contact your landlord directly.</p>
            </div>
          </motion.div>
        </div>
      )}

      {lease && tenantProfile && (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-10 md:py-16 z-10 mt-[72px]">
          {/* Welcome/Profile Section */}
          <motion.section
            className="flex flex-col md:flex-row gap-8 mb-10 items-center md:items-start"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center gap-6 bg-white/5 backdrop-blur-xl border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 w-full md:w-auto">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-4xl font-bold text-white">
                {tenantProfile.profilePic ? (
                  <img
                    src={tenantProfile.profilePic}
                    alt="avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  tenantProfile.firstName[0]?.toUpperCase() || 'T'
                )}
              </div>
              <div>
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                  {tenantProfile.firstName} {tenantProfile.lastName}{" "}
                  <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 px-2 py-1 rounded">
                    ID: {tenantProfile._id.slice(-6)}
                  </span>
                </div>
                <div className="text-gray-400 text-sm mt-1">Welcome back!</div>
                <button className="mt-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:from-orange-600 hover:to-red-600 transition-all text-sm">
                  <Edit className="w-4 h-4" /> Edit Profile
                </button>
              </div>
            </div>
          </motion.section>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Property Details */}
            <motion.section
              className="col-span-1 bg-white/5 backdrop-blur-xl border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(251,146,60,0.35)] hover:border-orange-400"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Home className="w-6 h-6 text-orange-400" />
                <span className="text-lg font-bold text-white">
                  Current Property
                </span>
              </div>
              <div className="text-white font-semibold text-xl">
                {lease.propertyId.title}
              </div>
              <div className="text-gray-300 text-sm mb-2">{`${lease.propertyId.address.street}, ${lease.propertyId.address.city}, ${lease.propertyId.address.state}`}</div>
              <div className="flex flex-col gap-1 text-sm">
                <span>
                  <span className="text-gray-400">Lease:</span>{" "}
                  {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
                </span>
                <span>
                  <span className="text-gray-400">Rent Due Day:</span>{" "}
                  {lease.rentDueDate}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <User className="w-4 h-4 text-orange-400" />
                <span className="text-white font-semibold">
                  Landlord: {lease.landlordId.name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-xs">
                <Phone className="w-4 h-4 text-orange-400" />{" "}
                {lease.landlordId.phone}
                <Mail className="w-4 h-4 text-orange-400 ml-4" />{" "}
                {lease.landlordId.email}
              </div>
            </motion.section>

            {/* Payment Status */}
            <motion.section
              className="col-span-1 bg-white/5 backdrop-blur-xl border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(251,146,60,0.35)] hover:border-orange-400"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-6 h-6 text-orange-400" />
                <span className="text-lg font-bold text-white">
                  Rent Information
                </span>
              </div>
              <div className="flex items-center gap-2 text-2xl font-bold text-white">
                ₹{lease.monthlyRent.toLocaleString()}
                <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 px-2 py-1 rounded">
                  per month
                </span>
              </div>
              <div className="flex flex-col gap-1 text-sm text-gray-300">
                <span>
                  <span className="text-gray-400">Security Deposit:</span> ₹{lease.securityDeposit.toLocaleString()}
                </span>
                <span>
                  <span className="text-gray-400">Due Date:</span> {lease.rentDueDate} of every month
                </span>
              </div>
              <button 
                onClick={() => setShowQRModal(true)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold flex items-center gap-2 justify-center hover:from-orange-600 hover:to-red-600 transition-all text-lg"
              >
                <QrCode className="w-5 h-5" /> Pay Now
              </button>
            </motion.section>

            {/* Activity & Reminders (Dynamic Data) */}
            <motion.section
              className="col-span-1 lg:col-span-1 bg-white/5 backdrop-blur-xl border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(251,146,60,0.35)] hover:border-orange-400"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-orange-400" />
                <span className="text-lg font-bold text-white">
                  Activity & Reminders
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {notifications.length > 0 ? (
                  notifications.slice(0, 4).map((notification, i) => (
                    <div key={notification._id} className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <span className="text-gray-300 flex-1">{notification.message}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm">No recent activities or reminders</div>
                )}
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-white">
                  <Settings className="w-4 h-4" /> System Status
                </div>
                <div className="text-gray-400 text-sm">All systems operational</div>
              </div>
            </motion.section>
          </div>
        </main>
      )}
      
      {/* QR Code Modal */}
      {lease && (
        <QRCodeModal 
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          amount={lease.monthlyRent}
          qrCodeUrl={lease.landlordId?.qrCode}
        />
      )}
      
      <TenantFooter />
    </div>
  );
}
