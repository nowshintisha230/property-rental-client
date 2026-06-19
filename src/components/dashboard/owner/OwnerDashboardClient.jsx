// src/components/dashboard/owner/OwnerDashboardClient.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import {
  TbCurrencyDollar,
  TbBuildingSkyscraper,
  TbCalendarEvent,
  TbClock,
  TbArrowRight,
  TbPlus,
  TbList,
  TbClipboardList,
  TbTrendingUp,
  TbDownload,
} from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatsCardSkeleton } from "@/components/ui/SkeletonCard";
import EarningsChart from "./EarningsChart";
import { generateEarningsPDF } from "@/lib/pdf";
import toast from "react-hot-toast";

export default function OwnerDashboardClient() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [analyticsRes, chartRes, bookingsRes, txRes] =
          await Promise.all([
            axiosInstance.get("/analytics/owner"),
            axiosInstance.get("/analytics/owner/chart"),
            axiosInstance.get("/bookings/owner?page=1&limit=5"),
            axiosInstance.get("/transactions/owner?page=1&limit=10"),
          ]);

        setStats(analyticsRes.data.data);
        setChartData(chartRes.data.data.chartData || []);
        setRecentBookings(bookingsRes.data.data.bookings || []);
        setTransactions(txRes.data.data.transactions || []);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
        setChartLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      await generateEarningsPDF(
        transactions,
        user?.name,
        "Last 12 Months"
      );
      toast.success("Earnings report downloaded!");
    } catch {
      toast.error("Failed to generate PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Earnings",
      value: formatCurrency(stats?.totalEarnings ?? 0),
      icon: TbCurrencyDollar,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
      gradient: "from-green-500 to-emerald-500",
      change: "+12%",
    },
    {
      label: "Total Properties",
      value: stats?.totalProperties ?? 0,
      icon: TbBuildingSkyscraper,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      gradient: "from-blue-500 to-cyan-500",
      change: "+2",
    },
    {
      label: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      icon: TbCalendarEvent,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      gradient: "from-purple-500 to-pink-500",
      change: "+8%",
    },
    {
      label: "Pending Requests",
      value: stats?.pendingBookings ?? 0,
      icon: TbClock,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/20",
      gradient: "from-orange-500 to-yellow-500",
      change: "Action needed",
    },
  ];

  return (
    <div className="page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">
            Owner Dashboard
          </h1>
          <p className="page-description">
            Welcome back, {user?.name?.split(" ")[0]}! Here is your
            property performance overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            as={Link}
            href="/owner/add-property"
            size="sm"
            startContent={<TbPlus className="w-4 h-4" />}
            className="font-semibold btn-gradient text-white"
          >
            Add Property
          </Button>
          <Button
            size="sm"
            variant="bordered"
            startContent={<TbDownload className="w-4 h-4" />}
            isLoading={pdfLoading}
            onPress={handleDownloadPDF}
            className="font-semibold"
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))
          : statCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-base p-5 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {card.label}
                  </p>
                  <div className={`p-2.5 rounded-xl ${card.bg}`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
                  {card.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TbTrendingUp className="w-3.5 h-3.5 text-green-500" />
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {card.change}
                  </p>
                </div>
              </motion.div>
            ))}
      </div>

      {/* Earnings Chart */}
      <div className="card-base p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-heading">
              Monthly Earnings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Revenue trend over the last 12 months
            </p>
          </div>
          <Button
            as={Link}
            href="/owner/booking-requests"
            variant="light"
            size="sm"
            endContent={<TbArrowRight className="w-4 h-4" />}
            className="text-blue-500 font-medium"
          >
            View Bookings
          </Button>
        </div>
        <EarningsChart data={chartData} loading={chartLoading} />
      </div>

      {/* Bottom grid: recent bookings + quick links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Booking Requests */}
        <div className="lg:col-span-2 card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white font-heading">
              Recent Booking Requests
            </h2>
            <Button
              as={Link}
              href="/owner/booking-requests"
              variant="light"
              size="sm"
              endContent={<TbArrowRight className="w-4 h-4" />}
              className="text-blue-500 font-medium text-xs"
            >
              View All
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="skeleton w-12 h-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                  </div>
                  <div className="skeleton h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <TbCalendarEvent className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No booking requests yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {/* Tenant avatar */}
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {booking.tenantSnapshot?.name?.[0] ||
                        booking.tenantId?.name?.[0] ||
                        "T"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {booking.tenantSnapshot?.name ||
                        booking.tenantId?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {booking.propertySnapshot?.title ||
                        booking.propertyId?.title}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        booking.status === "approved"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : booking.status === "rejected"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(booking.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white font-heading">
            Quick Actions
          </h2>
          {[
            {
              href: "/owner/add-property",
              icon: TbPlus,
              title: "Add New Property",
              description: "List a new rental",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              href: "/owner/my-properties",
              icon: TbList,
              title: "My Properties",
              description: "Manage your listings",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              href: "/owner/booking-requests",
              icon: TbClipboardList,
              title: "Booking Requests",
              description: "Approve or reject",
              gradient: "from-orange-500 to-yellow-500",
            },
          ].map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Link
                href={item.href}
                className="card-base p-4 flex items-center gap-3 hover:shadow-card-hover transition-all duration-300 group block"
              >
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${item.gradient} flex-shrink-0`}
                >
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
                <TbArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}