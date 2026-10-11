// src/components/home/Banner.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import {
  TbSearch,
  TbMapPin,
  TbBuildingSkyscraper,
  TbCurrencyDollar,
  TbArrowRight,
  TbStar,
  TbShieldCheck,
  TbHome,
} from "react-icons/tb";

const propertyTypes = [
  "Apartment",
  "House",
  "Villa",
  "Studio",
  "Condo",
  "Townhouse",
  "Office",
  "Warehouse",
];

const stats = [
  { value: "10K+", label: "Properties", icon: TbHome },
  { value: "50K+", label: "Happy Tenants", icon: TbStar },
  { value: "99%", label: "Verified Owners", icon: TbShieldCheck },
];

export default function Banner() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    location: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchData.location) params.append("location", searchData.location);
    if (searchData.propertyType)
      params.append("propertyType", searchData.propertyType);
    if (searchData.minPrice) params.append("minPrice", searchData.minPrice);
    if (searchData.maxPrice) params.append("maxPrice", searchData.maxPrice);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[65vh] flex items-center overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80')`,
        }}
      >
        {/* Light mode overlay: soft white wash so text stays dark & readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/60 dark:hidden" />
        {/* Dark mode overlay: original dark gradient */}
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-r from-gray-950/90 via-gray-950/70 to-gray-950/40" />

        {/* Bottom fade — light version */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent dark:hidden" />
        {/* Bottom fade — dark version */}
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
      </div>

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-500"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.08, 0.12, 0.08] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-purple-500"
        />
      </div>

      <div className="relative z-10 section-container w-full py-16 md:py-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 dark:bg-blue-500/20 dark:border-blue-400/30 dark:text-blue-300 text-sm font-medium mb-6 transition-colors duration-300">
              <TbStar className="w-4 h-4" />
              #1 Property Rental Platform
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight font-heading mb-5 text-gray-900 dark:text-white transition-colors duration-300"
          >
            Find Your <span className="gradient-text">Perfect</span>
            <br />
            Home Today
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg mb-8 max-w-2xl leading-relaxed text-gray-600 dark:text-gray-300 transition-colors duration-300"
          >
            Discover thousands of verified rental properties across the
            country. From cozy studios to luxury villas — your dream home is
            just a search away.
          </motion.p>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <form
              onSubmit={handleSearch}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-2xl border border-gray-100 dark:border-gray-700 transition-colors duration-300"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Location */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 ml-1">
                    Location
                  </label>
                  <div className="relative">
                    <TbMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                    <input
                      type="text"
                      placeholder="City, neighborhood..."
                      value={searchData.location}
                      onChange={(e) =>
                        setSearchData((p) => ({
                          ...p,
                          location: e.target.value,
                        }))
                      }
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 ml-1">
                    Property Type
                  </label>
                  <div className="relative">
                    <TbBuildingSkyscraper className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                    <select
                      value={searchData.propertyType}
                      onChange={(e) =>
                        setSearchData((p) => ({
                          ...p,
                          propertyType: e.target.value,
                        }))
                      }
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">All Types</option>
                      {propertyTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 ml-1">
                    Min Price
                  </label>
                  <div className="relative">
                    <TbCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                    <input
                      type="number"
                      placeholder="Min rent"
                      min="0"
                      value={searchData.minPrice}
                      onChange={(e) =>
                        setSearchData((p) => ({
                          ...p,
                          minPrice: e.target.value,
                        }))
                      }
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 ml-1">
                    Max Price
                  </label>
                  <div className="relative">
                    <TbCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                    <input
                      type="number"
                      placeholder="Max rent"
                      min="0"
                      value={searchData.maxPrice}
                      onChange={(e) =>
                        setSearchData((p) => ({
                          ...p,
                          maxPrice: e.target.value,
                        }))
                      }
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="mt-3">
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  endContent={<TbArrowRight className="w-5 h-5" />}
                  className="font-bold btn-gradient text-white h-12 text-base"
                >
                  <TbSearch className="w-5 h-5 mr-1" />
                  Search Properties
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-6 mt-8"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/70 border border-gray-200 dark:bg-white/10 dark:border-white/20 transition-colors duration-300">
                  <stat.icon className="w-4 h-4 text-gray-900 dark:text-white transition-colors duration-300" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-tight font-heading text-gray-900 dark:text-white transition-colors duration-300">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-500 dark:text-white/50 transition-colors duration-300"
      >
        <span className="text-[10px] font-medium uppercase tracking-wider">
          Scroll
        </span>
        <div className="w-4 h-7 border-2 border-gray-400/50 dark:border-white/30 rounded-full flex justify-center pt-1 transition-colors duration-300">
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-0.5 h-1.5 bg-gray-500/70 dark:bg-white/60 rounded-full transition-colors duration-300"
          />
        </div>
      </motion.div>
    </section>
  );
}