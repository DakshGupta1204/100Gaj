"use client";
import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { TrendingUp, BarChart3, DollarSign, Calendar, Target, Activity, TrendingDown, Brain } from "lucide-react";
export default function PerformanceChart() {
    const [selectedPeriod, setSelectedPeriod] = useState("6M");
    const [selectedMetric, setSelectedMetric] = useState("value");
    const [hoveredBar, setHoveredBar] = useState(null);
    const chartRef = useRef(null);
    // Mouse tracking for interactive gradient
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const mouseXSpring = useSpring(mouseX);
    const mouseYSpring = useSpring(mouseY);
    const handleMouseMove = (e) => {
        if (!chartRef.current)
            return;
        const rect = chartRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };
    const periods = [
        { value: "1M", label: "1 Month" },
        { value: "3M", label: "3 Months" },
        { value: "6M", label: "6 Months" },
        { value: "1Y", label: "1 Year" },
        { value: "ALL", label: "All Time" }
    ];
    const metrics = [
        { value: "value", label: "Portfolio Value", icon: DollarSign, color: "text-green-400" },
        { value: "returns", label: "Returns", icon: TrendingUp, color: "text-blue-400" },
        { value: "income", label: "Monthly Income", icon: Calendar, color: "text-orange-400" }
    ];
    // Mock performance data
    const performanceData = [
        { month: "Jan", portfolioValue: 850000, investment: 800000, returns: 50000, monthlyIncome: 22000 },
        { month: "Feb", portfolioValue: 890000, investment: 850000, returns: 40000, monthlyIncome: 24000 },
        { month: "Mar", portfolioValue: 925000, investment: 880000, returns: 45000, monthlyIncome: 25500 },
        { month: "Apr", portfolioValue: 980000, investment: 920000, returns: 60000, monthlyIncome: 27000 },
        { month: "May", portfolioValue: 1120000, investment: 950000, returns: 170000, monthlyIncome: 28500 },
        { month: "Jun", portfolioValue: 1250000, investment: 950000, returns: 300000, monthlyIncome: 28500 }
    ];
    const currentData = performanceData[performanceData.length - 1];
    const previousData = performanceData[performanceData.length - 2];
    const getMetricValue = (data, metric) => {
        switch (metric) {
            case "value": return data.portfolioValue;
            case "returns": return data.returns;
            case "income": return data.monthlyIncome;
            default: return data.portfolioValue;
        }
    };
    const currentValue = getMetricValue(currentData, selectedMetric);
    const previousValue = getMetricValue(previousData, selectedMetric);
    const changePercent = ((currentValue - previousValue) / previousValue * 100).toFixed(1);
    const isPositive = currentValue > previousValue;
    const maxValue = Math.max(...performanceData.map(d => getMetricValue(d, selectedMetric)));
    const minValue = Math.min(...performanceData.map(d => getMetricValue(d, selectedMetric)));
    return (<motion.div ref={chartRef} className="relative bg-black rounded-3xl border-2 border-[#23232a] p-8 overflow-hidden group" onMouseMove={handleMouseMove} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} whileHover={{ scale: 1.01 }}>
      {/* Enhanced Header */}
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-3 mb-3">
            <motion.div className="w-12 h-12 rounded-2xl bg-[#23232a] flex items-center justify-center shadow-lg border-2 border-[#23232a]" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Activity className="w-6 h-6 text-[#d1ff4a]"/>
            </motion.div>
            <div>
              <h2 className="text-3xl font-extrabold text-white">Performance Analytics</h2>
              <p className="text-gray-400">Track your investment growth and returns</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div className="flex flex-wrap gap-2 mt-4 lg:mt-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          {periods.map((period, index) => (<motion.button key={period.value} onClick={() => setSelectedPeriod(period.value)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${selectedPeriod === period.value
                ? "bg-[#23232a] text-[#a78bfa] border-2 border-[#a78bfa] shadow-lg"
                : "bg-[#18181b] text-gray-400 hover:text-[#a78bfa] border border-[#23232a]"}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + index * 0.1 }}>
              {period.label}
            </motion.button>))}
        </motion.div>
      </div>

      {/* Enhanced Metric Selection */}
      <motion.div className="flex flex-wrap gap-3 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        {metrics.map((metric, index) => (<motion.button key={metric.value} onClick={() => setSelectedMetric(metric.value)} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 border ${selectedMetric === metric.value
                ? "bg-[#23232a] text-[#a78bfa] border-2 border-[#a78bfa] shadow-lg"
                : "bg-[#18181b] text-gray-400 hover:text-[#a78bfa] border border-[#23232a]"}`} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + index * 0.1 }}>
            <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}>
              <metric.icon className="w-4 h-4 text-[#d1ff4a]"/>
            </motion.div>
            {metric.label}
          </motion.button>))}
      </motion.div>

      {/* Enhanced Current Value & Change */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div whileHover={{ scale: 1.04, boxShadow: '0 0 32px 0 #B6FF3F55' }} transition={{ type: 'spring', stiffness: 300 }} className="relative bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-[#B6FF3F] shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400 font-medium">Current Value</span>
              <div className={`flex items-center gap-1 text-xs px-3 py-1 rounded-xl backdrop-blur-sm border ${isPositive
            ? "bg-black/40 text-[#d1ff4a] border-[#d1ff4a]"
            : "bg-black/40 text-[#ff4a4a] border-[#ff4a4a]"}`}>
                {isPositive ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                {isPositive ? "+" : ""}{changePercent}%
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#d1ff4a]">
              ₹{currentValue.toLocaleString()}
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.04, boxShadow: '0 0 32px 0 #a78bfa55' }} transition={{ type: 'spring', stiffness: 300 }} className="relative bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-[#a78bfa] shadow-lg">
          <div className="text-sm text-gray-400 mb-3 font-medium">Monthly Change</div>
          <div className="text-3xl font-extrabold text-[#a78bfa]">
            {isPositive ? "+" : ""}₹{Math.abs(currentValue - previousValue).toLocaleString()}
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.04, boxShadow: '0 0 32px 0 #B6FF3F55' }} transition={{ type: 'spring', stiffness: 300 }} className="relative bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-[#B6FF3F] shadow-lg">
          <div className="text-sm text-gray-400 mb-3 font-medium">Average Growth</div>
          <div className="text-3xl font-bold" style={{ color: '#B6FF3F' }}>
            +{((currentValue - performanceData[0].portfolioValue) / performanceData[0].portfolioValue * 100 / performanceData.length).toFixed(1)}%
          </div>
        </motion.div>
      </div>

      {/* Enhanced Chart Area with Proper Bar Chart */}
      <motion.div className="relative bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20 overflow-hidden mb-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} whileHover={{ scale: 1.01 }}>
        {/* Chart background effect */}
        <motion.div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"/>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <motion.div className="text-lg font-semibold text-white flex items-center gap-2" whileHover={{ scale: 1.02 }}>
              <BarChart3 className="w-5 h-5 text-lime-400"/>
              Performance Chart - {selectedPeriod}
            </motion.div>
            <div className="text-sm text-gray-400">
              Hover over bars for details
            </div>
          </div>
          
          {/* Bar Chart Container */}
          <div className="relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-gray-500 pr-4">
              <span>₹{(maxValue / 100000).toFixed(0)}L</span>
              <span>₹{((maxValue + minValue) / 200000).toFixed(0)}L</span>
              <span>₹{(minValue / 100000).toFixed(0)}L</span>
            </div>

            {/* Chart area */}
            <div className="ml-12 h-64 flex items-end justify-between gap-3">
              {performanceData.map((data, index) => {
            var _a;
            const value = getMetricValue(data, selectedMetric);
            const heightPercentage = ((value - minValue) / (maxValue - minValue)) * 100;
            const barHeight = Math.max(heightPercentage * 2.4, 8); // Convert to pixels, minimum 8px
            const isHovered = hoveredBar === index;
            return (<motion.div key={`${data.month}-${selectedMetric}`} className="flex flex-col items-center gap-3 flex-1 relative group/bar" onMouseEnter={() => setHoveredBar(index)} onMouseLeave={() => setHoveredBar(null)}>
                    {/* Hover tooltip */}
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 10,
                    scale: isHovered ? 1 : 0.8
                }} className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-md rounded-lg p-3 border border-lime-400/30 z-20 whitespace-nowrap">
                      <div className="text-xs text-lime-400 font-medium">{data.month}</div>
                      <div className="text-sm text-white font-bold">
                        ₹{value.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-300">
                        {(_a = metrics.find(m => m.value === selectedMetric)) === null || _a === void 0 ? void 0 : _a.label}
                      </div>
                    </motion.div>

                    {/* Value label on hover */}
                    <motion.div className="text-xs text-gray-400 font-medium h-4" animate={{ opacity: isHovered ? 1 : 0 }}>
                      {isHovered && `₹${(value / 1000).toFixed(0)}k`}
                    </motion.div>
                    
                    {/* Bar */}
                    <motion.div className="relative w-full max-w-16 rounded-t-xl overflow-hidden bg-gradient-to-t from-lime-400 to-lime-500 cursor-pointer" initial={{ height: 0 }} animate={{ height: barHeight }} transition={{
                    delay: index * 0.15,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                }} style={{ minHeight: "8px" }}>
                      {/* Animated shine effect */}
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" animate={{ x: ["-100%", "100%"] }} transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                    repeatDelay: 3
                }}/>
                      
                      {/* Pulsing effect for hovered bar */}
                      {isHovered && (<motion.div className="absolute inset-0 bg-white/20" animate={{ opacity: [0, 0.4, 0] }} transition={{ duration: 1, repeat: Infinity }}/>)}

                      {/* Inner glow effect */}
                      <motion.div className="absolute inset-0 bg-gradient-to-t from-lime-400/20 to-lime-500/20" animate={{
                    opacity: isHovered ? [0.3, 0.6, 0.3] : 0.3
                }} transition={{ duration: 2, repeat: Infinity }}/>
                    </motion.div>
                    
                    {/* Month label */}
                    <motion.div className="text-xs text-gray-400 font-medium mt-2" whileHover={{ scale: 1.1, color: "#fff" }}>
                      {data.month}
                    </motion.div>
                  </motion.div>);
        })}
            </div>

            {/* X-axis line */}
            <motion.div className="ml-12 h-px bg-gradient-to-r from-gray-600 to-gray-700 mt-2" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.5, duration: 0.8 }}/>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div className="relative bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 cursor-pointer group" whileHover={{
            scale: 1.02,
            boxShadow: "0 0 30px rgba(132, 204, 22, 0.3)",
            borderColor: "rgb(132, 204, 22)"
        }} transition={{ duration: 0.3 }}>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <motion.div whileHover={{ rotate: 5, scale: 1.1 }} transition={{ duration: 0.2 }}>
                <TrendingUp className="w-5 h-5 text-green-400 group-hover:text-lime-400 transition-colors duration-300"/>
              </motion.div>
              <span className="text-sm font-medium text-green-400 group-hover:text-lime-400 transition-colors duration-300">Best Performing Month</span>
            </div>
            <div className="text-white font-semibold text-lg group-hover:text-lime-100 transition-colors duration-300">May 2024</div>
            <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">+15.2% portfolio growth</div>
          </div>
          {/* Hover glow effect */}
          <motion.div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}/>
        </motion.div>

        <motion.div className="relative bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 cursor-pointer group" whileHover={{
            scale: 1.02,
            boxShadow: "0 0 30px rgba(132, 204, 22, 0.3)",
            borderColor: "rgb(132, 204, 22)"
        }} transition={{ duration: 0.3 }}>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <motion.div whileHover={{ rotate: -5, scale: 1.1 }} transition={{ duration: 0.2 }}>
                <Target className="w-5 h-5 text-green-400 group-hover:text-lime-400 transition-colors duration-300"/>
              </motion.div>
              <span className="text-sm font-medium text-green-400 group-hover:text-lime-400 transition-colors duration-300">Growth Prediction</span>
            </div>
            <div className="text-white font-semibold text-lg group-hover:text-lime-100 transition-colors duration-300">Next 6 Months</div>
            <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Projected +18.5% growth</div>
          </div>
          {/* Hover glow effect */}
          <motion.div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}/>
        </motion.div>
      </div>

      {/* Enhanced AI Insights */}
      <motion.div className="relative bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20 cursor-pointer group" whileHover={{
            scale: 1.01,
            boxShadow: "0 0 30px rgba(147, 51, 234, 0.3)",
            borderColor: "rgb(147, 51, 234)"
        }} transition={{ duration: 0.3 }}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ duration: 0.2 }}>
              <Brain className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300"/>
            </motion.div>
            <span className="text-lg font-semibold text-purple-400 group-hover:text-purple-300 transition-colors duration-300">AI Performance Insights</span>
          </div>
          
          <div className="text-white text-sm mb-3 leading-relaxed group-hover:text-gray-100 transition-colors duration-300">
            Your portfolio is performing 23% better than market average. Consider diversifying into data centers for higher yields.
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
            <BarChart3 className="w-4 h-4"/>
            Based on market analysis and your risk profile
          </div>
        </div>
        {/* Hover glow effect */}
        <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}/>
      </motion.div>
    </motion.div>);
}
