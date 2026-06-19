// src/components/home/RecentlyAdded.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { TbClock, TbArrowRight } from "react-icons/tb";
import PropertyCard from "@/components/property/PropertyCard";
import { PropertyCardSkeleton } from "@/components/ui/SkeletonCard";
import axiosInstance from "@/lib/axios";

export default function RecentlyAdded() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/properties/recent")
      .then((res) => setProperties(res.data.data.properties))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">
              <TbClock className="w-4 h-4" />
              Just Listed
            </span>
            <h2 className="section-title">
              Recently{" "}
              <span className="gradient-text">Added</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-lg">
              Fresh listings added this week. Be the first to discover your
              next home.
            </p>
          </div>
          <Button
            as={Link}
            href="/properties?sort=newest"
            variant="bordered"
            endContent={<TbArrowRight className="w-4 h-4" />}
            className="font-semibold flex-shrink-0"
          >
            See All New
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))
            : properties.map((property, i) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}