"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Target, Eye, Download, Share2, Zap, BarChart3, Activity, Grid3X3, List, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PortfolioSummary } from "../components";
import { toast } from "sonner";
import EquityNavigation from "../components/EquityNavigation";
import BackgroundVideo from "../components/BackgroundVideo";
import EquityAnimatedBackground from "../EquityAnimatedBackground";
export default function PortfolioPage() {
    const [portfolioProperties, setPortfolioProperties] = useState([]);
    const [portfolioMetrics, setPortfolioMetrics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [sortBy, setSortBy] = useState("value");
    const [viewMode, setViewMode] = useState("grid");
    const [exporting, setExporting] = useState(false);
    const [sharing, setSharing] = useState(false);
    // Mock data
    const mockPortfolioProperties = [
        {
            id: "1",
            name: "Cyber Hub Office Complex",
            type: "Office Building",
            location: "Gurgaon, Haryana",
            sharesOwned: 45,
            totalShares: 10000,
            pricePerShare: 2500,
            currentValue: 127500,
            initialInvestment: 112500,
            currentYield: 8.5,
            monthlyIncome: 9562,
            totalReturns: 15000,
            returnPercentage: 13.3,
            lastUpdated: "2024-01-15",
            riskLevel: "Medium",
            occupancyRate: 95,
            aiScore: 92,
            performance: "positive"
        },
        {
            id: "2",
            name: "Data Center Facility",
            type: "Data Center",
            location: "Mumbai, Maharashtra",
            sharesOwned: 25,
            totalShares: 6000,
            pricePerShare: 5000,
            currentValue: 137500,
            initialInvestment: 125000,
            currentYield: 11.5,
            monthlyIncome: 12000,
            totalReturns: 12500,
            returnPercentage: 10.0,
            lastUpdated: "2024-01-15",
            riskLevel: "Medium",
            occupancyRate: 98,
            aiScore: 95,
            performance: "positive"
        },
        {
            id: "3",
            name: "Retail Mall Complex",
            type: "Retail",
            location: "Noida, UP",
            sharesOwned: 18,
            totalShares: 15000,
            pricePerShare: 3200,
            currentValue: 55800,
            initialInvestment: 57600,
            currentYield: 7.8,
            monthlyIncome: 3744,
            totalReturns: -1800,
            returnPercentage: -3.1,
            lastUpdated: "2024-01-15",
            riskLevel: "Low",
            occupancyRate: 92,
            aiScore: 89,
            performance: "negative"
        },
        {
            id: "4",
            name: "Logistic Park Warehouse",
            type: "Warehouse",
            location: "Sonipat, Haryana",
            sharesOwned: 32,
            totalShares: 8000,
            pricePerShare: 1800,
            currentValue: 62400,
            initialInvestment: 57600,
            currentYield: 9.2,
            monthlyIncome: 4784,
            totalReturns: 4800,
            returnPercentage: 8.3,
            lastUpdated: "2024-01-15",
            riskLevel: "High",
            occupancyRate: 88,
            aiScore: 88,
            performance: "positive"
        },
        {
            id: "5",
            name: "Co-working Hub",
            type: "Co-working",
            location: "Bangalore, Karnataka",
            sharesOwned: 28,
            totalShares: 12000,
            pricePerShare: 2800,
            currentValue: 78400,
            initialInvestment: 78400,
            currentYield: 8.9,
            monthlyIncome: 5817,
            totalReturns: 0,
            returnPercentage: 0.0,
            lastUpdated: "2024-01-15",
            riskLevel: "Medium",
            occupancyRate: 87,
            aiScore: 86,
            performance: "neutral"
        }
    ];
    const mockPortfolioMetrics = {
        totalValue: 461600,
        totalInvestment: 431100,
        totalReturns: 30500,
        monthlyIncome: 35907,
        properties: 5,
        totalShares: 148,
        averageYield: 9.18,
        bestPerformer: "Cyber Hub Office Complex",
        worstPerformer: "Retail Mall Complex"
    };
    const filterOptions = [
        { value: "all", label: "All Properties" },
        { value: "positive", label: "Positive Returns" },
        { value: "negative", label: "Negative Returns" },
        { value: "high-yield", label: "High Yield (>9%)" },
        { value: "low-risk", label: "Low Risk" },
        { value: "medium-risk", label: "Medium Risk" },
        { value: "high-risk", label: "High Risk" }
    ];
    const sortOptions = [
        { value: "value", label: "Current Value" },
        { value: "returns", label: "Total Returns" },
        { value: "percentage", label: "Return %" },
        { value: "income", label: "Monthly Income" },
        { value: "yield", label: "Current Yield" },
        { value: "aiScore", label: "AI Score" }
    ];
    useEffect(() => {
        // Simulate API call
        const timer = setTimeout(() => {
            setPortfolioProperties(mockPortfolioProperties);
            setPortfolioMetrics(mockPortfolioMetrics);
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
    const handleExportPortfolio = async () => {
        setExporting(true);
        toast.info("Generating comprehensive portfolio report...");
        try {
            // Simulate report generation
            await new Promise(resolve => setTimeout(resolve, 3000));
            const currentDate = new Date().toISOString().split('T')[0];
            // Generate comprehensive portfolio report content
            const reportContent = `
🏢 100GAJ PORTFOLIO REPORT
Generated: ${new Date().toLocaleString()}
Export Date: ${currentDate}

═══════════════════════════════════════════════════════════

📊 PORTFOLIO OVERVIEW
═══════════════════════════════════════════════════════════
Total Portfolio Value: ₹${portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.totalValue.toLocaleString()}
Total Investment: ₹${portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.totalInvestment.toLocaleString()}
Total Returns: ₹${portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.totalReturns.toLocaleString()}
Monthly Income: ₹${portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.monthlyIncome.toLocaleString()}
Number of Properties: ${portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.properties}
Total Shares Owned: ${portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.totalShares}
Average Yield: ${portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.averageYield.toFixed(2)}%
Best Performer: ${portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.bestPerformer}
Worst Performer: ${portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.worstPerformer}

Return on Investment: ${portfolioMetrics ? ((portfolioMetrics.totalReturns / portfolioMetrics.totalInvestment) * 100).toFixed(2) : 0}%

═══════════════════════════════════════════════════════════

🏠 PROPERTY BREAKDOWN
═══════════════════════════════════════════════════════════
${portfolioProperties.map((property, index) => `
${index + 1}. ${property.name}
   Location: ${property.location}
   Type: ${property.type}
   Shares Owned: ${property.sharesOwned} / ${property.totalShares.toLocaleString()}
   Ownership: ${((property.sharesOwned / property.totalShares) * 100).toFixed(3)}%
   Initial Investment: ₹${property.initialInvestment.toLocaleString()}
   Current Value: ₹${property.currentValue.toLocaleString()}
   Monthly Income: ₹${property.monthlyIncome.toLocaleString()}
   Current Yield: ${property.currentYield}%
   Total Returns: ₹${property.totalReturns.toLocaleString()}
   Return %: ${property.returnPercentage > 0 ? '+' : ''}${property.returnPercentage.toFixed(1)}%
   Risk Level: ${property.riskLevel}
   Occupancy Rate: ${property.occupancyRate}%
   AI Score: ${property.aiScore}/100
   Performance: ${property.performance.toUpperCase()}
   Last Updated: ${property.lastUpdated}
`).join('')}

═══════════════════════════════════════════════════════════

📈 PERFORMANCE ANALYSIS
═══════════════════════════════════════════════════════════
Positive Performing Properties: ${portfolioProperties.filter(p => p.performance === 'positive').length}
Negative Performing Properties: ${portfolioProperties.filter(p => p.performance === 'negative').length}
Neutral Properties: ${portfolioProperties.filter(p => p.performance === 'neutral').length}

High Risk Properties: ${portfolioProperties.filter(p => p.riskLevel === 'High').length}
Medium Risk Properties: ${portfolioProperties.filter(p => p.riskLevel === 'Medium').length}
Low Risk Properties: ${portfolioProperties.filter(p => p.riskLevel === 'Low').length}

Highest Yield Property: ${portfolioProperties.reduce((prev, current) => (prev.currentYield > current.currentYield) ? prev : current).name} (${portfolioProperties.reduce((prev, current) => (prev.currentYield > current.currentYield) ? prev : current).currentYield}%)

Highest ROI Property: ${portfolioProperties.reduce((prev, current) => (prev.returnPercentage > current.returnPercentage) ? prev : current).name} (${portfolioProperties.reduce((prev, current) => (prev.returnPercentage > current.returnPercentage) ? prev : current).returnPercentage.toFixed(1)}%)

═══════════════════════════════════════════════════════════

💡 RECOMMENDATIONS
═══════════════════════════════════════════════════════════
✅ Your portfolio is well-diversified across different property types
✅ Monthly income stream is consistent and growing
✅ Average portfolio yield of ${portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.averageYield.toFixed(2)}% is above market average
${portfolioMetrics && portfolioMetrics.totalReturns > 0 ? '✅' : '⚠️'} Overall portfolio performance is ${portfolioMetrics && portfolioMetrics.totalReturns > 0 ? 'positive' : 'needs attention'}

${portfolioProperties.filter(p => p.performance === 'negative').length > 0 ?
                `⚠️  Consider reviewing negative performing properties:
${portfolioProperties.filter(p => p.performance === 'negative').map(p => `   • ${p.name} (${p.returnPercentage.toFixed(1)}%)`).join('\n')}` : ''}

═══════════════════════════════════════════════════════════

DISCLAIMER: This report is generated for informational purposes only. 
Past performance does not guarantee future results. All investments 
carry risk and may lose value. Please consult with a financial 
advisor before making investment decisions.

© 2024 100GAJ Equity Platform. All rights reserved.
`;
            // Create and download the report
            const dataBlob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `100GAJ-Portfolio-Report-${currentDate}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Clean up
            URL.revokeObjectURL(url);
            toast.success("📊 Portfolio report downloaded successfully!");
        }
        catch (error) {
            toast.error("Failed to generate portfolio report. Please try again.");
        }
        finally {
            setExporting(false);
        }
    };
    const handleSharePortfolio = async () => {
        setSharing(true);
        toast.info("Creating shareable portfolio summary...");
        try {
            // Simulate generating shareable content
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Create shareable portfolio summary text
            const shareText = `🏢 My 100GAJ Portfolio Performance

📊 Portfolio Summary:
• Total Value: ₹${portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.totalValue.toLocaleString()}
• Total Returns: ₹${portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.totalReturns.toLocaleString()}
• Monthly Income: ₹${portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.monthlyIncome.toLocaleString()}
• Properties: ${portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.properties}
• Average Yield: ${portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.averageYield.toFixed(2)}%

🏠 Investment Breakdown:
${portfolioProperties.slice(0, 3).map(property => `• ${property.name} - ${property.returnPercentage > 0 ? '+' : ''}${property.returnPercentage.toFixed(1)}%`).join('\n')}${portfolioProperties.length > 3 ? `\n• +${portfolioProperties.length - 3} more properties...` : ''}

📈 Performance: ${portfolioMetrics && portfolioMetrics.totalReturns > 0 ?
                `Positive returns of ₹${portfolioMetrics.totalReturns.toLocaleString()}` :
                'Building strong portfolio foundation'}

Generated: ${new Date().toLocaleDateString()}
Platform: 100GAJ Commercial Real Estate

#RealEstate #Investment #Portfolio #100GAJ #CommercialRealEstate`;
            // Check if Web Share API is available
            if (navigator.share) {
                await navigator.share({
                    title: '100GAJ Portfolio Performance',
                    text: shareText,
                    url: window.location.href,
                });
                toast.success("🚀 Portfolio shared successfully!");
            }
            else {
                // Fallback to clipboard
                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(shareText);
                    toast.success("📋 Portfolio summary copied to clipboard! You can now paste it anywhere to share.");
                }
                else {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = shareText;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    toast.success("📋 Portfolio summary copied to clipboard! You can now paste it anywhere to share.");
                }
            }
        }
        catch (error) {
            console.error('Share error:', error);
            toast.error("Failed to share portfolio. Please try again.");
        }
        finally {
            setSharing(false);
        }
    };
    const filteredProperties = portfolioProperties.filter(property => {
        switch (selectedFilter) {
            case "positive":
                return property.performance === "positive";
            case "negative":
                return property.performance === "negative";
            case "high-yield":
                return property.currentYield > 9;
            case "low-risk":
                return property.riskLevel === "Low";
            case "medium-risk":
                return property.riskLevel === "Medium";
            case "high-risk":
                return property.riskLevel === "High";
            default:
                return true;
        }
    }).sort((a, b) => {
        switch (sortBy) {
            case "value":
                return b.currentValue - a.currentValue;
            case "returns":
                return b.totalReturns - a.totalReturns;
            case "percentage":
                return b.returnPercentage - a.returnPercentage;
            case "income":
                return b.monthlyIncome - a.monthlyIncome;
            case "yield":
                return b.currentYield - a.currentYield;
            case "aiScore":
                return b.aiScore - a.aiScore;
            default:
                return 0;
        }
    });
    const getRiskColor = (risk) => {
        switch (risk) {
            case "Low": return "text-green-400 bg-green-500/10";
            case "Medium": return "text-yellow-400 bg-yellow-500/10";
            case "High": return "text-red-400 bg-red-500/10";
            default: return "text-gray-400 bg-gray-500/10";
        }
    };
    const getPerformanceColor = (performance) => {
        switch (performance) {
            case "positive": return "text-green-400";
            case "negative": return "text-red-400";
            case "neutral": return "text-gray-400";
            default: return "text-gray-400";
        }
    };
    const getPerformanceIcon = (performance) => {
        switch (performance) {
            case "positive": return TrendingUp;
            case "negative": return TrendingDown;
            case "neutral": return Activity;
            default: return Activity;
        }
    };
    if (isLoading) {
        return (<div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your portfolio...</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Video Background */}
      <BackgroundVideo />
      {/* Animated SVG Background */}
      <EquityAnimatedBackground />
      
      {/* Navigation */}
      <EquityNavigation />

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <motion.h1 className="text-4xl sm:text-5xl font-extrabold mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <span className="text-white drop-shadow-lg">My Portfolio</span> <span className="text-[#8b5cf6] drop-shadow-[0_0_12px_#8b5cf6] font-bold">Dashboard</span>
                </motion.h1>
                <motion.p className="text-xl text-white drop-shadow-sm" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                  Track your commercial real estate investments and performance
                </motion.p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleExportPortfolio} disabled={exporting || isLoading} className="bg-[#23232a] hover:bg-[#2a2a32] text-white border border-[#3a3a42] transition-all duration-300 group">
                  <Download className={`w-4 h-4 mr-2 ${exporting ? 'animate-bounce' : 'group-hover:translate-y-[-2px] transition-transform duration-300'}`}/>
                  {exporting ? 'Exporting...' : 'Export Report'}
                </Button>
                
                <Button onClick={handleSharePortfolio} disabled={sharing || isLoading} className="bg-[#23232a] hover:bg-[#2a2a32] text-white border border-[#3a3a42] transition-all duration-300 group">
                  <Share2 className={`w-4 h-4 mr-2 ${sharing ? 'animate-pulse' : 'group-hover:scale-110 transition-transform duration-300'}`}/>
                  {sharing ? 'Sharing...' : 'Share Portfolio'}
                </Button>
              </div>
            </div>
          </div>

          {/* Portfolio Summary */}
          {portfolioMetrics && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <PortfolioSummary portfolio={portfolioMetrics}/>
            </motion.div>)}

          {/* Filters and Controls */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-800 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {/* Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Filter Properties</label>
                <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500">
                  {filterOptions.map((option) => (<option key={option.value} value={option.value}>
                      {option.label}
                    </option>))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500">
                  {sortOptions.map((option) => (<option key={option.value} value={option.value}>
                      {option.label}
                    </option>))}
                </select>
              </div>

              {/* View Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">View Mode</label>
                <div className="flex gap-2">
                  <button onClick={() => setViewMode("grid")} className={`flex-1 flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${viewMode === "grid"
            ? "bg-purple-500 text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
                    <Grid3X3 className="w-4 h-4"/>
                    Grid
                  </button>
                  <button onClick={() => setViewMode("list")} className={`flex-1 flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${viewMode === "list"
            ? "bg-purple-500 text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
                    <List className="w-4 h-4"/>
                    List
                  </button>
                </div>
              </div>

              {/* Add Investment */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Actions</label>
                <Link href="/equity/property">
                  <Button className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                    <Plus className="w-4 h-4 mr-2"/>
                    Add Investment
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Portfolio Properties */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-2 sm:gap-0">
              <h2 className="text-lg sm:text-2xl font-bold text-white">
                Your Properties
                <span className="ml-2 font-bold" style={{ color: '#B6FF3F' }}>({filteredProperties.length})</span>
              </h2>
            </div>

            {filteredProperties.length > 0 ? (<div className={`grid gap-4 sm:gap-6 ${viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"}`}>
                {filteredProperties.map((property, index) => {
                const PerformanceIcon = getPerformanceIcon(property.performance);
                return (<motion.div key={property.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 p-6 hover:shadow-[0_0_24px_4px_#a78bfa66] hover:scale-[1.035] focus:shadow-[0_0_24px_4px_#a78bfa66] focus:scale-[1.035] outline-none" tabIndex={0}>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">{property.name}</h3>
                          <div className="text-sm text-gray-400">{property.location}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-bold ${getRiskColor(property.riskLevel)}`}>
                            {property.riskLevel}
                          </div>
                        </div>
                      </div>

                      {/* Investment Details */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-[#a78bfa]/10 rounded-lg p-3">
                          <div className="text-xl font-bold text-white mb-1">
                            ₹{property.currentValue.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400">Current Value</div>
                        </div>
                        <div className="bg-[#a78bfa]/10 rounded-lg p-3">
                          <div className={`text-xl font-bold mb-1 ${getPerformanceColor(property.performance)}`} style={property.returnPercentage > 0 ? { color: '#B6FF3F' } : {}}>
                            {property.returnPercentage > 0 ? '+' : ''}{property.returnPercentage.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400">Return</div>
                        </div>
                      </div>

                      {/* Shares Info */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Shares Owned</span>
                          <span className="text-sm font-semibold text-white">
                            {property.sharesOwned} / {property.totalShares.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 mb-2">
                          Ownership: {((property.sharesOwned / property.totalShares) * 100).toFixed(3)}%
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Monthly Income</span>
                          <span className="font-semibold" style={{ color: '#B6FF3F' }}>₹{property.monthlyIncome.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Current Yield</span>
                          <span className="text-purple-400 font-semibold">{property.currentYield}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Total Returns</span>
                          <span className={`font-semibold ${property.totalReturns > 0 ? '' : getPerformanceColor(property.performance)}`} style={property.totalReturns > 0 ? { color: '#B6FF3F' } : {}}>
                            {property.totalReturns > 0 ? '+' : ''}₹{property.totalReturns.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">AI Score</span>
                          <span className="text-purple-400 font-semibold">{property.aiScore}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link href={`/equity/property/${property.id}`} className="flex-1">
                          <Button size="sm" className="bg-[#d1ff4a] hover:bg-[#b6e944] text-black w-full rounded-lg font-semibold flex items-center gap-2 justify-center">
                            <Eye className="w-4 h-4 mr-2"/>
                            View Details
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                          <BarChart3 className="w-4 h-4"/>
                        </Button>
                      </div>

                      {/* Performance Indicator */}
                      <div className="mt-4 flex items-center gap-2 text-sm">
                        <PerformanceIcon className={`w-4 h-4`} style={property.performance === 'positive' || property.performance === 'neutral' ? { color: '#B6FF3F' } : {}}/>
                        <span className="text-gray-400">
                          {property.performance === "positive" ? "Outperforming" :
                        property.performance === "negative" ? "Underperforming" : "Stable"}
                        </span>
                      </div>
                    </motion.div>);
            })}
              </div>) : (<div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-600 mx-auto mb-4"/>
                <h3 className="text-xl font-semibold text-white mb-2">No properties match your filter</h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your filter criteria to see more properties.
                </p>
                <Button onClick={() => setSelectedFilter("all")} className="bg-purple-500 hover:bg-purple-600 text-white">
                  Show All Properties
                </Button>
              </div>)}
          </motion.div>

          {/* Portfolio Insights */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#a78bfa]"/>
              </div>
              <h3 className="text-2xl font-extrabold text-white drop-shadow">Portfolio Insights</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-bold mb-3 text-[#a78bfa] drop-shadow">Performance Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Best Performer:</span>
                    <span className="font-bold" style={{ color: '#B6FF3F' }}>{portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.bestPerformer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Worst Performer:</span>
                    <span className="font-bold text-[#ef4444]">{portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.worstPerformer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Average Yield:</span>
                    <span className="font-bold text-[#a78bfa]">{portfolioMetrics === null || portfolioMetrics === void 0 ? void 0 : portfolioMetrics.averageYield.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-bold mb-3 text-[#a78bfa] drop-shadow">AI Recommendations</h4>
                <div className="text-sm text-white">
                  Consider rebalancing your portfolio by reducing retail exposure and increasing data center investments for better risk-adjusted returns.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>);
}
