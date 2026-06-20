// src/components/home/RentalStatistics.jsx
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  TbBuildingSkyscraper,
  TbUsers,
  TbCalendarCheck,
  TbMapPin,
} from "react-icons/tb";
import axiosInstance from "@/lib/axios";

function AnimatedNumber({ value, prefix = "", suffix = "" }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      ease: "easeOut",
    });
    const unsub = rounded.on("change", setDisplay);
    return () => {
      controls.stop();
      unsub();
    };
  }, [value]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default function RentalStatistics() {
  const [stats, setStats] = useState({
    totalProperties: 500,
    totalUsers: 12000,
    totalBookings: 3200,
    topLocations: [],
  });
  const [inView, setInView] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/analytics/homepage")
      .then((res) => {
        const data = res.data.data;
        setStats({
          totalProperties: data.totalProperties || 500,
          totalUsers: data.totalUsers || 12000,
          totalBookings: data.totalBookings || 3200,
          topLocations: data.topLocations || [],
        });
      })
      .catch(() => {});
  }, []);

  const statItems = [
    {
      icon: TbBuildingSkyscraper,
      value: stats.totalProperties,
      label: "Active Properties",
      suffix: "+",
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: TbUsers,
      value: stats.totalUsers,
      label: "Registered Users",
      suffix: "+",
      gradient: "from-purple-500 to-pink-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: TbCalendarCheck,
      value: stats.totalBookings,
      label: "Successful Bookings",
      suffix: "+",
      gradient: "from-green-500 to-emerald-500",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: TbMapPin,
      value: stats.topLocations?.length || 50,
      label: "Cities Covered",
      suffix: "+",
      gradient: "from-orange-500 to-yellow-500",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  return (
    <section className="section-padding bg-white dark:bg-gray-950 overflow-hidden">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onViewportEnter={() => setInView(true)}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3 uppercase tracking-wider">
            Our Numbers
          </span>
          <h2 className="section-title">
            Platform{" "}
            <span className="gradient-text">Statistics</span>
          </h2>
          <p className="section-subtitle">
            Trusted by thousands of tenants and property owners across the
            country.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card-base p-6 text-center group hover:shadow-card-hover transition-all duration-300"
            >
              <div
                className={`inline-flex p-3.5 rounded-2xl ${item.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <item.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white font-heading mb-1">
                {inView ? (
                  <AnimatedNumber
                    value={item.value}
                    suffix={item.suffix}
                  />
                ) : (
                  `0${item.suffix}`
                )}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Background decorative */}
        <div className="relative mt-16 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative z-10 py-12 px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-heading mb-2">
                Ready to Find Your Home?
              </h3>
              <p className="text-blue-100 text-sm sm:text-base">
                Join thousands of satisfied tenants today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a
                href="/properties"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm text-center"
              >
                Browse Properties
              </a>
              <a
                href="/register"
                className="px-6 py-3 bg-white/20 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors text-sm text-center backdrop-blur-sm"
              >
                Get Started Free
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}