"use client";
import React from 'react';
import { Building, FileText, Mail, Plus, CheckCircle, Inbox, Edit } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Added missing import for Button
import { motion } from 'framer-motion';
import Background from '../../_components/Background';
// TODO: Protect this page for role === 'landlord' using useSession() or JWT check
const landlordName = 'Rajesh';
const stats = [
    {
        label: 'Total Properties',
        value: 6,
        icon: <Building className="w-7 h-7 text-orange-500"/>,
        sub: 'You have 6 total listings',
    },
    {
        label: 'Available Now',
        value: 4,
        icon: <CheckCircle className="w-7 h-7 text-green-500"/>,
        sub: '4 properties are available',
    },
    {
        label: 'Inquiries Pending',
        value: 2,
        icon: <Inbox className="w-7 h-7 text-blue-400"/>,
        sub: '2 inquiries need response',
    },
    {
        label: 'Docs Uploaded',
        value: 9,
        icon: <FileText className="w-7 h-7 text-purple-400"/>,
        sub: '9 documents uploaded',
    },
];
// Update recentProperties to include multiple images per property
const recentProperties = [
    { id: 1, title: 'Urban Loft', price: 18000, status: 'Available', date: '09 Jul 25', images: ['/images/property4.jpg', '/images/property1.jpg', '/images/property5.jpg'] },
    { id: 2, title: 'Family Home', price: 35000, status: 'Available', date: '08 Jul 25', images: ['/images/property5.jpg', '/images/property4.jpg', '/images/property1.jpg'] },
    { id: 3, title: 'Luxury Penthouse', price: 95000, status: 'Rented', date: '05 Jul 25', images: ['/images/property1.jpg', '/images/property5.jpg', '/images/property4.jpg'] },
];
const quickActions = [
    { label: 'Add New Property', icon: <Plus className="w-6 h-6"/>, href: '#' },
    { label: 'View Inquiries', icon: <Mail className="w-6 h-6"/>, href: '#' },
    { label: 'Manage Documents', icon: <FileText className="w-6 h-6"/>, href: '#' },
    { label: 'Edit Profile', icon: <Edit className="w-6 h-6"/>, href: '#' },
];
const recentInquiries = [
    { property: 'Lakeview Flat', tenant: 'Aman Gupta', message: 'Is this still...', date: '11 Jul 25' },
    { property: 'Garden Apt', tenant: 'Sia Mehta', message: 'Can I schedule...', date: '10 Jul 25' },
    { property: 'Urban Loft', tenant: 'Amit Kumar', message: 'Interested in...', date: '09 Jul 25' },
];
export default function LandlordDashboard() {
    // TODO: Add role-based protection here (e.g., useSession() or JWT check)
    return (<div className="relative min-h-screen overflow-x-hidden">
      <Background />
      <div className="container mx-auto py-10 mt-24 relative z-10">
        {/* Welcome Banner */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent text-3xl">👋</span>
            Welcome, <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">{landlordName}</span>!
          </h1>
          <p className="text-gray-300 mt-2">Here&apos;s a quick overview of your rental listings and activity today.</p>
        </motion.div>
        {/* Stats Cards (2x2 grid) */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}>
          {stats.map((stat) => (<div key={stat.label} className="bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4 hover:scale-105 transition-transform">
              <div className="flex-shrink-0">{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400 font-semibold">{stat.label}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.sub}</div>
              </div>
            </div>))}
        </motion.div>
        {/* Quick Actions Panel */}
        <motion.div className="mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}>
          {quickActions.map((action) => (<Link key={action.label} href={action.href} className="block">
              <Button className="w-full min-w-[220px] h-24 bg-orange-500 hover:bg-orange-600 rounded-2xl p-8 shadow-lg flex flex-col items-center justify-center gap-3 text-xl font-bold transition-all duration-200">
                {action.icon}
                {action.label}
              </Button>
            </Link>))}
        </motion.div>
        {/* Recently Added Properties (Horizontal Scroll/3-card grid) */}
        <motion.div className="mb-10" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}>
          <h2 className="text-lg font-bold text-white mb-4">Recently Added Properties</h2>
          <div className="flex gap-6 overflow-x-auto pb-8 pt-8 items-start">
            {recentProperties.map((prop) => (<div key={prop.id} className="min-w-[320px] min-h-[380px] bg-gray-800 rounded-2xl border border-gray-700 transition-all duration-300 flex flex-col items-center p-6 translate-y-0 hover:scale-105 hover:-translate-y-2 hover:border-orange-400 hover:shadow-orange-400/30">
                <div className="w-full h-32 bg-gray-100 rounded-t-2xl flex items-center justify-center mb-2">
                  <span className="text-xl text-gray-700 font-bold">{prop.title}</span>
                </div>
                <div className="text-white font-semibold mb-1">{prop.title}</div>
                <div className="text-orange-400 font-bold mb-1">₹{prop.price.toLocaleString()}/mo</div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded ${prop.status === 'Available' ? 'bg-green-600 text-white' : 'bg-orange-500 text-white'}`}>{prop.status}</span>
                  <span className="text-xs text-gray-400">{prop.date}</span>
                </div>
                <a href="#" className="mt-2 text-orange-400 text-sm font-semibold underline">View Details</a>
              </div>))}
          </div>
          <div className="mt-2 text-right">
            <Link href="#" className="text-orange-400 text-sm font-semibold underline">View All Properties</Link>
          </div>
        </motion.div>
        {/* Recent Inquiries (Table/List Preview) */}
        <motion.div className="mb-10" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}>
          <h2 className="text-lg font-bold text-white mb-4">Recent Inquiries</h2>
          <div className="bg-[#23232a] rounded-xl overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-gray-400 border-b border-[#181c24]">
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Tenant Name</th>
                  <th className="py-3 px-4">Message</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inq, idx) => (<tr key={idx}>
                    <td className="py-2 px-4 text-white">{inq.property}</td>
                    <td className="py-2 px-4 text-gray-300">{inq.tenant}</td>
                    <td className="py-2 px-4 text-gray-400">{inq.message}</td>
                    <td className="py-2 px-4 text-gray-400">{inq.date}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-right">
            <Link href="#" className="text-orange-400 text-sm font-semibold underline">View All Inquiries</Link>
          </div>
        </motion.div>
        {/* Optional Extras: Calendar, Charts, Notifications (future) */}
        {/* <div className="mb-10">Calendar/Charts/Notifications here</div> */}
      </div>
    </div>);
}
