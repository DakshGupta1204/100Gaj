"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Shield, CheckCircle, X, DollarSign, Building2, TrendingUp, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function RazorpayPayment({ propertyId, sharePrice, minShares, onSuccess, onClose }) {
    const [shares, setShares] = useState(minShares);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const totalAmount = shares * sharePrice;
    const fees = totalAmount * 0.02; // 2% platform fee
    const finalAmount = totalAmount + fees;
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };
    const createOrder = async () => {
        try {
            const response = await fetch('/api/payment/razorpay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: finalAmount * 100, // Convert to paise
                    currency: 'INR',
                    propertyId,
                    shares,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create order');
            }
            const orderData = await response.json();
            return orderData;
        }
        catch (error) {
            // Remove console.log and handle error properly
            throw new Error('Payment initialization failed');
        }
    };
    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error('Razorpay SDK failed to load');
            }
            // Create order
            const orderData = await createOrder();
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: '100Gaj Equity',
                description: `Investment in Property #${propertyId}`,
                order_id: orderData.id,
                handler: function (response) {
                    // Remove console.log
                    onSuccess(Object.assign(Object.assign({}, response), { shares, amount: finalAmount, propertyId }));
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: '',
                },
                theme: {
                    color: '#F97316',
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };
            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function (response) {
                // Remove console.log and handle error properly
                setIsProcessing(false);
                alert('Payment failed. Please try again.');
            });
            razorpay.open();
        }
        catch (error) {
            // Remove console.log
            setIsProcessing(false);
            alert('Payment initialization failed. Please try again.');
        }
    };
    const calculateExpectedReturns = () => {
        const monthlyReturn = (totalAmount * 0.085) / 12; // 8.5% annual return
        const annualReturn = totalAmount * 0.085;
        return { monthly: monthlyReturn, annual: annualReturn };
    };
    const returns = calculateExpectedReturns();
    return (<motion.div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", stiffness: 300 }} onClick={(e) => e.stopPropagation()} onMouseMove={handleMouseMove}>
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          {[...Array(8)].map((_, i) => (<motion.div key={i} className="absolute w-1 h-1 bg-orange-400/40 rounded-full" initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
            }} animate={{
                y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.5, 1.5, 0.5],
            }} transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
            }}/>))}
        </div>

        {/* Mouse tracking gradient */}
        <motion.div className="absolute inset-0 opacity-30 rounded-3xl" style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(251, 146, 60, 0.15), transparent 40%)`,
        }}/>

        {/* Close button */}
        <button onClick={onClose} className="absolute top-6 right-6 z-10 bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-colors">
          <X className="w-5 h-5 text-white"/>
        </button>

        <div className="relative p-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center mb-8">
            <motion.div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center" whileHover={{ scale: 1.1, rotate: 5 }}>
              <Building2 className="w-8 h-8 text-white"/>
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Complete Your Investment</h2>
            <p className="text-gray-300">Secure your shares with our trusted payment gateway</p>
          </motion.div>

          {/* Investment Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-400"/>
              Investment Summary
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Number of Shares</label>
                <div className="flex items-center gap-4">
                  <input type="number" value={shares} onChange={(e) => setShares(Math.max(minShares, parseInt(e.target.value) || minShares))} min={minShares} className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                  <span className="text-gray-300 text-sm">Min: {minShares}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Share Price</div>
                  <div className="text-lg font-semibold text-white">₹{sharePrice.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Total Shares</div>
                  <div className="text-lg font-semibold text-white">{shares}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Investment Amount</div>
                  <div className="text-lg font-semibold text-white">₹{totalAmount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Platform Fee (2%)</div>
                  <div className="text-lg font-semibold text-white">₹{fees.toLocaleString()}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-orange-400">₹{finalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Expected Returns */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400"/>
              Expected Returns
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Monthly Income</div>
                <div className="text-xl font-bold text-green-400">₹{Math.round(returns.monthly).toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Annual Returns</div>
                <div className="text-xl font-bold text-green-400">₹{Math.round(returns.annual).toLocaleString()}</div>
              </div>
            </div>
          </motion.div>

          {/* Security Features */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-3 gap-4 mb-6">
            {[
            { icon: Shield, title: "Secure", desc: "256-bit SSL" },
            { icon: CheckCircle, title: "Verified", desc: "KYC Compliant" },
            { icon: Lock, title: "Protected", desc: "SEBI Regulated" }
        ].map((feature, index) => (<div key={index} className="text-center">
                <feature.icon className="w-6 h-6 text-orange-400 mx-auto mb-2"/>
                <div className="text-sm font-medium text-white">{feature.title}</div>
                <div className="text-xs text-gray-400">{feature.desc}</div>
              </div>))}
          </motion.div>

          {/* Payment Button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Button onClick={handlePayment} disabled={isProcessing} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 text-lg font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {isProcessing ? (<div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  Processing...
                </div>) : (<div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5"/>
                  Pay ₹{finalAmount.toLocaleString()}
                  <Zap className="w-5 h-5"/>
                </div>)}
            </Button>
          </motion.div>

          {/* Payment Methods */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6 text-center">
            <p className="text-sm text-gray-400 mb-2">Powered by Razorpay • Supports all major payment methods</p>
            <div className="flex justify-center gap-2 text-xs text-gray-500">
              <span>UPI</span> • <span>Cards</span> • <span>Net Banking</span> • <span>Wallets</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>);
}
