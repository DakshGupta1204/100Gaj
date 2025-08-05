"use client";

import React, { useState, useEffect } from 'react';
import { Building, FileText, Mail, Plus, Home, User, CheckCircle, Inbox, Edit, Users, Calendar, CreditCard, Bell, Settings, Download, Trash2, Edit2, FileDown, AlertTriangle, TrendingUp, DollarSign, Clock, MapPin, Eye, BarChart3, Activity, Zap, Droplets, Wifi, Receipt, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Background from '../../_components/Background';
import { useAuth } from '../../Context/AuthProvider';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import axios from 'axios';
import { format } from 'date-fns';
import UtilityBill, { UtilityBillResponse } from '../../models/Utility';

export default function LandlordDashboard() {
  const { user } = useAuth();


  const [landlordName, setLandlordName] = useState('');

  const [dashboardData, setDashboardData] = useState({
    totalProperties: 6,
    monthlyIncome: 120000,
    activeTenants: 12,
    upcomingRentDue: 3,
    leaseProgress: 60,
    recentActivity: [
      { type: 'payment', message: 'Rent received from Urban Loft', time: '2 hours ago', amount: '₹18,000' },
      { type: 'inquiry', message: 'New inquiry for Family Home', time: '4 hours ago' },
      { type: 'maintenance', message: 'Maintenance request resolved', time: '1 day ago' },
      { type: 'tenant', message: 'New tenant moved in', time: '2 days ago' }
    ]
  });

  // Utility Bills State
  const [utilityBills, setUtilityBills] = useState({
    pending: [
      { 
        id: 1, 
        tenantName: 'John Doe', 
        property: 'Urban Loft', 
        utilityType: 'electricity', 
        amount: 2500, 
        billingPeriod: { start: '2024-01-01', end: '2024-01-31' },
        dueDate: '2024-02-15', 
        responsibleParty: 'tenant',
        billDocument: '',
        notes: 'Monthly electricity bill'
      },
      { 
        id: 2, 
        tenantName: 'Jane Smith', 
        property: 'Family Home', 
        utilityType: 'water', 
        amount: 800, 
        billingPeriod: { start: '2024-01-01', end: '2024-01-31' },
        dueDate: '2024-02-20', 
        responsibleParty: 'landlord',
        billDocument: '',
        notes: 'Water bill for January'
      }
    ],
    overdue: [
      { 
        id: 3, 
        tenantName: 'Mike Johnson', 
        property: 'City Apartment', 
        utilityType: 'internet', 
        amount: 1200, 
        billingPeriod: { start: '2024-01-01', end: '2024-01-31' },
        dueDate: '2024-02-10', 
        responsibleParty: 'tenant',
        billDocument: '',
        notes: 'Internet service bill'
      }
    ],
    paid: [
      { 
        id: 4, 
        tenantName: 'Sarah Wilson', 
        property: 'Garden Villa', 
        utilityType: 'electricity', 
        amount: 1800, 
        billingPeriod: { start: '2023-12-01', end: '2023-12-31' },
        dueDate: '2024-01-25', 
        responsibleParty: 'tenant',
        billDocument: '',
        notes: 'December electricity bill',
        paidDate: '2024-01-20',
        status: 'paid'
      }
    ]
  });

const [billinfo, setbillinfo] = useState<UtilityBillResponse[]>([]);
const [billid , setbillId] = useState("") 
  const [showCreateBill, setShowCreateBill] = useState(false);
  const [newBill, setNewBill] = useState({
    utilityType: '',
    amount: '',
    billingPeriod: { start: '', end: '' },
    dueDate: '',
    responsibleParty: 'tenant',
    billDocument: '',
    notes: ''
  });
  useEffect(() => {
    if (user) {
      const firstName = user.name ? user.name.split(' ')[0] : 'User';
      setLandlordName(firstName);
    }
  }, [user]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment': return <DollarSign className="w-4 h-4 text-green-400" />;
      case 'inquiry': return <Mail className="w-4 h-4 text-blue-400" />;
      case 'maintenance': return <Settings className="w-4 h-4 text-orange-400" />;
      case 'tenant': return <User className="w-4 h-4 text-purple-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getUtilityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'electricity': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'water': return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'internet': return <Wifi className="w-4 h-4 text-purple-400" />;
      case 'gas': return <AlertCircle className="w-4 h-4 text-orange-400" />;
      case 'trash': return <Trash2 className="w-4 h-4 text-gray-400" />;
      case 'other': return <Receipt className="w-4 h-4 text-gray-400" />;
      default: return <Receipt className="w-4 h-4 text-gray-400" />;
    }
  };

  // get all bills status which landlord has created 
  useEffect(() => {
const Getallbills = async() => {
    try {
     const response = await axios.get('/microestate/api/bills')
      const bills = response.data.bills;
      console.log("Bill found Successfully", bills);

      const formattedBills = bills.map((bill: { dueDate: string | number | Date; }) => ({
        ...bill,
        dueDateFormatted: format(new Date(bill.dueDate), 'dd/MM/yy'),
      }));

    console.log("Bill found Sucessfully" ,  formattedBills )
    setbillinfo(formattedBills)
   setbillId(response.data.bills[0]._id)


    } catch (error) {
      console.log("Error while getting all bills" , error)
    }
  }
  Getallbills()
  } , [])


  const handleCreateBill = async () => {
    try {
      // Validate required fields
      if (!newBill.utilityType || !newBill.amount || !newBill.dueDate || !newBill.responsibleParty) {
        alert('Please fill in all required fields');
        return;
      }

      // Prepare data for API call
      const billData = {
        utilityType: newBill.utilityType,
        amount: parseFloat(newBill.amount),
        billingPeriod: {
          start: newBill.billingPeriod.start,
          end: newBill.billingPeriod.end
        },
        dueDate: newBill.dueDate,
        responsibleParty: newBill.responsibleParty,
        billDocument: newBill.billDocument,
        notes: newBill.notes
      };

      
      console.log('Creating bill:', billData);
       const response = await axios.post('/microestate/api/bills' )
       console.log(response , "Bill created Sucessfully")
      
      // Reset form
      setShowCreateBill(false);
      setNewBill({
        utilityType: '',
        amount: '',
        billingPeriod: { start: '', end: '' },
        dueDate: '',
        responsibleParty: 'tenant',
        billDocument: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating bill:', error);
    }
  };

  const handleMarkAsPaid = async () => {
    try {

      const response = await axios.post('/microestate/api/bills/mark-as-paid' ,
      {
        billId: billid
      }
      )
      console.log('marked sucessfully', response);


    } catch (error) {
      console.error('Error marking bill as paid:', error);
    }
  };

  const calculateUtilityStats = () => {
    const totalPending = utilityBills.pending.reduce((sum, bill) => sum + bill.amount, 0);
    const totalOverdue = utilityBills.overdue.reduce((sum, bill) => sum + bill.amount, 0);
    const totalPaid = utilityBills.paid.reduce((sum, bill) => sum + bill.amount, 0);
    const averageBill = utilityBills.paid.length > 0 ? totalPaid / utilityBills.paid.length : 0;
    
    return { totalPending, totalOverdue, totalPaid, averageBill };
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #dc2626);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #b91c1c);
        }
      `}</style>
      <Background />
      <div className="container mx-auto py-10 mt-8 relative z-10">
        {/* Welcome Header */}
        <motion.section className="mb-8" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }}>
          <div className="flex items-center justify-between">
            <motion.div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border-2 border-gradient-to-r from-orange-500 to-red-500 p-6 rounded-2xl shadow-xl" whileHover={{ scale: 1.03, rotate: 1 }}>
              <motion.div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-3xl font-bold text-transparent bg-clip-text" animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                {landlordName ? landlordName[0] : 'U'}
              </motion.div>
              <div>
                <div className="text-4xl font-bold text-gray-300 font-sans">Welcome back, <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">{landlordName || 'User'}</span></div>
                <div className="text-sm text-gray-400 mt-1">Here's your property overview</div>
              </div>
            </motion.div>
            {/* Quick Actions */}
            <div className="flex gap-3">
              <Link href="/microestate/landlord/properties/add">
                <motion.div whileHover={{ scale: 1.08, boxShadow: '0 0 16px 4px #ff6a00' }} className="relative group">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300">
                    <motion.span initial={{ scale: 1 }} whileHover={{ scale: 1.2, rotate: 10 }} className="inline-block">
                      <Plus className="w-4 h-4 mr-2" />
                    </motion.span>
                  </Button>
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-black/80 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-lg">Add a new property</span>
                </motion.div>
              </Link>
              <Button variant="outline" className="border-transparent border-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 hover:bg-red-500 hover:text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105">
                <BarChart3 className="w-4 h-4 mr-2 text-orange-500" />
                View Reports
              </Button>
            </div>
          </div>
        </motion.section>
        {/* Key Metrics Cards */}
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Building className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />,
              stat: dashboardData.totalProperties,
              label: 'Total Properties',
              sub: '+2 this month',
              subColor: 'text-green-400',
              trendIcon: <TrendingUp className="w-5 h-5 text-green-400" />,
            },
            {
              icon: <DollarSign className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />,
              stat: dashboardData.monthlyIncome,
              label: 'Monthly Income',
              sub: '+12% from last month',
              subColor: 'text-green-400',
              trendIcon: <TrendingUp className="w-5 h-5 text-green-400" />,
              prefix: '₹',
            },
            {
              icon: <Users className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />,
              stat: dashboardData.activeTenants,
              label: 'Active Tenants',
              sub: 'All payments on time',
              subColor: 'text-green-400',
              trendIcon: <CheckCircle className="w-5 h-5 text-green-400" />,
            },
            {
              icon: <Calendar className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />,
              stat: dashboardData.upcomingRentDue,
              label: 'Upcoming Rent Due',
              sub: 'Due in 5 days',
              subColor: 'text-yellow-400',
              trendIcon: <Clock className="w-5 h-5 text-yellow-400" />,
            },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              className="bg-white/5 backdrop-blur-xl border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 h-full flex flex-col justify-between cursor-pointer group"
              style={{ perspective: 1000 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.7, type: 'spring' }}
              whileHover={{ scale: 1.04, rotateX: 8, translateZ: 40 }}
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div whileHover={{ rotate: 10 }} className="transition-transform duration-300">
                  {card.icon}
                </motion.div>
                {card.trendIcon}
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {card.prefix || ''}
                <CountUp end={card.stat} duration={1.2} separator="," />
              </div>
              <div className="text-sm text-gray-400 font-semibold">{card.label}</div>
              <div className={`text-xs mt-2 ${card.subColor}`}>{card.sub}</div>
            </motion.div>
          ))}
        </section>
        {/* Main Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          {/* Properties Overview */}
          <div className="lg:col-span-2 bg-glass border border-transparent border-gradient-to-r from-orange-500 to-red-500 shadow-xl rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Home className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />
                Recent Properties
              </h2>
              <Link href="/microestate/landlord/properties">
                <Button variant="outline" className="border-transparent border-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 hover:bg-red-500 hover:text-white text-sm">
                  View All
                </Button>
              </Link>
            </div>
            {/* Property overview cards section (replace the property cards with the correct structure) */}
            <div className="space-y-4">
              <div className="dashboard-gradient-card">
                <div className="flex items-center justify-between p-4 bg-[#1a1a1f] rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Urban Loft</div>
                      <div className="text-sm text-gray-400">₹18,000/month</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Occupied</span>
                    <Button size="sm" variant="outline" className="border-transparent border-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 hover:bg-red-500 hover:text-white">
                      <Eye className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="dashboard-gradient-card">
                <div className="flex items-center justify-between p-4 bg-[#1a1a1f] rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Family Home</div>
                      <div className="text-sm text-gray-400">₹35,000/month</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">Vacant</span>
                    <Button size="sm" variant="outline" className="border-transparent border-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 hover:bg-red-500 hover:text-white">
                      <Eye className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Recent Activity */}
          <div className="bg-glass border border-transparent border-gradient-to-r from-orange-500 to-red-500 shadow-xl rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {dashboardData.recentActivity.map((activity, index) => (
                <div key={index} className="dashboard-gradient-card">
                  <div className="flex items-start gap-3 p-3 bg-[#1a1a1f] rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <div className="text-sm text-white">{activity.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                      {activity.amount && (
                        <div className="text-xs text-green-400 mt-1">{activity.amount}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Lease Progress Section
        <section className="mt-8 bg-glass border border-transparent border-gradient-to-r from-orange-500 to-red-500 shadow-xl rounded-2xl p-6 animate-fadeIn">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />
            Lease Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{dashboardData.leaseProgress}%</div>
              <div className="text-sm text-gray-400">Complete</div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-2 text-sm text-gray-400">
                <span>Current Period</span>
                <span>Ends in 5 months</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-red-600 h-3 rounded-full transition-all duration-700" 
                  style={{ width: `${dashboardData.leaseProgress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">₹18,000</div>
              <div className="text-sm text-gray-400">Monthly Rent</div>
            </div>
          </div>
        </section> */}





                 {/* Utility Bills Section */}
         <section className="mt-8 bg-gradient-to-br from-[#1a1a1f] via-[#1f1f25] to-[#2a2a2f] border border-orange-500/20 shadow-2xl rounded-2xl p-8 animate-fadeIn relative overflow-hidden">
           {/* Background Pattern */}
           <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-50"></div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-500/10 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
           
           <div className="relative z-10">
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                   <Receipt className="w-7 h-7 text-white" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-bold text-white">Utility Bills Management</h2>
                   <p className="text-gray-400 text-sm">Track and manage all utility expenses</p>
                 </div>
               </div>
               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                 <Button 
                   onClick={() => setShowCreateBill(true)}
                   className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30"
                 >
                   <Plus className="w-5 h-5 mr-2" />
                   Create Bill
                 </Button>
               </motion.div>
             </div>

                     {/* Utility Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
             {(() => {
               const stats = calculateUtilityStats();
               return [
                 {
                   title: 'Pending Bills',
                   value: `₹${stats.totalPending.toLocaleString()}`,
                   count: utilityBills.pending.length,
                   color: 'text-yellow-400',
                   bgColor: 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10',
                   borderColor: 'border-yellow-500/20',
                   icon: <Clock className="w-6 h-6" />
                 },
                 {
                   title: 'Overdue Bills',
                   value: `₹${stats.totalOverdue.toLocaleString()}`,
                   count: utilityBills.overdue.length,
                   color: 'text-red-400',
                   bgColor: 'bg-gradient-to-br from-red-500/10 to-pink-500/10',
                   borderColor: 'border-red-500/20',
                   icon: <AlertCircle className="w-6 h-6" />
                 },
                 {
                   title: 'This Month Paid',
                   value: `₹${stats.totalPaid.toLocaleString()}`,
                   count: utilityBills.paid.length,
                   color: 'text-green-400',
                   bgColor: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
                   borderColor: 'border-green-500/20',
                   icon: <CheckCircle className="w-6 h-6" />
                 },
                 {
                   title: 'Average Bill',
                   value: `₹${Math.round(stats.averageBill).toLocaleString()}`,
                   count: utilityBills.paid.length,
                   color: 'text-blue-400',
                   bgColor: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
                   borderColor: 'border-blue-500/20',
                   icon: <BarChart3 className="w-6 h-6" />
                 }
               ].map((stat, index) => (
                 <motion.div
                   key={stat.title}
                   className={`${stat.bgColor} ${stat.borderColor} border rounded-2xl p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.1 }}
                   whileHover={{ scale: 1.02, y: -2 }}
                 >
                   <div className="flex items-center justify-between mb-4">
                     <div className={`${stat.color} p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors`}>
                       {stat.icon}
                     </div>
                     <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">{stat.count} bills</span>
                   </div>
                   <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                   <div className="text-sm text-gray-400 font-medium">{stat.title}</div>
                 </motion.div>
               ));
             })()}
           </div>

                     {/* Bills Lists */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Pending Bills */}
             <div className="bg-gradient-to-br from-[#1a1a1f] to-[#1f1f25] border border-yellow-500/20 rounded-2xl p-6 shadow-lg">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                   <Clock className="w-5 h-5 text-white" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-white">Pending Bills</h3>
                   <p className="text-sm text-gray-400"> bills awaiting payment</p>
                 </div>
               </div>
               <div className="space-y-4">
                 {billinfo.map((bill) => (
                   <motion.div 
                     key={bill._id} 
                     className="bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border border-yellow-500/20 rounded-xl p-4 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group"
                     whileHover={{ scale: 1.02, y: -2 }}
                   >
                     <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-3">
                         
                         <div>
                           <span className="text-white font-semibold capitalize">{bill?.utilityType} </span>
                           <div className="text-sm text-gray-400"> {bill?.tenantId?.firstName} {bill.tenantId?.lastName} <br></br> <h1>property assigned</h1> {bill.propertyId.title}  <br></br> <h1> address</h1> {bill.propertyId.address.city} {bill.propertyId.address.country}</div>
                         </div>
                       </div>
                       <span className="text-xl font-bold text-yellow-400"> {bill?.amount}</span>
                     </div>
                     <div className="flex items-center justify-between text-sm mb-4">
                       <span className="text-yellow-400 font-medium">Due Date: {bill?.dueDateFormatted} </span>
                       <span className="text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full text-xs capitalize">{bill.responsibleParty}</span>
                     </div>
                     <div className="flex gap-3">
                       <Button 
                         size="sm" 
                                 className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                 onClick={() => handleMarkAsPaid()}
                       >
                         <CheckCircle className="w-4 h-4 mr-2" />
                         Mark Paid
                       </Button>
                       {/* <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 text-sm px-4 py-2 rounded-lg hover:bg-gray-700/50 hover:border-orange-500/50 transition-all duration-300">
                         <Edit className="w-4 h-4 mr-2" />
                         Edit
                       </Button> */}
                     </div>
                   </motion.div>
                 ))}
               </div>
             </div>

             {/* Overdue Bills */}
             <div className="bg-gradient-to-br from-[#1a1a1f] to-[#1f1f25] border border-red-500/20 rounded-2xl p-6 shadow-lg">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                   <AlertCircle className="w-5 h-5 text-white" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-white">Overdue Bills</h3>
                   <p className="text-sm text-gray-400">{utilityBills.overdue.length} bills past due date</p>
                 </div>
               </div>
               <div className="space-y-4">

                 {utilityBills.overdue.map((bill) => (
                   <motion.div 
                     key={bill.id} 
                     className="bg-gradient-to-r from-red-500/5 to-pink-500/5 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group"
                     whileHover={{ scale: 1.02, y: -2 }}
                   >
                     <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                           {getUtilityIcon(bill.utilityType)}
                         </div>
                         <div>
                           <span className="text-white font-semibold capitalize">{bill.utilityType}</span>
                           <div className="text-sm text-gray-400"> {bill.tenantName} • {bill.property} </div>
                         </div>
                       </div>
                       <span className="text-xl font-bold text-red-400">₹{bill.amount.toLocaleString()}</span>
                     </div>
                     <div className="flex items-center justify-between text-sm mb-4">
                       <span className="text-red-400 font-medium">Overdue since {new Date(bill.dueDate).toLocaleDateString()}</span>
                       <span className="text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full text-xs capitalize">{bill.responsibleParty}</span>
                     </div>
                     <div className="flex gap-3">
                       <Button 
                         size="sm" 
                         onClick={() => handleMarkAsPaid()}
                         className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                       >
                         <CheckCircle className="w-4 h-4 mr-2" />
                         Mark Paid
                       </Button>
                     </div>
                   </motion.div>
                 ))}
               </div>
             </div>
           </div>

                     {/* Recent Paid Bills */}
           {/* <div className="mt-8 bg-gradient-to-br from-[#1a1a1f] to-[#1f1f25] border border-green-500/20 rounded-2xl p-6 shadow-lg">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                 <CheckCircle className="w-5 h-5 text-white" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-white">Recently Paid Bills</h3>
                 <p className="text-sm text-gray-400">Successfully completed payments</p>
               </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {utilityBills.paid.map((bill) => (
                 <motion.div 
                   key={bill.id} 
                   className="bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-xl p-4 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group"
                   whileHover={{ scale: 1.02, y: -2 }}
                 >
                   <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                         <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                           {getUtilityIcon(bill.utilityType)}
                         </div>
                         <div>
                           <span className="text-white font-semibold capitalize">{bill.utilityType}</span>
                           <div className="text-sm text-gray-400">{bill.tenantName} • {bill.property}</div>
                         </div>
                       </div>
                     <span className="text-xl font-bold text-green-400">₹{bill.amount.toLocaleString()}</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                     <span className="text-green-400 font-medium">Paid: {new Date(bill.paidDate!).toLocaleDateString()}</span>
                     <span className="text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full text-xs capitalize">{bill.responsibleParty}</span>
                   </div>
                 </motion.div>
               ))}
             </div>
           </div> */}
        </div>
      </section>

      {/* Create Bill Modal */}
         {showCreateBill && (
           <motion.div 
             className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
             style={{ paddingTop: '80px' }}
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
           >
             <motion.div 
               className="bg-gradient-to-br from-[#1a1a1f] to-[#2a2a2f] border border-orange-500/20 rounded-2xl shadow-2xl max-w-lg w-full max-h-[calc(100vh-160px)] overflow-hidden flex flex-col mx-4"
               initial={{ scale: 0.9, y: 20, opacity: 0 }}
               animate={{ scale: 1, y: 0, opacity: 1 }}
               exit={{ scale: 0.9, y: 20, opacity: 0 }}
               transition={{ type: "spring", damping: 25, stiffness: 300 }}
             >
                             {/* Header */}
               <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-b border-orange-500/30 p-6 relative overflow-hidden">
                 {/* Background Pattern */}
                 <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5"></div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                 
                 <div className="flex items-start justify-between relative z-10 gap-4">
                   <div className="flex items-start gap-4 flex-1 min-w-0">
                     <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25 flex-shrink-0">
                       <Receipt className="w-6 h-6 text-white" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <h3 className="text-2xl font-bold text-white drop-shadow-sm mb-1">Create Utility Bill</h3>
                     </div>
                   </div>
                   <Button 
                     variant="outline" 
                     onClick={() => setShowCreateBill(false)}
                     className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-orange-500/50 transition-all duration-300 w-10 h-10 p-0 rounded-xl shadow-lg flex-shrink-0"
                   >
                     <span className="text-xl font-bold">×</span>
                   </Button>
                 </div>
               </div>

                             {/* Form Content */}
               <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar min-h-0">
                {/* Utility Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-400" />
                    Utility Type *
                  </label>
                  <div className="relative">
                    <select
                      value={newBill.utilityType}
                      onChange={(e) => setNewBill({...newBill, utilityType: e.target.value})}
                      className="w-full p-4 bg-[#1a1a1f] border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 appearance-none"
                    >
                      <option value="">Select utility type</option>
                      <option value="electricity">⚡ Electricity</option>
                      <option value="water">💧 Water</option>
                      <option value="gas">🔥 Gas</option>
                      <option value="internet">📶 Internet</option>
                      <option value="trash">🗑️ Trash</option>
                      <option value="other">📄 Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    Amount (₹) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={newBill.amount}
                      onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                      className="w-full p-4 pl-12 bg-[#1a1a1f] border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                      placeholder="0.00"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                      ₹
                    </div>
                  </div>
                </div>

                                 {/* Billing Period */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="block text-sm font-semibold text-white">Billing Period Start</label>
                     <input
                       type="date"
                       value={newBill.billingPeriod.start}
                       onChange={(e) => setNewBill({...newBill, billingPeriod: {...newBill.billingPeriod, start: e.target.value}})}
                       className="w-full p-4 bg-[#1a1a1f] border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="block text-sm font-semibold text-white">Billing Period End</label>
                     <input
                       type="date"
                       value={newBill.billingPeriod.end}
                       onChange={(e) => setNewBill({...newBill, billingPeriod: {...newBill.billingPeriod, end: e.target.value}})}
                       className="w-full p-4 bg-[#1a1a1f] border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                     />
                   </div>
                 </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    Due Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={newBill.dueDate}
                      onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                      className="w-full p-4 bg-[#1a1a1f] border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Responsibility Split */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    Responsibility Split *
                  </label>
                  <div className="relative">
                    <select
                      value={newBill.responsibleParty}
                      onChange={(e) => setNewBill({...newBill, responsibleParty: e.target.value})}
                      className="w-full p-4 bg-[#1a1a1f] border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 appearance-none"
                    >
                      <option value="tenant">👤 Tenant</option>
                      <option value="landlord">🏠 Landlord</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Bill Document */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white flex items-center gap-2">
                    <FileDown className="w-4 h-4 text-indigo-400" />
                    Bill Document (Optional)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewBill(prev => ({ ...prev, billDocument: file.name }));
                      }
                    }}
                    className="block w-full text-sm text-gray-400 border border-gray-700/50 rounded-xl cursor-pointer bg-gray-800/50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                  />
                  {newBill.billDocument && (
                    <p className="text-xs text-gray-400 mt-1">{newBill.billDocument}</p>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-yellow-400" />
                    Additional Notes
                  </label>
                  <textarea
                    value={newBill.notes}
                    onChange={(e) => setNewBill({...newBill, notes: e.target.value})}
                    rows={3}
                    className="w-full p-4 bg-[#1a1a1f] border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 resize-none"
                    placeholder="Add any additional notes or details about this bill..."
                  />
                </div>
              </div>

                             {/* Footer */}
               <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 border-t border-orange-500/20 p-6 flex-shrink-0">
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateBill(false)}
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-orange-500/50 transition-all duration-300 py-3 rounded-xl font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateBill}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105"
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    Create Bill
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 