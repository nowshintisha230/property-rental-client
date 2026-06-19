// src/components/home/FeaturedProperties.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { TbArrowRight, TbSparkles } from "react-icons/tb";
import PropertyCard from "@/components/property/PropertyCard";
import { PropertyCardSkeleton } from "@/components/ui/SkeletonCard";
import axiosInstance from "@/lib/axios";

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/properties/featured")
      .then((res) => setProperties(res.data.data.properties))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">
            <TbSparkles className="w-4 h-4" />
            Featured Listings
          </span>
          <h2 className="section-title">
            Handpicked{" "}
            <span className="gradient-text">Properties</span>
          </h2>
          <p className="section-subtitle">
            Explore our top-rated rental properties, carefully selected for
            quality, location, and value.
          </p>
        </motion.div>

        {/* Grid */}
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12"
        >
          <Button
            as={Link}
            href="/properties"
            size="lg"
            endContent={<TbArrowRight className="w-5 h-5" />}
            className="font-semibold btn-gradient text-white px-8"
          >
            View All Properties
          </Button>
        </motion.div>
      </div>
    </section>
  );
}