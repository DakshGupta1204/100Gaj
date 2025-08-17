"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRupeeSign, FaCheck, FaSpinner } from "react-icons/fa";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CommercialProperty } from "../../data/commercialProperties";
import { toast } from "sonner";
// import RazorpayPayment from "@/app/equity/components/RazorpayPayment";

interface BuySharesModalProps {
  property: CommercialProperty;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface PurchaseForm {
  shareCount: number;
  totalAmount: number;
  agreedToTerms: boolean;
  agreedToRiskDisclosure: boolean;
}

export default function BuySharesModal({
  property,
  isOpen,
  onClose,
  onSuccess,
}: BuySharesModalProps) {
  const [form, setForm] = useState<PurchaseForm>({
    shareCount: 1,
    totalAmount: property.pricePerShare,
    agreedToTerms: false,
    agreedToRiskDisclosure: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "details" | "confirmation" | "payment"
  >("details");

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const handleShareCountChange = (value: string) => {
    const shareCount = parseInt(value) || 0;
    if (shareCount <= property.availableShares && shareCount > 0) {
      setForm({
        ...form,
        shareCount,
        totalAmount: shareCount * property.pricePerShare,
      });
    }
  };

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    const shareCount = Math.floor(amount / property.pricePerShare);
    if (
      shareCount <= property.availableShares &&
      amount >= property.minInvestment
    ) {
      setForm({
        ...form,
        shareCount,
        totalAmount: shareCount * property.pricePerShare,
      });
    }
  };

  const canProceed = () => {
    return (
      form.shareCount > 0 &&
      form.totalAmount >= property.minInvestment &&
      form.shareCount <= property.availableShares &&
      form.agreedToTerms &&
      form.agreedToRiskDisclosure
    );
  };

  // Get user data from session/localStorage (you may need to adapt this based on your auth system)
  const getUserData = () => {
    // First try to get from token
    const token = typeof window !== "undefined" ? 
      (sessionStorage.getItem("authToken") || localStorage.getItem("authToken")) : null;
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          id: payload.userId || payload.sub,
          email: payload.email,
          name: payload.name || "User", // You might need to fetch this from user profile
          phone: payload.phone
        };
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
    
    // Fallback to localStorage user data
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  };

  const sendPurchaseNotification = async (userData: any) => {
    try {
      const token = typeof window !== "undefined" ? 
        (sessionStorage.getItem("authToken") || localStorage.getItem("authToken")) : null;

      const response = await fetch("/api/equity/purchase-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          propertyName: property.title,
          propertyId: property._id,
          shareCount: form.shareCount,
          totalAmount: form.totalAmount,
          pricePerShare: property.pricePerShare,
          propertyLocation: property.location,
          userName: userData?.name || "Unknown User",
          userEmail: userData?.email || "unknown@email.com",
          userPhone: userData?.phone
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to send notification");
      }

      return result;
    } catch (error) {
      console.error("Error sending purchase notification:", error);
      throw error;
    }
  };

  const handlePurchaseClick = async () => {
    setIsProcessing(true);
    
    try {
      const userData = getUserData();
      
      if (!userData?.email) {
        toast.error("Please log in to continue with your purchase");
        setIsProcessing(false);
        return;
      }

      // Send purchase notification email
      await sendPurchaseNotification(userData);
      
      // Show success message
      toast.success(
        `Thank you for your interest in ${property.title}! Our investment team will contact you within 24 hours to complete your investment of ₹${form.totalAmount.toLocaleString()}.`,
        { duration: 5000 }
      );
      
      // Close modal after success
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsProcessing(false);
      }, 2000);

    } catch (error) {
      console.error("Purchase notification error:", error);
      toast.error("Failed to process your request. Please try again or contact support.");
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (_paymentResponse: any) => {
    setIsProcessing(false);
    setCurrentStep("details");
    toast.success(
      `Successfully purchased ${form.shareCount} shares of ${property.title}!`
    );
    onSuccess();
    onClose();
  };

  const handlePaymentError = (error: string) => {
    setIsProcessing(false);
    setCurrentStep("details");
    toast.error(`Purchase failed: ${error}`);
  };

  const handlePaymentClose = () => {
    setIsProcessing(false);
    setCurrentStep("details");
  };

  // Prepare payment data
  const getPaymentData = () => {
    const userData = getUserData();
    return {
      amount: form.totalAmount,
      userId: userData?.id || "guest",
      propertyId: property._id,
      shareCount: form.shareCount,
      propertyTitle: property.title,
      userEmail: userData?.email,
      userName: userData?.name,
      userPhone: userData?.phone,
    };
  };

  const getOwnershipPercentage = () => {
    return ((form.shareCount / property.totalShares) * 100).toFixed(3);
  };

  const getMonthlyRental = () => {
    const ownership = form.shareCount / property.totalShares;
    return property.monthlyRental * ownership;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-sm sm:max-w-md lg:max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col"
        >
          <Card className="luxury-card flex flex-col max-h-full">
            <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 lg:p-6 flex-shrink-0">
              <CardTitle className="text-base sm:text-lg lg:text-xl text-white pr-2 line-clamp-2">
                Express Interest - {property.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </CardHeader>

            <CardContent className="flex flex-col flex-1 min-h-0 p-3 sm:p-4 lg:p-6">
              <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 lg:space-y-6 pr-1 sm:pr-2">
                {currentStep === "details" && (
                  <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                    {/* Property Summary */}
                    <div className="p-3 sm:p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                        Property Summary
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <span className="text-gray-400">Location:</span>
                          <span className="text-white sm:ml-2 font-medium">
                            {property.location}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <span className="text-gray-400">Property Type:</span>
                          <span className="text-white sm:ml-2 font-medium">
                            {property.propertyType}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <span className="text-gray-400">Current ROI:</span>
                          <span className="text-green-400 sm:ml-2 font-medium">
                            {property.currentROI}%
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <span className="text-gray-400">Rental Yield:</span>
                          <span className="text-blue-400 sm:ml-2 font-medium">
                            {property.rentalYield}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Investment Details */}
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="share-count" className="text-gray-300 text-sm">
                          Number of Shares
                        </Label>
                        <Input
                          id="share-count"
                          type="number"
                          min="1"
                          max={property.availableShares}
                          value={form.shareCount}
                          onChange={(_e) =>
                            handleShareCountChange(_e.target.value)
                          }
                          className="bg-gray-800 border-gray-700 text-white mt-1 h-10 sm:h-11"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Max available:{" "}
                          {property.availableShares.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="total-amount" className="text-gray-300 text-sm">
                          Total Investment Amount
                        </Label>
                        <div className="relative mt-1">
                          <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                          <Input
                            id="total-amount"
                            type="number"
                            value={form.totalAmount}
                            onChange={(_e) => handleAmountChange(_e.target.value)}
                            className="pl-8 bg-gray-800 border-gray-700 text-white h-10 sm:h-11"
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Min: {formatCurrency(property.minInvestment)}
                        </p>
                      </div>
                    </div>

                    {/* Investment Summary */}
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg">
                      <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                        Your Investment Summary
                      </h3>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div>
                          <div className="text-gray-400">Shares</div>
                          <div className="text-white font-semibold text-sm sm:text-base">
                            {form.shareCount.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">Investment</div>
                          <div className="text-orange-500 font-semibold text-sm sm:text-base">
                            {formatCurrency(form.totalAmount)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">Ownership</div>
                          <div className="text-green-400 font-semibold text-sm sm:text-base">
                            {getOwnershipPercentage()}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">Monthly Rental</div>
                          <div className="text-blue-400 font-semibold text-sm sm:text-base">
                            {formatCurrency(getMonthlyRental())}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <Checkbox
                          id="terms"
                          checked={form.agreedToTerms}
                          onCheckedChange={(checked) =>
                            setForm({ ...form, agreedToTerms: !!checked })
                          }
                          className="mt-1 flex-shrink-0"
                        />
                        <Label
                          htmlFor="terms"
                          className="text-xs sm:text-sm text-gray-300 cursor-pointer leading-relaxed"
                        >
                          I agree to the{" "}
                          <a href="#" className="text-orange-500 hover:underline">
                            Terms & Conditions
                          </a>{" "}
                          and understand the SPV structure for this investment.
                        </Label>
                      </div>

                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <Checkbox
                          id="risk-disclosure"
                          checked={form.agreedToRiskDisclosure}
                          onCheckedChange={(checked) =>
                            setForm({
                              ...form,
                              agreedToRiskDisclosure: !!checked,
                            })
                          }
                          className="mt-1 flex-shrink-0"
                        />
                        <Label
                          htmlFor="risk-disclosure"
                          className="text-xs sm:text-sm text-gray-300 cursor-pointer leading-relaxed"
                        >
                          I have read and understood the{" "}
                          <a href="#" className="text-orange-500 hover:underline">
                            Risk Disclosure Document
                          </a>{" "}
                          and acknowledge that real estate investments carry
                          risks.
                        </Label>
                      </div>
                    </div>

                    {/* Contact Notice */}
                    <div className="p-3 sm:p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaCheck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                        <span className="text-blue-400 font-medium text-sm sm:text-base">
                          Investment Process
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
                        By clicking "Express Interest", our investment team will contact you within 24 hours to:
                      </p>
                      <ul className="text-xs sm:text-sm text-blue-200 mt-2 ml-3 sm:ml-4 list-disc space-y-1">
                        <li>Verify your investment details and capacity</li>
                        <li>Guide you through KYC verification if needed</li>
                        <li>Complete the documentation process</li>
                        <li>Finalize your share purchase</li>
                      </ul>
                    </div>
                  </div>
                )}

                {currentStep === "payment" && (
                  <div className="text-center py-6 sm:py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-orange-500/20 rounded-full mb-3 sm:mb-4">
                      <FaSpinner className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 animate-spin" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                      Processing Your Investment
                    </h3>
                    <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base px-2">
                      Please wait while we process your purchase of{" "}
                      {form.shareCount} shares
                    </p>
                    <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 max-w-sm mx-auto">
                      <div className="flex justify-between text-xs sm:text-sm mb-2">
                        <span className="text-gray-400">Shares:</span>
                        <span className="text-white">
                          {form.shareCount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm mb-2">
                        <span className="text-gray-400">Amount:</span>
                        <span className="text-orange-500 font-semibold">
                          {formatCurrency(form.totalAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-400">SPV:</span>
                        <span className="text-white text-right">{property.spvName}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fixed Action Buttons at Bottom */}
              {currentStep === "details" && (
                <div className="flex-shrink-0 pt-3 sm:pt-4 border-t border-gray-800 mt-3 sm:mt-4">
                  <div className="flex space-x-3 sm:space-x-4">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="flex-1 luxury-button-outline h-10 sm:h-11 text-sm sm:text-base"
                    >
                      Cancel
                    </Button>

                    <Button
                      disabled={!canProceed() || isProcessing}
                      className="flex-1 luxury-button h-10 sm:h-11 text-sm sm:text-base"
                      onClick={handlePurchaseClick}
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                          <span className="truncate">Sending Request...</span>
                        </div>
                      ) : (
                        <span className="truncate">Express Interest - {formatCurrency(form.totalAmount)}</span>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
