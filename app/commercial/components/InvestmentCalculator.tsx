"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalculator, FaRupeeSign } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CommercialProperty } from "../../data/commercialProperties";

interface InvestmentCalculatorProps {
  property: CommercialProperty;
}

interface CalculationResult {
  shareCount: number;
  totalInvestment: number;
  ownershipPercentage: number;
  monthlyRental: number;
  annualRental: number;
  projectedValue1Year: number;
  projectedValue3Year: number;
  projectedValue5Year: number;
  totalReturn1Year: number;
  totalReturn3Year: number;
  totalReturn5Year: number;
  roi1Year: number;
  roi3Year: number;
  roi5Year: number;
}

export default function InvestmentCalculator({ property }: InvestmentCalculatorProps) {
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [shareCount, setShareCount] = useState<string>("");
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);
  const [inputMode, setInputMode] = useState<'amount' | 'shares'>('amount');

  const calculateReturns = (investment: number, shares: number): CalculationResult => {
    const ownershipPercentage = (shares / property.totalShares) * 100;
    const monthlyRental = (property.monthlyRental * ownershipPercentage) / 100;
    const annualRental = monthlyRental * 12;

    // Projected values with appreciation
    const appreciationRate = property.appreciationRate / 100;
    const projectedValue1Year = investment * (1 + appreciationRate);
    const projectedValue3Year = investment * Math.pow(1 + appreciationRate, 3);
    const projectedValue5Year = investment * Math.pow(1 + appreciationRate, 5);

    // Total returns (rental income + capital appreciation)
    const totalReturn1Year = annualRental + (projectedValue1Year - investment);
    const totalReturn3Year = (annualRental * 3) + (projectedValue3Year - investment);
    const totalReturn5Year = (annualRental * 5) + (projectedValue5Year - investment);

    // ROI calculations
    const roi1Year = (totalReturn1Year / investment) * 100;
    const roi3Year = (totalReturn3Year / investment) * 100;
    const roi5Year = (totalReturn5Year / investment) * 100;

    return {
      shareCount: shares,
      totalInvestment: investment,
      ownershipPercentage,
      monthlyRental,
      annualRental,
      projectedValue1Year,
      projectedValue3Year,
      projectedValue5Year,
      totalReturn1Year,
      totalReturn3Year,
      totalReturn5Year,
      roi1Year,
      roi3Year,
      roi5Year
    };
  };

  useEffect(() => {
    if (inputMode === 'amount' && investmentAmount) {
      const amount = parseFloat(investmentAmount);
      if (amount >= property.minInvestment) {
        const shares = Math.floor(amount / property.pricePerShare);
        const actualInvestment = shares * property.pricePerShare;
        setShareCount(shares.toString());
        setCalculation(calculateReturns(actualInvestment, shares));
      } else {
        setCalculation(null);
      }
    } else if (inputMode === 'shares' && shareCount) {
      const shares = parseInt(shareCount);
      if (shares > 0 && shares <= property.availableShares) {
        const amount = shares * property.pricePerShare;
        setInvestmentAmount(amount.toString());
        setCalculation(calculateReturns(amount, shares));
      } else {
        setCalculation(null);
      }
    }
  }, [investmentAmount, shareCount, inputMode, property, calculateReturns]);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <Card className="luxury-card">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <FaCalculator className="w-5 h-5 mr-2 text-orange-500" />
          Investment Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Mode Toggle */}
        <div className="flex space-x-2">
          <button
            onClick={() => setInputMode('amount')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              inputMode === 'amount'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            By Amount
          </button>
          <button
            onClick={() => setInputMode('shares')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              inputMode === 'shares'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            By Shares
          </button>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="investment-amount" className="text-gray-300">
              Investment Amount
            </Label>
            <div className="relative">
              <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="investment-amount"
                type="number"
                placeholder={`Min: ${formatCurrency(property.minInvestment)}`}
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                className="pl-8 bg-gray-800 border-gray-700 text-white"
                disabled={inputMode === 'shares'}
              />
            </div>
            {investmentAmount && parseFloat(investmentAmount) < property.minInvestment && (
              <p className="text-red-400 text-sm mt-1">
                Minimum investment: {formatCurrency(property.minInvestment)}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="share-count" className="text-gray-300">
              Number of Shares
            </Label>
            <Input
              id="share-count"
              type="number"
              placeholder={`Max: ${property.availableShares}`}
              value={shareCount}
              onChange={(e) => setShareCount(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              disabled={inputMode === 'amount'}
            />
            {shareCount && parseInt(shareCount) > property.availableShares && (
              <p className="text-red-400 text-sm mt-1">
                Maximum available: {property.availableShares} shares
              </p>
            )}
          </div>
        </div>

        {/* Property Info */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800/50 rounded-lg">
          <div>
            <div className="text-sm text-gray-400">Price per Share</div>
            <div className="text-lg font-semibold text-white">
              {formatCurrency(property.pricePerShare)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Available Shares</div>
            <div className="text-lg font-semibold text-white">
              {property.availableShares.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Calculation Results */}
        {calculation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Investment Summary */}
            <div className="p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">Investment Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Total Investment</div>
                  <div className="text-xl font-bold text-orange-500">
                    {formatCurrency(calculation.totalInvestment)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Shares Owned</div>
                  <div className="text-xl font-bold text-white">
                    {calculation.shareCount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Ownership</div>
                  <div className="text-xl font-bold text-green-400">
                    {formatPercentage(calculation.ownershipPercentage)}
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Income */}
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">Rental Income</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Monthly Rental</div>
                  <div className="text-lg font-semibold text-green-400">
                    {formatCurrency(calculation.monthlyRental)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Annual Rental</div>
                  <div className="text-lg font-semibold text-green-400">
                    {formatCurrency(calculation.annualRental)}
                  </div>
                </div>
              </div>
            </div>

            {/* Projected Returns */}
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">Projected Returns</h3>
              <div className="space-y-4">
                {/* 1 Year */}
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded">
                  <div>
                    <div className="text-white font-medium">1 Year</div>
                    <div className="text-sm text-gray-400">
                      Property Value: {formatCurrency(calculation.projectedValue1Year)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">
                      {formatCurrency(calculation.totalReturn1Year)}
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      ROI: {formatPercentage(calculation.roi1Year)}
                    </Badge>
                  </div>
                </div>

                {/* 3 Years */}
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded">
                  <div>
                    <div className="text-white font-medium">3 Years</div>
                    <div className="text-sm text-gray-400">
                      Property Value: {formatCurrency(calculation.projectedValue3Year)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">
                      {formatCurrency(calculation.totalReturn3Year)}
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      ROI: {formatPercentage(calculation.roi3Year)}
                    </Badge>
                  </div>
                </div>

                {/* 5 Years */}
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded">
                  <div>
                    <div className="text-white font-medium">5 Years</div>
                    <div className="text-sm text-gray-400">
                      Property Value: {formatCurrency(calculation.projectedValue5Year)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">
                      {formatCurrency(calculation.totalReturn5Year)}
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      ROI: {formatPercentage(calculation.roi5Year)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-200">
                <strong>Disclaimer:</strong> These projections are based on historical data and current market conditions.
                Actual returns may vary. Real estate investments carry risks and past performance doesn&apos;t guarantee future results.
              </p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
