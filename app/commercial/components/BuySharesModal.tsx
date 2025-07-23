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
import RazorpayPayment from "@/app/equity/components/RazorpayPayment";

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
    // This should be replaced with your actual user data retrieval logic
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  };

  const handlePaymentSuccess = (_paymentResponse: any) => {
    setIsProcessing(false);
    setCurrentStep("details");
    toast.success(
      `Successfully purchased ${form.shareCount} shares of ${property.title}!`,
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
      userId: userData?.id || 'guest',
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="luxury-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-white">
                Buy Equity Shares - {property.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              {currentStep === "details" && (
                <>
                  {/* Property Summary */}
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <h3 className="text-white font-semibold mb-3">
                      Property Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Location:</span>
                        <span className="text-white ml-2">
                          {property.location}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Property Type:</span>
                        <span className="text-white ml-2">
                          {property.propertyType}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Current ROI:</span>
                        <span className="text-green-400 ml-2">
                          {property.currentROI}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Rental Yield:</span>
                        <span className="text-blue-400 ml-2">
                          {property.rentalYield}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Investment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="share-count" className="text-gray-300">
                        Number of Shares
                      </Label>
                      <Input
                        id="share-count"
                        type="number"
                        min="1"
                        max={property.availableShares}
                        value={form.shareCount}
                        onChange={(_e) => handleShareCountChange(_e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Max available:{" "}
                        {property.availableShares.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="total-amount" className="text-gray-300">
                        Total Investment Amount
                      </Label>
                      <div className="relative">
                        <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="total-amount"
                          type="number"
                          value={form.totalAmount}
                          onChange={(_e) => handleAmountChange(_e.target.value)}
                          className="pl-8 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Min: {formatCurrency(property.minInvestment)}
                      </p>
                    </div>
                  </div>

                  {/* Investment Summary */}
                  <div className="p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg">
                    <h3 className="text-white font-semibold mb-3">
                      Your Investment Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Shares</div>
                        <div className="text-white font-semibold">
                          {form.shareCount.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400">Investment</div>
                        <div className="text-orange-500 font-semibold">
                          {formatCurrency(form.totalAmount)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400">Ownership</div>
                        <div className="text-green-400 font-semibold">
                          {getOwnershipPercentage()}%
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400">Monthly Rental</div>
                        <div className="text-blue-400 font-semibold">
                          {formatCurrency(getMonthlyRental())}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={form.agreedToTerms}
                        onCheckedChange={(checked) =>
                          setForm({ ...form, agreedToTerms: !!checked })
                        }
                        className="mt-1"
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm text-gray-300 cursor-pointer"
                      >
                        I agree to the{" "}
                        <a href="#" className="text-orange-500 hover:underline">
                          Terms & Conditions
                        </a>{" "}
                        and understand the SPV structure for this investment.
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="risk-disclosure"
                        checked={form.agreedToRiskDisclosure}
                        onCheckedChange={(checked) =>
                          setForm({
                            ...form,
                            agreedToRiskDisclosure: !!checked,
                          })
                        }
                        className="mt-1"
                      />
                      <Label
                        htmlFor="risk-disclosure"
                        className="text-sm text-gray-300 cursor-pointer"
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

                  {/* KYC Notice */}
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaCheck className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">
                        KYC Verification Required
                      </span>
                    </div>
                    <p className="text-sm text-blue-200">
                      As per regulatory requirements, KYC verification is
                      mandatory before investment. Your KYC will be processed
                      after successful payment.
                    </p>
                  </div>
                </>
              )}

              {currentStep === "payment" && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
                    <FaSpinner className="w-8 h-8 text-orange-500 animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Processing Your Investment
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Please wait while we process your purchase of{" "}
                    {form.shareCount} shares
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-4 max-w-md mx-auto">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Shares:</span>
                      <span className="text-white">
                        {form.shareCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-orange-500 font-semibold">
                        {formatCurrency(form.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">SPV:</span>
                      <span className="text-white">{property.spvName}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {currentStep === "details" && (
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 luxury-button-outline"
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    disabled={!canProceed() || isProcessing}
                    className="flex-1 luxury-button"
                    onClick={() => {
                      // Handle payment click - for now just show a success
                      handlePaymentSuccess({});
                    }}
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      `Purchase Shares - ${formatCurrency(form.totalAmount)}`
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
