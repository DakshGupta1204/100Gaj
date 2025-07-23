"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Target, Zap, Brain, CheckCircle, ArrowUpRight, PieChart, Activity, Download, Share2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerformanceChart } from "../components";
import { toast } from "sonner";
import EquityAnimatedBackground from "../EquityAnimatedBackground";
import BackgroundVideo from "../components/BackgroundVideo";
import EquityNavigation from "../components/EquityNavigation";
export default function DashboardPage() {
    var _a;
    const [metrics, setMetrics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTimeframe, setSelectedTimeframe] = useState("6M");
    const [selectedAnalysis, setSelectedAnalysis] = useState("performance");
    const [refreshing, setRefreshing] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [sharing, setSharing] = useState(false);
    // Mouse tracking for animated background
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    const mockMetrics = {
        totalPortfolioValue: 1275000,
        totalInvestment: 950000,
        totalReturns: 325000,
        monthlyIncome: 28750,
        averageYield: 9.2,
        portfolioGrowth: 15.8,
        riskScore: 7.2,
        diversificationScore: 8.5,
        liquidityScore: 6.8,
        marketSentiment: "bullish"
    };
    const marketInsights = [
        {
            title: "Commercial Real Estate Demand Surge",
            description: "Office space demand increased 23% in tier-1 cities driven by hybrid work models",
            impact: "positive",
            confidence: 89,
            category: "market"
        },
        {
            title: "Data Center Expansion",
            description: "Cloud infrastructure investments expected to grow 35% in next 12 months",
            impact: "positive",
            confidence: 94,
            category: "property"
        },
        {
            title: "Interest Rate Stability",
            description: "RBI maintains steady rates, favorable for real estate financing",
            impact: "positive",
            confidence: 82,
            category: "economic"
        },
        {
            title: "REIT Regulations Update",
            description: "New SEBI guidelines may impact small investor participation",
            impact: "neutral",
            confidence: 76,
            category: "regulatory"
        }
    ];
    const predictiveAnalysis = [
        {
            period: "Next 3 Months",
            expectedReturn: 4.2,
            confidence: 87,
            riskLevel: "low",
            recommendation: "Hold current positions, monitor market conditions"
        },
        {
            period: "Next 6 Months",
            expectedReturn: 8.7,
            confidence: 82,
            riskLevel: "medium",
            recommendation: "Consider increasing data center allocation"
        },
        {
            period: "Next 12 Months",
            expectedReturn: 18.3,
            confidence: 78,
            riskLevel: "medium",
            recommendation: "Diversify into warehouse and logistics properties"
        }
    ];
    const timeframes = [
        { value: "1M", label: "1 Month" },
        { value: "3M", label: "3 Months" },
        { value: "6M", label: "6 Months" },
        { value: "1Y", label: "1 Year" },
        { value: "ALL", label: "All Time" }
    ];
    const analysisTypes = [
        { value: "performance", label: "Performance Analysis" },
        { value: "risk", label: "Risk Assessment" },
        { value: "predictions", label: "Predictive Analytics" },
        { value: "market", label: "Market Intelligence" }
    ];
    useEffect(() => {
        const timer = setTimeout(() => {
            setMetrics(mockMetrics);
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
    const handleRefresh = async () => {
        setRefreshing(true);
        toast.info("Refreshing analytics data...");
        try {
            // Simulate API call to refresh data
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Update metrics with new data (simulated)
            const updatedMetrics = Object.assign(Object.assign({}, mockMetrics), { totalPortfolioValue: mockMetrics.totalPortfolioValue + Math.floor(Math.random() * 50000 - 25000), averageYield: Number((mockMetrics.averageYield + (Math.random() * 0.4 - 0.2)).toFixed(1)), portfolioGrowth: Number((mockMetrics.portfolioGrowth + (Math.random() * 2 - 1)).toFixed(1)) });
            setMetrics(updatedMetrics);
            toast.success("Analytics data refreshed successfully!");
        }
        catch (error) {
            toast.error("Failed to refresh data. Please try again.");
        }
        finally {
            setRefreshing(false);
        }
    };
    const handleExportReport = async () => {
        setExporting(true);
        toast.info("Generating comprehensive analytics report...");
        try {
            // Simulate report generation
            await new Promise(resolve => setTimeout(resolve, 3000));
            const currentDate = new Date().toISOString().split('T')[0];
            // Generate comprehensive report content
            const reportContent = `
🏢 100GAJ EQUITY PLATFORM - ANALYTICS REPORT
Generated: ${new Date().toLocaleString()}
Timeframe: ${selectedTimeframe}
Analysis Type: ${selectedAnalysis.charAt(0).toUpperCase() + selectedAnalysis.slice(1)}

═══════════════════════════════════════════════════════════

📊 PORTFOLIO METRICS
═══════════════════════════════════════════════════════════
Total Portfolio Value: ₹${metrics === null || metrics === void 0 ? void 0 : metrics.totalPortfolioValue.toLocaleString()}
Total Investment: ₹${metrics === null || metrics === void 0 ? void 0 : metrics.totalInvestment.toLocaleString()}
Total Returns: ₹${metrics === null || metrics === void 0 ? void 0 : metrics.totalReturns.toLocaleString()}
Monthly Income: ₹${metrics === null || metrics === void 0 ? void 0 : metrics.monthlyIncome.toLocaleString()}
Average Yield: ${metrics === null || metrics === void 0 ? void 0 : metrics.averageYield.toFixed(1)}%
Portfolio Growth: +${metrics === null || metrics === void 0 ? void 0 : metrics.portfolioGrowth.toFixed(1)}%
Risk Score: ${metrics === null || metrics === void 0 ? void 0 : metrics.riskScore.toFixed(1)}/10
Diversification Score: ${metrics === null || metrics === void 0 ? void 0 : metrics.diversificationScore.toFixed(1)}/10
Liquidity Score: ${metrics === null || metrics === void 0 ? void 0 : metrics.liquidityScore.toFixed(1)}/10
Market Sentiment: ${metrics === null || metrics === void 0 ? void 0 : metrics.marketSentiment.toUpperCase()}

═══════════════════════════════════════════════════════════

🧠 MARKET INTELLIGENCE
═══════════════════════════════════════════════════════════
${marketInsights.map((insight, index) => `
${index + 1}. ${insight.title}
   Impact: ${insight.impact.toUpperCase()} (${insight.confidence}% confidence)
   Category: ${insight.category.toUpperCase()}
   Description: ${insight.description}
`).join('')}

═══════════════════════════════════════════════════════════

🔮 PREDICTIVE ANALYTICS
═══════════════════════════════════════════════════════════
${predictiveAnalysis.map((analysis, index) => `
${index + 1}. ${analysis.period}
   Expected Return: +${analysis.expectedReturn}%
   Confidence Level: ${analysis.confidence}%
   Risk Level: ${analysis.riskLevel.toUpperCase()}
   Recommendation: ${analysis.recommendation}
`).join('')}

═══════════════════════════════════════════════════════════

📈 PERFORMANCE SUMMARY
═══════════════════════════════════════════════════════════
✅ Portfolio performing 23% above market average
✅ Well-diversified across commercial property types
✅ Strong cash flow with consistent monthly income
✅ AI models indicate bullish market sentiment
⚠️  Consider diversifying into data centers for higher yields

═══════════════════════════════════════════════════════════

DISCLAIMER: This report is generated for informational purposes only. 
Past performance does not guarantee future results. All investments 
carry risk and may lose value.

© 2024 100GAJ Equity Platform. All rights reserved.
`;
            // Create and download the report
            const dataBlob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `100GAJ-Analytics-Report-${currentDate}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Clean up
            URL.revokeObjectURL(url);
            toast.success("📊 Comprehensive analytics report downloaded successfully!");
        }
        catch (error) {
            toast.error("Failed to generate report. Please try again.");
        }
        finally {
            setExporting(false);
        }
    };
    const handleShareAnalysis = async () => {
        setSharing(true);
        toast.info("Creating shareable analytics summary...");
        try {
            // Simulate generating shareable content
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Create shareable summary text
            const shareText = `🏢 My 100GAJ Portfolio Analytics

📊 Performance Highlights:
• Portfolio Value: ₹${metrics === null || metrics === void 0 ? void 0 : metrics.totalPortfolioValue.toLocaleString()}
• Average Yield: ${metrics === null || metrics === void 0 ? void 0 : metrics.averageYield.toFixed(1)}%
• Growth: +${metrics === null || metrics === void 0 ? void 0 : metrics.portfolioGrowth.toFixed(1)}%
• Risk Score: ${metrics === null || metrics === void 0 ? void 0 : metrics.riskScore.toFixed(1)}/10

💡 AI Insights:
• Portfolio performing 23% above market average
• Well-diversified across commercial properties
• Strong monthly income stream

🔮 Outlook: ${(metrics === null || metrics === void 0 ? void 0 : metrics.marketSentiment) === 'bullish' ? '📈 Bullish' : (metrics === null || metrics === void 0 ? void 0 : metrics.marketSentiment) === 'bearish' ? '📉 Bearish' : '➡️ Neutral'}

Generated: ${new Date().toLocaleDateString()}
Platform: 100GAJ Equity Investment

#RealEstate #Investment #Portfolio #100GAJ`;
            // Check if Web Share API is available
            if (navigator.share) {
                await navigator.share({
                    title: '100GAJ Portfolio Analytics',
                    text: shareText,
                    url: window.location.href,
                });
                toast.success("🚀 Analytics shared successfully!");
            }
            else {
                // Fallback to clipboard
                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(shareText);
                    toast.success("📋 Analytics summary copied to clipboard! You can now paste it anywhere to share.");
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
                    toast.success("📋 Analytics summary copied to clipboard! You can now paste it anywhere to share.");
                }
            }
            // Also provide an option to generate a shareable link
            setTimeout(() => {
                const shareableData = {
                    metrics: {
                        portfolioValue: metrics === null || metrics === void 0 ? void 0 : metrics.totalPortfolioValue,
                        averageYield: metrics === null || metrics === void 0 ? void 0 : metrics.averageYield,
                        riskScore: metrics === null || metrics === void 0 ? void 0 : metrics.riskScore,
                        diversificationScore: metrics === null || metrics === void 0 ? void 0 : metrics.diversificationScore,
                        portfolioGrowth: metrics === null || metrics === void 0 ? void 0 : metrics.portfolioGrowth
                    },
                    timeframe: selectedTimeframe,
                    timestamp: new Date().toISOString(),
                    type: 'analytics_share'
                };
                const encodedData = btoa(JSON.stringify(shareableData));
                const shareableUrl = `${window.location.origin}/equity/shared?data=${encodedData}`;
                // Show additional option
                toast.info("💡 Want a shareable link instead? Check your downloads for the report file!", {
                    duration: 4000,
                });
            }, 2000);
        }
        catch (error) {
            console.error('Share error:', error);
            toast.error("Failed to share analytics. Please try again.");
        }
        finally {
            setSharing(false);
        }
    };
    const getImpactColor = (impact) => {
        switch (impact) {
            case "positive": return "text-green-400 bg-green-500/10 border-green-500/20";
            case "negative": return "text-red-400 bg-red-500/10 border-red-500/20";
            case "neutral": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
            default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
        }
    };
    const getRiskColor = (level) => {
        switch (level) {
            case "low": return "text-green-400 bg-green-500/10";
            case "medium": return "text-yellow-400 bg-yellow-500/10";
            case "high": return "text-red-400 bg-red-500/10";
            default: return "text-gray-400 bg-gray-500/10";
        }
    };
    const getSentimentColor = (sentiment) => {
        switch (sentiment) {
            case "bullish": return "text-green-400";
            case "bearish": return "text-red-400";
            case "neutral": return "text-yellow-400";
            default: return "text-gray-400";
        }
    };
    if (isLoading) {
        return (<div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading analytics dashboard...</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-black relative overflow-hidden">
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
            <motion.h1 className="text-4xl sm:text-5xl font-bold mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="text-[#a78bfa]">Analytics</span> <span className="text-white">Dashboard</span>
            </motion.h1>
            <motion.p className="text-xl text-gray-300" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              Advanced insights and predictive analytics for your portfolio
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div className="flex flex-wrap gap-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Button onClick={handleRefresh} disabled={refreshing} className="bg-[#23232a] hover:bg-[#2a2a32] text-white border border-[#3a3a42] transition-all duration-300 group">
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}/>
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            
            <Button onClick={handleExportReport} disabled={exporting} className="bg-[#23232a] hover:bg-[#2a2a32] text-white border border-[#3a3a42] transition-all duration-300 group">
              <Download className={`w-4 h-4 mr-2 ${exporting ? 'animate-bounce' : 'group-hover:translate-y-[-2px] transition-transform duration-300'}`}/>
              {exporting ? 'Exporting...' : 'Export Report'}
            </Button>
            
            <Button onClick={handleShareAnalysis} disabled={sharing} className="bg-[#23232a] hover:bg-[#2a2a32] text-white border border-[#3a3a42] transition-all duration-300 group">
              <Share2 className={`w-4 h-4 mr-2 ${sharing ? 'animate-pulse' : 'group-hover:scale-110 transition-transform duration-300'}`}/>
              {sharing ? 'Sharing...' : 'Share Analysis'}
            </Button>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 rounded-2xl w-full">
            <motion.div whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-black rounded-xl p-6 border border-[#a78bfa] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-500/30 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300"/>
                  </div>
                  <div className="text-right">
                    <div className="text-lg sm:text-2xl font-bold text-white">
                      ₹{metrics === null || metrics === void 0 ? void 0 : metrics.totalPortfolioValue.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Portfolio Value</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-purple-300">
                  <TrendingUp className="w-4 h-4"/>
                  <span>+{metrics === null || metrics === void 0 ? void 0 : metrics.portfolioGrowth}% growth</span>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-black rounded-xl p-6 border border-[#a78bfa] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-500/30 flex items-center justify-center">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300"/>
                  </div>
                  <div className="text-right">
                    <div className="text-lg sm:text-2xl font-bold text-white">
                      {metrics === null || metrics === void 0 ? void 0 : metrics.averageYield.toFixed(1)}%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Average Yield</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-purple-300">
                  <ArrowUpRight className="w-4 h-4"/>
                  <span>Above market average</span>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-black rounded-xl p-6 border border-[#a78bfa] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-500/30 flex items-center justify-center">
                    <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300"/>
                  </div>
                  <div className="text-right">
                    <div className="text-lg sm:text-2xl font-bold text-white">
                      {metrics === null || metrics === void 0 ? void 0 : metrics.riskScore.toFixed(1)}/10
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Risk Score</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-purple-300">
                  <Activity className="w-4 h-4"/>
                  <span>Moderate risk</span>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-black rounded-xl p-6 border border-[#a78bfa] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-500/30 flex items-center justify-center">
                    <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300"/>
                  </div>
                  <div className="text-right">
                    <div className="text-lg sm:text-2xl font-bold text-white">
                      {metrics === null || metrics === void 0 ? void 0 : metrics.diversificationScore.toFixed(1)}/10
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Diversification</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-purple-300">
                  <CheckCircle className="w-4 h-4"/>
                  <span>Well diversified</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Analysis Controls */}
          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-700 mb-8">
            <div className="relative z-10">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {timeframes.map((timeframe) => (<button key={timeframe.value} onClick={() => setSelectedTimeframe(timeframe.value)} className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 border-2 ${selectedTimeframe === timeframe.value
                ? "bg-gradient-to-r from-white via-purple-400 to-purple-600 bg-clip-text text-transparent border-purple-400"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600 border-transparent"}`}>
                      {timeframe.label}
                    </button>))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysisTypes.map((type) => (<button key={type.value} onClick={() => setSelectedAnalysis(type.value)} className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 border-2 ${selectedAnalysis === type.value
                ? "bg-gradient-to-r from-white via-purple-400 to-purple-600 bg-clip-text text-transparent border-purple-400"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600 border-transparent"}`}>
                      {type.label}
                    </button>))}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="mb-8 w-full">
            <PerformanceChart />
          </div>

          {/* Market Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Market Intelligence */}
            <motion.div className="bg-gray-900 rounded-xl p-6 border border-gray-700 cursor-pointer group" whileHover={{
            scale: 1.02,
            boxShadow: "0 0 30px rgba(147, 51, 234, 0.3)",
            borderColor: "rgb(147, 51, 234)"
        }} transition={{ duration: 0.3 }}>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center" whileHover={{ rotate: 10, scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <Brain className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-300"/>
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">Market Intelligence</h3>
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">AI-powered market insights</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {marketInsights.map((insight, index) => (<motion.div key={index} className={`p-4 rounded-lg border ${insight.title === 'REIT Regulations Update' ? 'bg-[#B6FF3F]/10 border-[#B6FF3F]/40' : getImpactColor(insight.impact)} relative overflow-hidden group/insight cursor-pointer`} whileHover={{ scale: 1.01, y: -2 }} transition={{ duration: 0.2 }}>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-white group-hover:text-[#B6FF3F] transition-colors duration-300">{insight.title}</h4>
                          <div className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-400 group-hover:bg-gray-700 group-hover:text-gray-300 transition-colors duration-300">
                            {insight.confidence}% confidence
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 mb-2 group-hover:text-gray-200 transition-colors duration-300">{insight.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full group-hover:bg-gray-600 transition-colors duration-300">
                            {insight.category}
                          </span>
                          <span className={`text-xs capitalize ${insight.impact === 'positive' || insight.title === 'REIT Regulations Update' ? 'text-[#B6FF3F] font-bold' : insight.impact === 'negative' ? 'text-red-400' : 'text-yellow-400'} group-hover:scale-105 transition-transform duration-300`}>
                            {insight.impact} impact
                          </span>
                        </div>
                      </div>
                    </motion.div>))}
                </div>
              </div>
            </motion.div>

            {/* Predictive Analysis */}
            <motion.div className="bg-gray-900 rounded-xl p-6 border border-gray-700 cursor-pointer group" whileHover={{
            scale: 1.02,
            boxShadow: "0 0 30px rgba(147, 51, 234, 0.3)",
            borderColor: "rgb(147, 51, 234)"
        }} transition={{ duration: 0.3 }}>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center" whileHover={{ rotate: -10, scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <Zap className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-300"/>
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-100 transition-colors duration-300">Predictive Analytics</h3>
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">Future performance forecasts</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {predictiveAnalysis.map((analysis, index) => (<motion.div key={index} className="p-4 bg-gray-800 rounded-lg border border-gray-600 relative overflow-hidden group/analysis cursor-pointer" whileHover={{ scale: 1.01, y: -2 }} transition={{ duration: 0.2 }}>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-white group-hover:text-[#B6FF3F] transition-colors duration-300">{analysis.period}</h4>
                          <div className={`text-xs px-2 py-1 rounded-full ${getRiskColor(analysis.riskLevel)} group-hover:scale-105 transition-transform duration-300`}>
                            {analysis.riskLevel} risk
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Expected Return</div>
                            <div className="text-lg font-bold text-[#B6FF3F] drop-shadow-[0_0_6px_#B6FF3F] group-hover:text-[#B6FF3F] transition-colors duration-300">
                              +{analysis.expectedReturn}%
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Confidence</div>
                            <div className="text-lg font-bold text-white group-hover:text-[#B6FF3F] transition-colors duration-300">
                              {analysis.confidence}%
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">{analysis.recommendation}</div>
                      </div>
                    </motion.div>))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Market Sentiment */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Current Market Sentiment</h3>
                  <div className="flex items-center gap-3">
                    <div className={`text-4xl font-bold ${getSentimentColor((metrics === null || metrics === void 0 ? void 0 : metrics.marketSentiment) || "neutral")}`}>
                      {(_a = metrics === null || metrics === void 0 ? void 0 : metrics.marketSentiment) === null || _a === void 0 ? void 0 : _a.toUpperCase()}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`w-6 h-6 ${getSentimentColor((metrics === null || metrics === void 0 ? void 0 : metrics.marketSentiment) || "neutral")}`}/>
                      <span className="text-gray-400">Overall trend positive for commercial real estate</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">Market Confidence</div>
                  <div className="text-3xl font-bold text-green-400">87%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
