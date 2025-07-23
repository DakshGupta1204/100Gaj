"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileCheck,
  Building2,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";

interface DashboardStats {
  totalUsers: number;
  pendingKYC: number;
  totalProperties: number;
  totalInvestments: number;
}

interface RecentActivity {
  id: string;
  type: "kyc" | "property" | "investment";
  status: "pending" | "approved" | "rejected";
  user: {
    name: string;
    email: string;
  };
  timestamp: string;
  details: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingKYC: 0,
    totalProperties: 0,
    totalInvestments: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, activityResponse] = await Promise.all([
          axios.get("/api/equity/admin/dashboard/stats"),
          axios.get("/api/equity/admin/dashboard/activity"),
        ]);

        setStats(statsResponse.data);
        setRecentActivity(activityResponse.data.activities);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      link: "/equity/admin/users",
    },
    {
      title: "Pending KYC",
      value: stats.pendingKYC,
      icon: FileCheck,
      color: "from-[#a78bfa] to-[#9333ea]",
      link: "/equity/admin/kyc-verification",
    },
    {
      title: "Properties Listed",
      value: stats.totalProperties,
      icon: Building2,
      color: "from-green-500 to-green-600",
      link: "/equity/admin/properties",
    },
    {
      title: "Total Investments",
      value: stats.totalInvestments,
      icon: TrendingUp,
      color: "from-amber-500 to-amber-600",
      link: "/equity/admin/investments",
    },
  ];

  const getActivityIcon = (type: string, status: string) => {
    if (status === "pending") return <AlertCircle className="w-5 h-5 text-amber-500" />;
    if (status === "approved") return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link key={stat.title} href={stat.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#14141F]/80 backdrop-blur-xl border border-[#a78bfa]/20 rounded-xl p-6 hover:border-[#a78bfa]/50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-white">
                  {loading ? "-" : stat.value}
                </span>
              </div>
              <h3 className="text-gray-400">{stat.title}</h3>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="bg-[#14141F]/80 backdrop-blur-xl border border-[#a78bfa]/20 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-400">Loading activity...</div>
          ) : (
            recentActivity.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-[#a78bfa]/10"
              >
                <div className="flex items-center space-x-4">
                  {getActivityIcon(activity.type, activity.status)}
                  <div>
                    <p className="text-white font-medium">{activity.user.name}</p>
                    <p className="text-sm text-gray-400">{activity.details}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#a78bfa]">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{activity.user.email}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 