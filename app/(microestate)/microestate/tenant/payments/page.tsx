"use client";

import React, { useState, useEffect } from "react";
import { User, Home, Calendar, Phone, CreditCard, QrCode, Info, CheckCircle, AlertCircle, XCircle, X, UserCheck, Mail } from "lucide-react";
import TenantNavbar from "../components/TenantNavbar";
import TenantFooter from "../components/TenantFooter";
import { motion } from "framer-motion";
import { useTenantLeaseStatus } from "../../hooks/useTenantLeaseStatus";
import { useAuth } from "@/app/(microestate)/Context/AuthProvider";


// TypeScript interfaces
interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "landlord" | "tenant";
  profileImage?: string;
  qrCode?: string;
}

// Types for API response
interface Landlord {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  qrCode?: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Property {
  _id: string;
  title: string;
  address: Address;
  city: string;
  state: string;
  pincode: string;
}

interface Lease {
  _id: string;
  propertyId: Property;
  tenantId: UserData;
  landlordId: UserData;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  rentDueDate: number; // Day of the month when rent is due (1-31)
  status: string;
  terms: string;
}

export default function TenantPaymentsPage() {
  const { user } = useAuth();
  const { status: leaseStatus, loading: leaseLoading, error: leaseError } = useTenantLeaseStatus(user?.id);
  
  const [leaseData, setLeaseData] = useState<Lease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);

  // Use the lease status from the hook
  useEffect(() => {
    if (!leaseLoading) {
      if (leaseStatus.wasRemoved) {
        setError("You have been removed from your property. Payment functionality is not available.");
        setLoading(false);
        return;
      }
      
      if (leaseStatus.hasActiveLeases && leaseStatus.leases && leaseStatus.leases.length > 0) {
        setLeaseData(leaseStatus.leases[0]);
        setLoading(false);
      } else {
        setError(leaseError || "No active lease found for your account.");
        setLoading(false);
      }
    }
  }, [leaseStatus, leaseLoading, leaseError]);

  // Calculate payment overview from lease data
  const getPaymentOverview = () => {
    if (!leaseData) return null;
    
    const currentDate = new Date();
    const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), leaseData.rentDueDate);
    
    // If due date has passed this month, set to next month
    if (dueDate < currentDate) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }
    
    const timeDiff = dueDate.getTime() - currentDate.getTime();
    const daysUntilDue = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return {
      rentAmount: leaseData.monthlyRent,
      dueDate: `${leaseData.rentDueDate}${getOrdinalSuffix(leaseData.rentDueDate)} of every month`,
      status: daysUntilDue > 0 ? "Pending" : "Overdue",
      nextDueIn: daysUntilDue,
      currentBalance: 0,
    };
  };

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const paymentOverview = getPaymentOverview();

  if (loading || leaseLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col overflow-x-hidden mt-[72px]">
        <TenantNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Loading lease information...</div>
        </div>
        <TenantFooter />
      </div>
    );
  }

  if (leaseStatus.wasRemoved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col overflow-x-hidden mt-[72px]">
        <TenantNavbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <motion.div
            className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-8 max-w-md mx-auto text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-red-400">Payment Access Unavailable</h2>
            <p className="text-gray-300 mb-6">{leaseStatus.removalMessage}</p>
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Payment Services Suspended</h3>
              <p className="text-sm text-gray-400">
                Since you have been removed from the property, payment functionality is no longer available. 
                Please contact your former landlord for any outstanding payment matters.
              </p>
            </div>
          </motion.div>
        </div>
        <TenantFooter />
      </div>
    );
  }

  if (error || !leaseData || !paymentOverview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col overflow-x-hidden mt-[72px]">
        <TenantNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-400 text-xl">{error || 'No lease data available'}</div>
        </div>
        <TenantFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col overflow-x-hidden mt-[72px]">
      <TenantNavbar />
      {/* Tenant Info Section */}
      <motion.div
        className="max-w-6xl mx-auto w-full mt-10 mb-6 px-6 py-6 rounded-2xl bg-white/5 border-2 border-gradient-to-r from-orange-500 to-red-500 shadow-xl flex flex-col md:flex-row gap-6 items-center md:items-start"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-3 text-white text-2xl font-bold">
            <User className="w-7 h-7 text-orange-400" /> 
            {leaseData.tenantId.firstName} {leaseData.tenantId.lastName}
          </div>
          <div className="text-orange-400 text-xs font-semibold bg-orange-500/10 px-2 py-1 rounded w-fit">
            Tenant ID: {leaseData.tenantId._id}
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm mt-2">
            <Home className="w-4 h-4 text-orange-400" /> 
            {leaseData.propertyId.title} - {leaseData.propertyId.address.street}, {leaseData.propertyId.address.city}, {leaseData.propertyId.address.state} {leaseData.propertyId.address.zipCode}
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Calendar className="w-4 h-4 text-orange-400" /> 
            Lease: {new Date(leaseData.startDate).toLocaleDateString()} - {new Date(leaseData.endDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <UserCheck className="w-4 h-4 text-orange-400" /> 
            Landlord: {leaseData.landlordId.firstName} {leaseData.landlordId.lastName}
          </div>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all text-sm"
          onClick={() => setShowContactPopup(true)}
        >
          <Phone className="w-4 h-4" /> Contact Landlord
        </button>
      </motion.div>

      {/* Payment Overview */}
      <div className="max-w-6xl mx-auto w-full mb-8 px-2">
        <motion.div
          className="bg-white/5 border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 flex flex-col gap-2 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(251,146,60,0.35)] hover:border-orange-400"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 text-lg font-bold text-white"><CreditCard className="w-6 h-6 text-orange-400" /> Rent Amount: <span className="text-orange-400">₹{paymentOverview.rentAmount}/month</span></div>
          <div className="text-gray-300 text-sm flex items-center gap-2"><Calendar className="w-4 h-4 text-orange-400" /> Due Date: {paymentOverview.dueDate}</div>
          <div className="flex items-center gap-2 text-sm">
            Status:
            {paymentOverview.status === "Paid" && <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Paid</span>}
            {paymentOverview.status === "Pending" && <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-bold flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Pending</span>}
            {paymentOverview.status === "Overdue" && <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-bold flex items-center gap-1"><XCircle className="w-4 h-4" /> Overdue</span>}
          </div>
          <div className="text-sm text-gray-300">Next Payment Due In: <span className="text-orange-400 font-bold">{paymentOverview.nextDueIn} days</span></div>
          <div className="text-sm text-gray-300">Current Balance: <span className="text-orange-400 font-bold">₹{paymentOverview.currentBalance}</span></div>
          <button 
            className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold flex items-center gap-2 justify-center hover:from-orange-600 hover:to-red-600 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setShowQRPopup(true)}
            disabled={!leaseData.landlordId.qrCode}
          >
            <QrCode className="w-5 h-5" /> 
            {leaseData.landlordId.qrCode ? 'Pay Rent Now' : 'QR Code Not Available'}
          </button>
        </motion.div>
      </div>

      {/* FAQs */}
      <motion.div
        className="max-w-6xl mx-auto w-full mb-16 bg-white/5 border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 flex flex-col gap-4 px-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="text-lg font-bold text-white flex items-center gap-2"><Info className="w-5 h-5 text-orange-400" /> FAQs on Rent Payment</div>
        <ul className="text-gray-300 text-sm list-disc pl-6 mt-2 flex flex-col gap-2">
          <li>How do I pay my rent online?</li>
          <li>What payment methods are supported?</li>
          <li>How do I enable auto-pay?</li>
          <li>How do I download my rent receipts?</li>
          <li>Who do I contact for payment issues?</li>
        </ul>
      </motion.div>

      {/* QR Code Popup Modal */}
      {showQRPopup && leaseData.landlordId.qrCode && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowQRPopup(false)}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 max-w-md w-full relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setShowQRPopup(false)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* QR Code Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Pay Rent</h2>
              <p className="text-gray-600">
                Scan QR code to pay ₹{paymentOverview.rentAmount} to {leaseData.landlordId.firstName} {leaseData.landlordId.lastName}
              </p>
            </div>

            {/* QR Code Image */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                <img
                  src={leaseData.landlordId.qrCode}
                  alt="Payment QR Code"
                  className="w-64 h-64 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="w-64 h-64 bg-gray-100 flex items-center justify-center text-gray-500 hidden">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 mx-auto mb-2" />
                    <p>QR Code not available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-gray-800">₹{paymentOverview.rentAmount}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">To:</span>
                <span className="font-bold text-gray-800">{leaseData.landlordId.firstName} {leaseData.landlordId.lastName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Property:</span>
                <span className="font-bold text-gray-800 text-sm">{leaseData.propertyId.title}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                onClick={() => setShowQRPopup(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                onClick={() => {
                  // Here you could add logic to track payment completion
                  setShowQRPopup(false);
                  alert('Please complete the payment using your preferred payment app');
                }}
              >
                Payment Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Contact Landlord Popup */}
      {showContactPopup && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Contact Landlord</h2>
              <button
                onClick={() => setShowContactPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Landlord Info */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {leaseData?.landlordId.firstName} {leaseData?.landlordId.lastName}
              </h3>
              <p className="text-gray-600">Property Owner</p>
            </div>

            {/* Contact Options */}
            <div className="space-y-4">
              {/* Phone */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="font-semibold text-gray-800">Phone</p>
                      <p className="text-gray-600">{leaseData?.landlordId.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(`tel:${leaseData?.landlordId.phone}`)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Call
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="font-semibold text-gray-800">Email</p>
                      <p className="text-gray-600">{leaseData?.landlordId.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(`mailto:${leaseData?.landlordId.email}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Email
                  </button>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6">
              <button
                className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                onClick={() => setShowContactPopup(false)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <TenantFooter />
    </div>
  );
} 