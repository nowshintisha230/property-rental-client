// src/app/(protected)/tenant/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Avatar, Chip, Button } from "@heroui/react";
import {
  TbCalendarEvent,
  TbHeart,
  TbUser,
  TbArrowRight,
  TbHome,
  TbClock,
  TbCheck,
  TbX,
} from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";
import { StatsCardSkeleton } from "@/components/ui/SkeletonCard";

export default function TenantHomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, favoritesRes] = await Promise.all([
          axiosInstance.get("/bookings/tenant?page=1&limit=3"),
          axiosInstance.get("/favorites?page=1&limit=1"),
        ]);

        const bookings = bookingsRes.data.data.bookings || [];
        const favTotal = favoritesRes.data.data.pagination?.total || 0;

        setRecentBookings(bookings);
        setStats({
          totalBookings: bookingsRes.data.data.pagination?.total || 0,
          totalFavorites: favTotal,
          pendingBookings: bookings.filter((b) => b.status === "pending")
            .length,
          approvedBookings: bookings.filter((b) => b.status === "approved")
            .length,
        });
      } catch {
        setStats({
          totalBookings: 0,
          totalFavorites: 0,
          pendingBookings: 0,
          approvedBookings: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      label: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      icon: TbCalendarEvent,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      href: "/tenant/bookings",
    },
    {
      label: "Saved Properties",
      value: stats?.totalFavorites ?? 0,
      icon: TbHeart,
      color: "text-red-500 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20",
      href: "/tenant/favorites",
    },
    {
      label: "Pending Bookings",
      value: stats?.pendingBookings ?? 0,
      icon: TbClock,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      href: "/tenant/bookings",
    },
    {
      label: "Approved Bookings",
      value: stats?.approvedBookings ?? 0,
      icon: TbCheck,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
      href: "/tenant/bookings",
    },
  ];

  return (
    <div className="page-transition">
      {/* Header */}
      <div className="page-header mb-8">
        <div className="flex items-center gap-4">
          <Avatar
            src={user?.photo}
            name={user?.name}
            size="lg"
            isBordered
            color="primary"
          />
          <div>
            <h1 className="page-title">
              Welcome back, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="page-description">
              Here is a summary of your activity on RentEasy.
            </p>
          </div>
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
                    <p className="text-xs text-blue-500 mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">
                      View all
                      <TbArrowRight className="w-3 h-3" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>

      {/* Recent Bookings */}
      <div className="card-base p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-heading">
            Recent Bookings
          </h2>
          <Button
            as={Link}
            href="/tenant/bookings"
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="skeleton w-14 h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="text-center py-8">
            <TbCalendarEvent className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No bookings yet
            </p>
            <Button
              as={Link}
              href="/properties"
              size="sm"
              className="mt-3 btn-gradient text-white font-semibold"
            >
              Browse Properties
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {booking.propertySnapshot?.image ? (
                  <img
                    src={booking.propertySnapshot.image}
                    alt={booking.propertySnapshot.title}
                    className="w-14 h-12 object-cover rounded-xl flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex-shrink-0 flex items-center justify-center">
                    <TbHome className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {booking.propertySnapshot?.title ||
                      booking.propertyId?.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Move-in: {formatDate(booking.moveInDate)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={getStatusBadgeClass(booking.status)}>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            href: "/properties",
            icon: TbHome,
            title: "Browse Properties",
            description: "Find your next home",
            color: "from-blue-500 to-cyan-500",
          },
          {
            href: "/tenant/favorites",
            icon: TbHeart,
            title: "My Favorites",
            description: "View saved properties",
            color: "from-red-500 to-pink-500",
          },
          {
            href: "/tenant/profile",
            icon: TbUser,
            title: "My Profile",
            description: "Manage your account",
            color: "from-purple-500 to-pink-500",
          },
        ].map((item, i) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <Link
              href={item.href}
              className="card-base p-5 flex items-center gap-4 hover:shadow-card-hover transition-all duration-300 group block"
            >
              <div
                className={`p-3 rounded-2xl bg-gradient-to-br ${item.color} flex-shrink-0`}
              >
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
              <TbArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}