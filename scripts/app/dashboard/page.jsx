"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaChartLine, FaRupeeSign, FaBuilding, FaDownload, FaPlus, FaArrowUp, FaMapMarkerAlt, FaFileAlt } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function InvestorDashboard() {
    const [investments, setInvestments] = useState([]);
    const [portfolioSummary, setPortfolioSummary] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
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
    useEffect(() => {
        // Check authentication
        if (typeof window !== "undefined") {
            const token = sessionStorage.getItem('authToken');
            if (!token) {
                router.push('/');
                toast.error("Please login to view your dashboard");
                return;
            }
            setIsAuthenticated(true);
        }
        // Load user investments (replace with real API call if available)
        setTimeout(() => {
            setInvestments([]); // TODO: Replace with real data
            calculatePortfolioSummary([]); // TODO: Replace with real data
            setLoading(false);
        }, 1000);
    }, [router]);
    const calculatePortfolioSummary = (userInvestments) => {
        const summary = userInvestments.reduce((acc, investment) => {
            acc.totalInvested += investment.totalInvested;
            acc.currentValue += investment.currentValue;
            acc.totalReturns += investment.totalReturns;
            acc.monthlyIncome += investment.monthlyRental;
            acc.totalCapitalAppreciation += investment.capitalAppreciation;
            acc.totalRentalReceived += investment.totalRentalReceived;
            return acc;
        }, {
            totalInvested: 0,
            currentValue: 0,
            totalReturns: 0,
            monthlyIncome: 0,
            totalCapitalAppreciation: 0,
            totalRentalReceived: 0,
            overallROI: 0,
            propertiesCount: userInvestments.length
        });
        summary.overallROI = summary.totalInvested > 0
            ? (summary.totalReturns / summary.totalInvested) * 100
            : 0;
        setPortfolioSummary(summary);
    };
    const formatCurrency = (amount) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)}Cr`;
        }
        else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)}L`;
        }
        else {
            return `₹${amount.toLocaleString()}`;
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };
    const handleDownloadStatement = () => {
        toast.success("Investment statement will be downloaded shortly");
        // Mock download functionality
    };
    const handleDownloadOwnershipDoc = () => {
        toast.success("Ownership document will be downloaded shortly");
        // Mock download functionality
    };
    if (!isAuthenticated) {
        return null;
    }
    if (loading) {
        return (<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your portfolio...</p>
          </div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div className="absolute inset-0" style={{
            background: `radial-gradient(700px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(251, 146, 60, 0.10), transparent 70%)`,
            opacity: 0.25,
            filter: 'blur(0.5px)'
        }}/>
        {/* Subtle grid overlay for extra polish */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:24px_24px] opacity-20"/>
      </div>
      <Navbar />

      {/* Header */}
      <section className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Investment Dashboard
                </h1>
                <p className="text-gray-400 text-lg">
                  Track your commercial real estate portfolio performance
                </p>
              </div>
              <Link href="/commercial">
                <Button className="luxury-button mt-4 lg:mt-0">
                  <FaPlus className="w-4 h-4 mr-2"/>
                  Explore Properties
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Summary */}
      {portfolioSummary && (<section className="px-4 mb-12">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Card className="luxury-card mb-8">
                <CardHeader>
                  <CardTitle className="text-white">Portfolio Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">
                        {formatCurrency(portfolioSummary.totalInvested)}
                      </div>
                      <div className="text-sm text-gray-400">Total Invested</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {formatCurrency(portfolioSummary.currentValue)}
                      </div>
                      <div className="text-sm text-gray-400">Current Value</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {formatCurrency(portfolioSummary.monthlyIncome)}
                      </div>
                      <div className="text-sm text-gray-400">Monthly Income</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {formatCurrency(portfolioSummary.totalReturns)}
                      </div>
                      <div className="text-sm text-gray-400">Total Returns</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {portfolioSummary.overallROI.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">Overall ROI</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {portfolioSummary.propertiesCount}
                      </div>
                      <div className="text-sm text-gray-400">Properties</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="luxury-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400">Capital Appreciation</div>
                        <div className="text-xl font-bold text-green-400">
                          {formatCurrency(portfolioSummary.totalCapitalAppreciation)}
                        </div>
                      </div>
                      <FaArrowUp className="w-8 h-8 text-green-400"/>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Property value increase
                    </div>
                  </CardContent>
                </Card>

                <Card className="luxury-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400">Rental Income</div>
                        <div className="text-xl font-bold text-blue-400">
                          {formatCurrency(portfolioSummary.totalRentalReceived)}
                        </div>
                      </div>
                      <FaRupeeSign className="w-8 h-8 text-blue-400"/>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Total rental received
                    </div>
                  </CardContent>
                </Card>

                <Card className="luxury-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400">Net Profit</div>
                        <div className="text-xl font-bold text-purple-400">
                          {formatCurrency(portfolioSummary.currentValue - portfolioSummary.totalInvested)}
                        </div>
                      </div>
                      <FaChartLine className="w-8 h-8 text-purple-400"/>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Unrealized gains
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>)}

      {/* Investment Details */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800 mb-8">
              <TabsTrigger value="properties" className="data-[state=active]:bg-orange-500">
                My Properties
              </TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-orange-500">
                Transaction History
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-orange-500">
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="properties">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {investments.map((investment, index) => (<motion.div key={investment._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                    <Card className="luxury-card hover:shadow-orange-500/20 hover:shadow-lg transition-all duration-300">
                      <div className="relative h-48">
                        <Image src={investment.property.images[0] || "/commercial/placeholder.jpg"} alt={investment.property.title} fill className="object-cover rounded-t-lg"/>
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-orange-500 text-white">
                            {investment.property.propertyType}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-sm">
                            {investment.ownershipPercentage.toFixed(2)}% Owned
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {investment.property.title}
                          </h3>
                          <div className="flex items-center text-gray-400 text-sm">
                            <FaMapMarkerAlt className="w-4 h-4 mr-2"/>
                            {investment.property.location}
                          </div>
                        </div>

                        {/* Investment Summary */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                            <div className="text-lg font-bold text-orange-500">
                              {formatCurrency(investment.totalInvested)}
                            </div>
                            <div className="text-xs text-gray-400">Invested</div>
                          </div>
                          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                            <div className="text-lg font-bold text-green-400">
                              {formatCurrency(investment.currentValue)}
                            </div>
                            <div className="text-xs text-gray-400">Current Value</div>
                          </div>
                          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                            <div className="text-lg font-bold text-blue-400">
                              {formatCurrency(investment.monthlyRental)}
                            </div>
                            <div className="text-xs text-gray-400">Monthly Rental</div>
                          </div>
                          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                            <div className="text-lg font-bold text-purple-400">
                              {investment.sharesOwned.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400">Shares Owned</div>
                          </div>
                        </div>

                        {/* Performance */}
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-sm">Total Returns</span>
                            <span className="text-green-400 font-bold">
                              {formatCurrency(investment.totalReturns)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-sm">Capital Appreciation</span>
                            <span className="text-green-400">
                              +{formatCurrency(investment.capitalAppreciation)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Rental Received</span>
                            <span className="text-blue-400">
                              {formatCurrency(investment.totalRentalReceived)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Link href={`/commercial/${investment.propertyId}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              View Property
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" onClick={() => handleDownloadStatement()}>
                            <FaDownload className="w-4 h-4"/>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>))}
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle className="text-white">Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {investments.map((investment) => (<div key={investment._id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                            <FaBuilding className="w-6 h-6 text-green-400"/>
                          </div>
                          <div>
                            <div className="text-white font-medium">Share Purchase</div>
                            <div className="text-sm text-gray-400">{investment.property.title}</div>
                            <div className="text-xs text-gray-500">
                              {formatDate(investment.purchaseDate)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">
                            {formatCurrency(investment.totalInvested)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {investment.sharesOwned} shares
                          </div>
                        </div>
                      </div>))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle className="text-white">Investment Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {investments.map((investment) => (<div key={investment._id} className="border-b border-gray-700 pb-6 last:border-b-0">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          {investment.property.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center">
                              <FaFileAlt className="w-5 h-5 text-orange-400 mr-3"/>
                              <div>
                                <div className="text-white font-medium">Ownership Certificate</div>
                                <div className="text-sm text-gray-400">PDF Document</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadOwnershipDoc()}>
                              <FaDownload className="w-4 h-4"/>
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center">
                              <FaFileAlt className="w-5 h-5 text-blue-400 mr-3"/>
                              <div>
                                <div className="text-white font-medium">Investment Statement</div>
                                <div className="text-sm text-gray-400">PDF Document</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadStatement()}>
                              <FaDownload className="w-4 h-4"/>
                            </Button>
                          </div>
                        </div>
                      </div>))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>);
}
