// src/components/home/TopLocations.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TbMapPin, TbBuildingSkyscraper } from "react-icons/tb";
import { formatCurrency } from "@/lib/utils";
import axiosInstance from "@/lib/axios";

const fallbackLocations = [
  {
    location: "New York",
    count: 120,
    avgPrice: 3500,
    sampleImage:
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=80",
  },
  {
    location: "Los Angeles",
    count: 98,
    avgPrice: 2800,
    sampleImage:
      "https://images.unsplash.com/photo-1592201533886-b8a3e1f348a8?w=400&q=80",
  },
  {
    location: "Chicago",
    count: 76,
    avgPrice: 2200,
    sampleImage:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80",
  },
  {
    location: "Miami",
    count: 65,
    avgPrice: 2600,
    sampleImage:
      "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=400&q=80",
  },
  {
    location: "Seattle",
    count: 54,
    avgPrice: 2400,
    sampleImage:
      "https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=400&q=80",
  },
  {
    location: "Austin",
    count: 43,
    avgPrice: 1900,
    sampleImage:
      "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=400&q=80",
  },
];

export default function TopLocations() {
  const [locations, setLocations] = useState(fallbackLocations);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axiosInstance
      .get("/analytics/homepage")
      .then((res) => {
        const locs = res.data.data.topLocations;
        if (locs?.length > 0) {
          setLocations(locs);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLocationClick = (location) => {
    router.push(`/properties?location=${encodeURIComponent(location)}`);
  };

  return (
    <section className="section-padding bg-white dark:bg-gray-950">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">
            <TbMapPin className="w-4 h-4" />
            Top Destinations
          </span>
          <h2 className="section-title">
            Explore by{" "}
            <span className="gradient-text">Location</span>
          </h2>
          <p className="section-subtitle">
            Browse properties in the most popular cities and neighborhoods.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {locations.map((loc, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleLocationClick(loc.location)}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-card hover:shadow-card-hover transition-shadow"
            >
              {/* Image */}
              <img
                src={
                  loc.sampleImage ||
                  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&q=80"
                }
                alt={loc.location}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                <p className="text-white font-semibold text-sm font-heading">
                  {loc.location}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <TbBuildingSkyscraper className="w-3 h-3 text-blue-300" />
                  <span className="text-blue-200 text-xs">
                    {loc.count} properties
                  </span>
                </div>
                <p className="text-gray-300 text-xs mt-0.5">
                  avg {formatCurrency(loc.avgPrice)}/mo
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}