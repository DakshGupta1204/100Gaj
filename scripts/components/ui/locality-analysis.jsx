"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaBolt, FaTint } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
export function LocalityAnalysis({ locality }) {
    const [areaData, setAreaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchAreaData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`https://ml-models-vu7b.onrender.com/api/location/${encodeURIComponent(locality)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch area data');
                }
                const data = await response.json();
                setAreaData(data);
            }
            catch (err) {
                console.error('Error fetching area data:', err);
                setError('Unable to load area analysis. Please try again later.');
            }
            finally {
                setLoading(false);
            }
        };
        if (locality) {
            fetchAreaData();
        }
    }, [locality]);
    if (loading) {
        return (<div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600">Analyzing area data...</span>
      </div>);
    }
    if (error) {
        return (<div className="flex items-center justify-center py-12 text-center">
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <FaExclamationTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2"/>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>);
    }
    if (!areaData) {
        return (<div className="text-center py-12">
        <p className="text-gray-600">No area data available for {locality}</p>
      </div>);
    }
    const getRatingColor = (rating) => {
        if (rating >= 7)
            return 'text-green-600';
        if (rating >= 5)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    const getRatingBg = (rating) => {
        if (rating >= 7)
            return 'bg-green-100';
        if (rating >= 5)
            return 'bg-yellow-100';
        return 'bg-red-100';
    };
    const getCrimeLevelColor = (level) => {
        switch (level.toLowerCase()) {
            case 'low': return 'text-green-600 bg-green-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'high': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };
    return (<div className="space-y-6">
      {/* Area Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <IoLocationOutline className="h-6 w-6 text-orange-600 mr-2"/>
            <h3 className="text-xl font-semibold text-gray-900">{areaData.location}</h3>
          </div>
          <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
            {areaData.zone}
          </span>
        </div>
      </motion.div>

      {/* Safety & Crime Analysis */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <FaShieldAlt className="h-5 w-5 text-blue-600 mr-2"/>
          <h4 className="text-lg font-semibold text-gray-900">Safety & Security</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getRatingBg(areaData.safety_rating)} mb-2`}>
              <span className={`text-2xl font-bold ${getRatingColor(areaData.safety_rating)}`}>
                {areaData.safety_rating}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-700">Safety Rating</p>
            <p className="text-xs text-gray-500">Out of 10</p>
          </div>
          
          <div className="text-center">
            <div className={`inline-flex items-center justify-center px-4 py-2 rounded-full ${getCrimeLevelColor(areaData.crime_level)} mb-2`}>
              <span className="font-medium">{areaData.crime_level}</span>
            </div>
            <p className="text-sm font-medium text-gray-700">Crime Level</p>
            <p className="text-xs text-gray-500">Rating: {areaData.crime_rating}/10</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-2">
              <span className="text-2xl font-bold text-gray-600">{areaData.total_crimes}</span>
            </div>
            <p className="text-sm font-medium text-gray-700">Total Crimes</p>
            <p className="text-xs text-gray-500">Reported incidents</p>
          </div>
        </div>
      </motion.div>

      {/* Infrastructure Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white rounded-lg p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Infrastructure Status</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <FaBolt className="h-5 w-5 text-blue-600 mr-3"/>
              <span className="font-medium text-gray-700">Electricity Issues</span>
            </div>
            <div className="flex items-center">
              {areaData.electricity_issues.toLowerCase() === 'no' ? (<FaCheckCircle className="h-5 w-5 text-green-600 mr-2"/>) : (<FaTimesCircle className="h-5 w-5 text-red-600 mr-2"/>)}
              <span className={`font-medium ${areaData.electricity_issues.toLowerCase() === 'no' ? 'text-green-600' : 'text-red-600'}`}>
                {areaData.electricity_issues}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <FaTint className="h-5 w-5 text-blue-600 mr-3"/>
              <span className="font-medium text-gray-700">Water Clogging</span>
            </div>
            <div className="flex items-center">
              {areaData.water_clogging.toLowerCase() === 'no' ? (<FaCheckCircle className="h-5 w-5 text-green-600 mr-2"/>) : (<FaTimesCircle className="h-5 w-5 text-red-600 mr-2"/>)}
              <span className={`font-medium ${areaData.water_clogging.toLowerCase() === 'no' ? 'text-green-600' : 'text-red-600'}`}>
                {areaData.water_clogging}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pros and Cons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pros */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <FaCheckCircle className="h-5 w-5 text-green-600 mr-2"/>
            <h4 className="text-lg font-semibold text-gray-900">Advantages</h4>
          </div>
          
          <div className="space-y-3">
            {areaData.pros.map((pro, index) => (<div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">{pro}</span>
              </div>))}
          </div>
        </motion.div>

        {/* Cons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <FaExclamationTriangle className="h-5 w-5 text-orange-600 mr-2"/>
            <h4 className="text-lg font-semibold text-gray-900">Challenges</h4>
          </div>
          
          <div className="space-y-3">
            {areaData.cons.map((con, index) => (<div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">{con}</span>
              </div>))}
          </div>
        </motion.div>
      </div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center mb-3">
          <FaMapMarkerAlt className="h-5 w-5 text-gray-600 mr-2"/>
          <h4 className="text-lg font-semibold text-gray-900">Area Summary</h4>
        </div>
        <p className="text-gray-700">
          {areaData.location} in {areaData.zone} has a {areaData.crime_level.toLowerCase()} crime level with a safety rating of {areaData.safety_rating}/10. 
          The area {areaData.electricity_issues.toLowerCase() === 'no' ? 'does not have' : 'has'} electricity issues and 
          {areaData.water_clogging.toLowerCase() === 'no' ? ' does not experience' : ' experiences'} water clogging during monsoons.
        </p>
      </motion.div>
    </div>);
}
