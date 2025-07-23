"use client";

import React, { useState } from 'react';
import PropertyCard from './PropertyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Background from '../../_components/Background';
import { FaHome, FaBuilding, FaWarehouse, FaHotel, FaCouch, FaWifi, FaCar, FaDog, FaCheckSquare, FaSortAmountDown, FaSortAmountUp, FaRupeeSign } from 'react-icons/fa';

const propertyTypes = [
  { label: 'Apartment', icon: <FaBuilding className="inline-block mr-1" /> },
  { label: 'Villa', icon: <FaHome className="inline-block mr-1" /> },
  { label: 'Studio', icon: <FaHotel className="inline-block mr-1" /> },
  { label: 'House', icon: <FaCouch className="inline-block mr-1" /> },
  { label: 'Loft', icon: <FaWarehouse className="inline-block mr-1" /> },
];
const amenitiesList = [
  { label: 'Wi-Fi', icon: <FaWifi className="inline-block mr-1" /> },
  { label: 'Furnished', icon: <FaCouch className="inline-block mr-1" /> },
  { label: 'Parking', icon: <FaCar className="inline-block mr-1" /> },
  { label: 'Balcony', icon: <FaBuilding className="inline-block mr-1" /> },
  { label: 'Pet Friendly', icon: <FaDog className="inline-block mr-1" /> },
];
const sortOptions = [
  { value: 'newest', label: 'Newest', icon: <FaSortAmountDown className="inline-block mr-1" /> },
  { value: 'oldest', label: 'Oldest', icon: <FaSortAmountUp className="inline-block mr-1" /> },
  { value: 'priceLow', label: 'Price (Low to High)', icon: <FaRupeeSign className="inline-block mr-1" /> },
  { value: 'priceHigh', label: 'Price (High to Low)', icon: <FaRupeeSign className="inline-block mr-1" /> },
  { value: 'size', label: 'Size', icon: <FaCheckSquare className="inline-block mr-1" /> },
];

// Mock data for demonstration
const mockProperties = [
  {
    _id: '1',
    title: 'Luxury Penthouse',
    description: 'Spacious 2BHK apartment with garden view, close to metro.',
    type: '2BHK Apartment',
    size: 950,
    location: 'Indiranagar, Bangalore',
    price: 20000,
    status: 'Available',
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    badges: ['New', 'Verified'],
    amenities: ['Furnished', 'Wi-Fi', 'Parking', 'Balcony'],
    images: ['/images/property1.jpg'],
    isFavorite: false,
    landlord: {
      name: 'Nikhil Sharma',
      avatarUrl: '',
      verified: true,
    },
    views: 123,
    inquiries: 5,
    engagementScore: 87,
  },
  {
    _id: '2',
    title: 'Modern Villa',
    description: 'Modern studio apartment, perfect for singles or students.',
    type: 'Studio',
    size: 400,
    location: 'Koramangala, Bangalore',
    price: 12000,
    status: 'Rented',
    postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    badges: ['Featured'],
    amenities: ['Wi-Fi', 'Pet Friendly'],
    images: ['/images/property2.jpg'],
    isFavorite: true,
    landlord: {
      name: 'Priya Verma',
      avatarUrl: '',
      verified: true,
    },
    views: 89,
    inquiries: 2,
    engagementScore: 65,
  },
  {
    _id: '3',
    title: 'Waterfront Condo',
    description: '5BHK luxury villa with private pool and garden.',
    type: 'Villa',
    size: 3500,
    location: 'Whitefield, Bangalore',
    price: 95000,
    status: 'Coming Soon',
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    badges: ['New', 'Featured'],
    amenities: ['Furnished', 'Parking', 'Balcony'],
    images: ['/images/property3.jpg'],
    isFavorite: false,
    landlord: {
      name: 'Amit Singh',
      avatarUrl: '',
      verified: false,
    },
    views: 45,
    inquiries: 0,
    engagementScore: 30,
  },
  {
    _id: '4',
    title: 'Urban Loft',
    description: 'Trendy 1BHK loft in the heart of the city, close to nightlife and offices.',
    type: '1BHK Loft',
    size: 650,
    location: 'MG Road, Pune',
    price: 18000,
    status: 'Available',
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    badges: ['Verified'],
    amenities: ['Wi-Fi', 'Parking'],
    images: ['/images/property4.jpg'],
    isFavorite: false,
    landlord: {
      name: 'Rohit Mehra',
      avatarUrl: '',
      verified: true,
    },
    views: 67,
    inquiries: 1,
    engagementScore: 50,
  },
  {
    _id: '5',
    title: 'Family Home',
    description: 'Spacious 3BHK home with a large backyard, perfect for families and pets.',
    type: '3BHK House',
    size: 1800,
    location: 'Sector 21, Gurgaon',
    price: 35000,
    status: 'Available',
    postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    badges: ['Featured'],
    amenities: ['Furnished', 'Pet Friendly', 'Parking'],
    images: ['/images/property5.jpg'],
    isFavorite: true,
    landlord: {
      name: 'Sunita Rao',
      avatarUrl: '',
      verified: true,
    },
    views: 150,
    inquiries: 7,
    engagementScore: 92,
  },
  {
    _id: '6',
    title: 'Student Studio',
    description: 'Affordable studio with all basic amenities, walking distance to university.',
    type: 'Studio',
    size: 320,
    location: 'North Campus, Delhi',
    price: 9000,
    status: 'Available',
    postedDate: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
    badges: ['New'],
    amenities: ['Wi-Fi'],
    images: ['/images/property6.jpg'],
    isFavorite: false,
    landlord: {
      name: 'Dr. Anil Kumar',
      avatarUrl: '',
      verified: false,
    },
    views: 33,
    inquiries: 0,
    engagementScore: 25,
  },
];

export default function PropertyListingPage() {
  const [properties] = useState(mockProperties);
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minSize, setMinSize] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');

  // Unique locations for dropdown
  const locations = Array.from(new Set(properties.map(p => p.location)));

  // Filtering logic
  let filtered = properties.filter(p =>
    (!location || p.location === location) &&
    (!minPrice || p.price >= Number(minPrice)) &&
    (!maxPrice || p.price <= Number(maxPrice)) &&
    (!minSize || p.size >= Number(minSize)) &&
    (selectedTypes.length === 0 || selectedTypes.includes(p.type.split(' ')[1] || p.type)) &&
    (selectedAmenities.length === 0 || selectedAmenities.every(a => p.amenities?.includes(a)))
  );

  // Sorting logic
  if (sortBy === 'priceHigh') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === 'size') filtered = [...filtered].sort((a, b) => b.size - a.size);
  else filtered = [...filtered].sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());

  // Handlers
  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };
  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]);
  };

  const clearAllFilters = () => {
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setMinSize('');
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setSortBy('newest');
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Background />
      <div className="container mx-auto py-10 mt-24 relative z-10">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
          Available Properties
        </h1>
        {/* Filter Bar */}
        <div className="filter-card bg-[#1e1e2f] bg-opacity-90 rounded-2xl p-6 mb-8 shadow-2xl relative backdrop-blur-md border border-orange-500/10">
          <button className="absolute top-4 right-4 text-orange-400 hover:underline text-sm font-semibold z-10" onClick={clearAllFilters}>
            Clear All
          </button>
          {/* Row 1: Main Inputs */}
          <div className="flex flex-wrap gap-6 mb-4">
            {/* Location */}
            <div className="flex flex-col gap-2 min-w-[150px] flex-1">
              <label className="text-orange-400 font-semibold">Location</label>
              <select
                className="rounded-lg px-4 py-2 bg-[#23232a] border border-orange-400 text-white focus:ring-2 focus:ring-orange-500 transition"
                value={location}
                onChange={e => setLocation(e.target.value)}
              >
                <option value="">All</option>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
            {/* Min Size */}
            <div className="flex flex-col gap-2 min-w-[120px] flex-1">
              <label className="text-orange-400 font-semibold">Min Size (sqft)</label>
              <Input type="number" min={0} value={minSize} onChange={e => setMinSize(e.target.value)} placeholder="Min sqft" className="rounded-lg px-4 py-2 bg-[#23232a] border border-orange-400 text-white focus:ring-2 focus:ring-orange-500 transition" />
            </div>
            {/* Min Price */}
            <div className="flex flex-col gap-2 min-w-[120px] flex-1">
              <label className="text-orange-400 font-semibold">Min Price</label>
              <Input type="number" min={0} value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min" className="rounded-lg px-4 py-2 bg-[#23232a] border border-orange-400 text-white focus:ring-2 focus:ring-orange-500 transition" />
            </div>
            {/* Max Price */}
            <div className="flex flex-col gap-2 min-w-[120px] flex-1">
              <label className="text-orange-400 font-semibold">Max Price</label>
              <Input type="number" min={0} value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max" className="rounded-lg px-4 py-2 bg-[#23232a] border border-orange-400 text-white focus:ring-2 focus:ring-orange-500 transition" />
            </div>
            {/* Sort By */}
            <div className="flex flex-col gap-2 min-w-[170px] flex-1">
              <label className="text-orange-400 font-semibold">Sort By</label>
              <select
                className="rounded-lg px-4 py-2 bg-[#23232a] border border-orange-400 text-white focus:ring-2 focus:ring-orange-500 transition"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Row 2: Property Type */}
          <div className="flex flex-col gap-2 mb-4 w-full">
            <label className="text-orange-400 font-semibold">Property Type</label>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map(type => (
                <button
                  key={type.label}
                  className={`pill flex items-center gap-1 px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 ${selectedTypes.includes(type.label) ? 'bg-orange-500 text-white border-orange-500 shadow-lg' : 'bg-[#2c2c3e] text-white border-[#444] hover:bg-orange-400/30'}`}
                  onClick={() => handleTypeChange(type.label)}
                  type="button"
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
          </div>
          {/* Row 3: Amenities */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-orange-400 font-semibold">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {amenitiesList.map(am => (
                <button
                  key={am.label}
                  className={`pill flex items-center gap-1 px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 ${selectedAmenities.includes(am.label) ? 'bg-orange-500 text-white border-orange-500 shadow-lg' : 'bg-[#2c2c3e] text-white border-[#444] hover:bg-orange-400/30'}`}
                  onClick={() => handleAmenityChange(am.label)}
                  type="button"
                >
                  {am.icon} {am.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Property Listings Grid */}
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 