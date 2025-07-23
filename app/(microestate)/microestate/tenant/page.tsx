"use client";

import React, { useState } from 'react';
import { Building, FileText, Mail, Plus, Home, User, CheckCircle, Inbox, Edit } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Background from '../../_components/Background';

const tenantName = 'Priya';
const propertyTypes = ['Apartment', 'Studio', 'Villa', 'House', 'Loft'];
const amenitiesList = ['Wi-Fi', 'Furnished', 'Parking', 'Balcony', 'Pet Friendly'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'priceLow', label: 'Price Low → High' },
  { value: 'popular', label: 'Popular' },
];

const allProperties = [
  { id: 1, title: 'Urban Loft', price: 18000, status: 'Available', date: '09 Jul 25', image: '/images/property4.jpg', location: 'Pune, Maharashtra', size: 650, type: 'Loft', badges: ['New', 'Verified'], amenities: ['Wi-Fi', 'Parking'], isFavorite: true },
  { id: 2, title: 'Family Home', price: 35000, status: 'Available', date: '08 Jul 25', image: '/images/property5.jpg', location: 'Gurgaon, Haryana', size: 1800, type: 'House', badges: ['Featured'], amenities: ['Furnished', 'Pet Friendly', 'Parking'], isFavorite: false },
  { id: 3, title: 'Luxury Penthouse', price: 95000, status: 'Rented', date: '05 Jul 25', image: '/images/property1.jpg', location: 'Bangalore, Karnataka', size: 3500, type: 'Apartment', badges: ['Verified'], amenities: ['Balcony', 'Wi-Fi'], isFavorite: true },
];

const myInquiries = [
  { property: 'Lakeview Apt', message: 'Is this available?', status: 'Replied', reply: 'Yes, call me at…' },
  { property: 'Sunrise Villa', message: 'Can I visit?', status: 'No response', reply: '–' },
];

export default function TenantDashboard() {
  // Filter state
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minSize, setMinSize] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [inquiryFilter, setInquiryFilter] = useState('All');
  // No hoveredProperty state

  // Filtering logic
  let filtered = allProperties.filter(p =>
    (!location || p.location === location) &&
    (!minPrice || p.price >= Number(minPrice)) &&
    (!maxPrice || p.price <= Number(maxPrice)) &&
    (!minSize || p.size >= Number(minSize)) &&
    (selectedTypes.length === 0 || selectedTypes.includes(p.type)) &&
    (selectedAmenities.length === 0 || selectedAmenities.every(a => p.amenities?.includes(a)))
  );
  if (sortBy === 'priceLow') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === 'popular') filtered = [...filtered].sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
  else filtered = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Saved/Favorite properties
  const favoriteProperties = allProperties.filter(p => p.isFavorite);

  // Inquiry filter logic
  const filteredInquiries = myInquiries.filter(i =>
    inquiryFilter === 'All' ? true :
    inquiryFilter === 'Awaiting response' ? i.status === 'No response' :
    inquiryFilter === 'Replied' ? i.status === 'Replied' : true
  );

  // Handlers
  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };
  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Background />
      <div className="container mx-auto py-10 mt-24 relative z-10">
        {/* Welcome Banner */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent text-3xl">👋</span>
            Welcome back, <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">{tenantName}</span>! Let’s help you find your next dream home. 🎯
          </h1>
          <p className="text-gray-300 mt-2">You have {favoriteProperties.length} saved listings and {myInquiries.length} ongoing inquiries.</p>
        </motion.div>
        {/* Advanced Filters + Search */}
        <motion.div
          className="bg-[#181c24] rounded-xl p-6 mb-8 flex flex-wrap gap-4 items-end shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        >
          {/* Location Dropdown */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Location</label>
            <select
              className="w-40 rounded px-3 py-2 bg-[#23232a] text-white border border-orange-500/20 focus:border-orange-500"
              value={location}
              onChange={e => setLocation(e.target.value)}
            >
              <option value="">All</option>
              {[...new Set(allProperties.map(p => p.location))].map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
          {/* Price Range */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Min Price</label>
            <input type="number" min={0} value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min" className="w-28 rounded px-3 py-2 bg-[#23232a] text-white border border-orange-500/20 focus:border-orange-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Max Price</label>
            <input type="number" min={0} value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max" className="w-28 rounded px-3 py-2 bg-[#23232a] text-white border border-orange-500/20 focus:border-orange-500" />
          </div>
          {/* Size */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Min Size (sqft)</label>
            <input type="number" min={0} value={minSize} onChange={e => setMinSize(e.target.value)} placeholder="Min sqft" className="w-32 rounded px-3 py-2 bg-[#23232a] text-white border border-orange-500/20 focus:border-orange-500" />
          </div>
          {/* Property Type */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Property Type</label>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map(type => (
                <label key={type} className={`px-3 py-1 rounded-full cursor-pointer border text-xs ${selectedTypes.includes(type) ? 'bg-orange-500 text-white border-orange-500' : 'bg-[#23232a] text-gray-300 border-orange-500/20'}`}>
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                    className="mr-1 accent-orange-500"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
          {/* Amenities */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {amenitiesList.map(am => (
                <label key={am} className={`px-3 py-1 rounded-full cursor-pointer border text-xs ${selectedAmenities.includes(am) ? 'bg-orange-500 text-white border-orange-500' : 'bg-[#23232a] text-gray-300 border-orange-500/20'}`}>
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(am)}
                    onChange={() => handleAmenityChange(am)}
                    className="mr-1 accent-orange-500"
                  />
                  {am}
                </label>
              ))}
            </div>
          </div>
          {/* Sort By */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Sort By</label>
            <select
              className="w-40 rounded px-3 py-2 bg-[#23232a] text-white border border-orange-500/20 focus:border-orange-500"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </motion.div>
        {/* Property Listings Grid */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        >
          <h2 className="text-3xl font-bold heading-gradient mb-8">Browse Properties</h2>
          <div className="section">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(prop => (
                <div
                  key={prop.id}
                  className="card-glass flex flex-col items-center border border-gray-700 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:border-orange-400"
                >
                  <div className="w-full h-32 bg-gray-900 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-2xl text-gray-400 font-bold">{prop.title}</span>
                  </div>
                  <div className="text-white font-semibold mb-1">{prop.title}</div>
                  <div className="text-orange-400 font-bold mb-1">₹{prop.price.toLocaleString()}/mo</div>
                  <div className="text-xs text-gray-400 mb-1">{prop.location} {prop.size} sqft <span className={`ml-2 px-2 py-0.5 rounded ${prop.status === 'Available' ? 'bg-green-600 text-white' : 'bg-orange-500 text-white'}`}>{prop.status}</span></div>
                  <div className="flex gap-1 mb-1">
                    {prop.badges?.map(badge => (
                      <span key={badge} className="px-2 py-0.5 text-xs rounded bg-orange-500 text-white font-bold mr-1">{badge}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {prop.amenities?.map(am => (
                      <span key={am} className="px-2 py-1 text-xs rounded bg-[#181c24] text-gray-200">{am}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="btn-orange px-4 py-2">View Details</button>
                    <button className="btn-orange px-4 py-2 bg-[#23232a] text-orange-400 border border-orange-500/30 hover:bg-orange-500 hover:text-white">Contact Landlord</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        {/* Saved/Favorite Properties */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        >
          <h2 className="text-lg font-bold text-white mb-4">Saved / Favorite Properties</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {favoriteProperties.length === 0 && <div className="text-gray-400">No favorites yet.</div>}
            {favoriteProperties.map(prop => (
              <div key={prop.id} className="min-w-[260px] bg-[#23232a] rounded-xl shadow-md p-4 flex flex-col items-center">
                <img src={prop.image} alt={prop.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                <div className="text-white font-semibold mb-1">{prop.title}</div>
                <div className="text-orange-400 font-bold mb-1">₹{prop.price.toLocaleString()}/mo</div>
                <button className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Remove from Favorites</button>
              </div>
            ))}
          </div>
        </motion.div>
        {/* Inquiries & Responses */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
        >
          <h2 className="text-lg font-bold text-white mb-4">My Inquiries & Responses</h2>
          <div className="flex gap-4 mb-2">
            {['All', 'Awaiting response', 'Replied'].map(f => (
              <button key={f} className={`px-4 py-1 rounded-full text-sm font-semibold ${inquiryFilter === f ? 'bg-orange-500 text-white' : 'bg-[#23232a] text-gray-300 border border-orange-500/20'}`} onClick={() => setInquiryFilter(f)}>{f}</button>
            ))}
          </div>
          <div className="bg-[#23232a] rounded-xl overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-gray-400 border-b border-[#181c24]">
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Message</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reply</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inq, idx) => (
                  <tr key={idx} className="border-b border-[#181c24] last:border-0">
                    <td className="py-2 px-4 text-white">{inq.property}</td>
                    <td className="py-2 px-4 text-gray-400">{inq.message}</td>
                    <td className={`py-2 px-4 font-bold ${inq.status === 'Replied' ? 'text-green-500' : 'text-red-500'}`}>{inq.status === 'Replied' ? '✅ Replied' : '❌ No response'}</td>
                    <td className="py-2 px-4 text-gray-300">{inq.reply}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        {/* Profile & Settings (Optional) */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
        >
          <h2 className="text-lg font-bold text-white mb-4">Profile & Settings</h2>
          <div className="bg-[#23232a] rounded-xl p-6 flex flex-col gap-2 text-gray-300">
            <div><span className="font-semibold text-white">Name:</span> Priya Sharma</div>
            <div><span className="font-semibold text-white">Email:</span> priya@example.com</div>
            <div><span className="font-semibold text-white">Phone:</span> +91-9876543210</div>
            <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 w-max">Logout</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 