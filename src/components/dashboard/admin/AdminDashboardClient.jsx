// src/components/dashboard/admin/AdminDashboardClient.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Avatar } from "@heroui/react";
import {
  TbUsers,
  TbBuildingSkyscraper,
  TbCalendarEvent,
  TbCurrencyDollar,
  TbClock,
  TbCheck,
  TbArrowRight,
  TbShieldCheck,
  TbReceipt,
  TbTrendingUp,
} from "react-icons/tb";
import axiosInstance from "@/lib/axios";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatsCardSkeleton } from "@/components/ui/SkeletonCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/contexts/ThemeContext";

export default function AdminDashboardClient() {
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/analytics/admin")
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: TbUsers,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      href: "/admin/users",
    },
    {
      label: "Total Properties",
      value: stats?.totalProperties ?? 0,
      icon: TbBuildingSkyscraper,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      href: "/admin/properties",
    },
    {
      label: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      icon: TbCalendarEvent,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
      href: "/admin/bookings",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: TbCurrencyDollar,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/20",
      href: "/admin/transactions",
    },
    {
      label: "Pending Properties",
      value: stats?.pendingProperties ?? 0,
      icon: TbClock,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      href: "/admin/properties",
    },
    {
      label: "Approved Properties",
      value: stats?.approvedProperties ?? 0,
      icon: TbCheck,
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-50 dark:bg-teal-900/20",
      href: "/admin/properties",
    },
  ];

  const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const textColor = isDark ? "#9ca3af" : "#6b7280";

  const locationChartData = (stats?.topLocations || []).map((loc) => ({
    location: loc.location?.split(",")[0] || loc.location,
    properties: loc.count,
    avgPrice: Math.round(loc.avgPrice / 100) * 100,
  }));

  return (
    <div className="page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-description">
            Platform-wide overview and management controls
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
            <TbShieldCheck className="w-4 h-4 text-green-500" />
            <span className="text-xs font-semibold text-green-700 dark:text-green-400">
              Admin Access
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))
          : statCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={card.href} className="block group">
                  <div className="card-base p-5 hover:shadow-card-hover transition-all duration-300 h-full">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {card.label}
                      </p>
                      <div className={`p-2 rounded-xl ${card.bg}`}>
                        <card.icon className={`w-4 h-4 ${card.color}`} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
                      {card.value}
                    </p>
                    <p className="text-xs text-blue-500 mt-1.5 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Manage
                      <TbArrowRight className="w-3 h-3" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>

      {/* Charts + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Top Locations Chart */}
        <div className="lg:col-span-2 card-base p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white font-heading mb-5">
            Top Locations by Properties
          </h2>
          {loading ? (
            <div className="h-56 skeleton rounded-xl" />
          ) : locationChartData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-gray-400 text-sm">
              No location data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={locationChartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="barGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop
                      offset="100%"
                      stopColor="#8b5cf6"
                      stopOpacity={0.8}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                  vertical={false}
                />
                <XAxis
                  dataKey="location"
                  tick={{ fill: textColor, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: textColor, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: isDark ? "#1f2937" : "#fff",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="properties"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  name="Properties"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card-base p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white font-heading mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2.5">
            {[
              {
                href: "/admin/users",
                icon: TbUsers,
                label: "Manage Users",
                desc: "Change roles, deactivate",
                color: "from-blue-500 to-cyan-500",
              },
              {
                href: "/admin/properties",
                icon: TbBuildingSkyscraper,
                label: "Review Properties",
                desc: "Approve or reject listings",
                color: "from-purple-500 to-pink-500",
              },
              {
                href: "/admin/bookings",
                icon: TbCalendarEvent,
                label: "Monitor Bookings",
                desc: "View all platform bookings",
                color: "from-green-500 to-emerald-500",
              },
              {
                href: "/admin/transactions",
                icon: TbReceipt,
                label: "Transactions",
                desc: "Financial overview",
                color: "from-orange-500 to-yellow-500",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
              >
                <div
                  className={`p-2 rounded-xl bg-gradient-to-br ${item.color} flex-shrink-0`}
                >
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {item.desc}
                  </p>
                </div>
                <TbArrowRight className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card-base p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white font-heading">
            Recent Transactions
          </h2>
          <Button
            as={Link}
            href="/admin/transactions"
            variant="light"
            size="sm"
            endContent={<TbArrowRight className="w-4 h-4" />}
            className="text-blue-500 font-medium"
          >
            View All
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="skeleton w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton h-3.5 w-1/2 rounded" />
                  <div className="skeleton h-3 w-1/3 rounded" />
                </div>
                <div className="skeleton h-4 w-16 rounded" />
              </div>
            ))}
          </div>
        ) : !stats?.recentTransactions?.length ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
            No transactions yet
          </p>
        ) : (
          <div className="space-y-3">
            {stats.recentTransactions.map((tx, i) => (
              <motion.div
                key={tx._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <Avatar
                  src={tx.tenantId?.photo}
                  name={tx.tenantSnapshot?.name || tx.tenantId?.name}
                  size="sm"
                  isBordered
                  color="primary"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {tx.tenantSnapshot?.name || tx.tenantId?.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {tx.propertySnapshot?.title || tx.propertyId?.title}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(tx.amount)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(tx.createdAt)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}