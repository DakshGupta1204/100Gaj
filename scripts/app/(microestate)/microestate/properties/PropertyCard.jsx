"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, CheckCircle, Star, Zap, MapPin, UserCircle, Calendar, Tag, Ruler, Eye, Mail, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
const badgeColors = {
    New: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white',
    Verified: 'bg-green-600 text-white',
    Featured: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
};
const amenityIcons = {
    Furnished: <Star className="w-4 h-4"/>,
    'Wi-Fi': <Zap className="w-4 h-4"/>,
    'Pet Friendly': <Heart className="w-4 h-4"/>,
    Balcony: <CheckCircle className="w-4 h-4"/>,
    Parking: <CheckCircle className="w-4 h-4"/>,
};
function formatRelativeDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0)
        return 'Listed today';
    if (diff === 1)
        return 'Listed 1 day ago';
    return `Listed ${diff} days ago`;
}
export default function PropertyCard({ property, onFavorite, onContact, onViewDetails }) {
    var _a, _b, _c, _d, _e;
    return (<motion.div whileHover={{ y: -8, boxShadow: '0 8px 32px 0 rgba(255, 140, 0, 0.25)' }} className="relative bg-[#23232a]/80 border border-orange-500/10 rounded-2xl shadow-lg overflow-hidden backdrop-blur-md transition-all duration-300 group flex flex-col">
      {/* Cover Image */}
      <div className="relative h-48 w-full bg-gradient-to-br from-orange-900/30 to-black flex items-center justify-center">
        <img src={((_a = property.images) === null || _a === void 0 ? void 0 : _a[0]) || '/images/property1.jpg'} alt={property.title} className="object-cover w-full h-full"/>
        <div className="absolute top-3 left-3 flex gap-2">
          {(_b = property.badges) === null || _b === void 0 ? void 0 : _b.map(badge => (<span key={badge} className={`px-3 py-1 text-xs font-bold rounded-full shadow ${badgeColors[badge]}`}>{badge}</span>))}
        </div>
        <button className={`absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-orange-500 transition-colors ${property.isFavorite ? 'text-orange-400' : 'text-white'}`} onClick={() => onFavorite && onFavorite(property._id)} aria-label="Save to favorites">
          <Heart fill={property.isFavorite ? '#fb923c' : 'none'} className="w-5 h-5"/>
        </button>
      </div>
      {/* Card Content */}
      <div className="flex-1 flex flex-col p-5 gap-2">
        <div className="flex items-center gap-2 mb-1">
          <Tag className="w-4 h-4 text-orange-400"/>
          <span className="text-sm text-orange-400 font-semibold">{property.type}</span>
          <Ruler className="w-4 h-4 text-gray-400 ml-2"/>
          <span className="text-xs text-gray-400">{property.size} sqft</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-1 truncate">{property.title}</h2>
        <p className="text-gray-300 text-sm line-clamp-2 mb-2">{property.description}</p>
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-gray-400"/>
          <span className="text-gray-400 text-xs">{property.location}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-[#181c24] text-orange-400 ml-auto">{property.status}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {(_c = property.amenities) === null || _c === void 0 ? void 0 : _c.map(am => (<span key={am} className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-[#181c24] text-gray-200">
              {amenityIcons[am] || null}{am}
            </span>))}
        </div>
        <div className="flex items-center justify-between mt-auto mb-2">
          <span className="text-lg font-bold text-orange-400">₹{property.price}/mo</span>
          <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-4 h-4"/>{formatRelativeDate(property.postedDate)}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <UserCircle className="w-5 h-5 text-gray-300"/>
          <span className="text-sm text-white font-medium">{((_d = property.landlord) === null || _d === void 0 ? void 0 : _d.name) || 'Landlord'}</span>
          {((_e = property.landlord) === null || _e === void 0 ? void 0 : _e.verified) && (<span className="ml-1 px-2 py-0.5 text-xs rounded bg-green-600 text-white flex items-center gap-1"><CheckCircle className="w-3 h-3"/>Verified</span>)}
        </div>
        <div className="flex gap-2 mt-2">
          <Button className="flex-1 bg-gradient-to-r from-orange-600 to-red-500 text-white" onClick={() => onViewDetails && onViewDetails(property._id)}>View Details</Button>
          <Button className="flex-1 bg-[#23232a] border border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white" onClick={() => onContact && onContact(property._id)}>Contact</Button>
        </div>
      </div>
      {/* Analytics */}
      <div className="flex items-center gap-x-6 mt-6 mb-2 px-4 text-xs text-gray-400">
        <span className="flex items-center gap-1"><Eye className="w-4 h-4"/>{property.views || 0} views</span>
        <span className="flex items-center gap-1"><Mail className="w-4 h-4"/>{property.inquiries || 0} inquiries</span>
        <span className="flex items-center gap-1">
          <Flame className={`w-4 h-4 ${property.engagementScore && property.engagementScore > 70 ? 'text-orange-500' : 'text-gray-400'}`}/>
          {property.engagementScore || 0}
          <span className="ml-1">Engagement</span>
        </span>
      </div>
    </motion.div>);
}
