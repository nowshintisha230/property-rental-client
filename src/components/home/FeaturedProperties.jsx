// src/components/home/FeaturedProperties.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import { TbArrowRight, TbSparkles, TbChevronLeft, TbChevronRight } from "react-icons/tb";
import PropertyCard from "@/components/property/PropertyCard";
import { PropertyCardSkeleton } from "@/components/ui/SkeletonCard";
import axiosInstance from "@/lib/axios";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(2); // default desktop
  const [currentPage, setCurrentPage] = useState(1);

  // Backend থেকে একবারে সব (৬টা) property fetch
  useEffect(() => {
    axiosInstance
      .get("/properties/featured")
      .then((res) => setProperties(res.data.data.properties))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Screen size অনুযায়ী itemsPerPage সেট করা — mobile: 1, desktop (sm এবং তার উপরে): 2
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");

    const updateItemsPerPage = (matches) => {
      setItemsPerPage(matches ? 2 : 1);
      setCurrentPage(1); // resize হলে পেজ ১-এ রিসেট
    };

    updateItemsPerPage(mq.matches);

    const handleChange = (e) => updateItemsPerPage(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const totalPages = Math.ceil(properties.length / itemsPerPage) || 1;

  const paginatedProperties = properties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

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
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: "easeInOut",
              }}
            >
              <TbSparkles className="w-4 h-4" />
            </motion.span>
            Featured Listings
          </motion.span>
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
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <PropertyCardSkeleton />
              </motion.div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {paginatedProperties.map((property) => (
                <motion.div
                  key={property._id}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <Button
              isIconOnly
              variant="bordered"
              size="sm"
              isDisabled={currentPage === 1}
              onPress={() => handlePageChange(currentPage - 1)}
            >
              <TbChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  size="sm"
                  isIconOnly
                  variant={pageNum === currentPage ? "solid" : "bordered"}
                  className={
                    pageNum === currentPage
                      ? "btn-gradient text-white"
                      : ""
                  }
                  onPress={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              isIconOnly
              variant="bordered"
              size="sm"
              isDisabled={currentPage === totalPages}
              onPress={() => handlePageChange(currentPage + 1)}
            >
              <TbChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mt-12"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Button
              as={Link}
              href="/properties"
              size="lg"
              endContent={
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }}
                >
                  <TbArrowRight className="w-5 h-5" />
                </motion.span>
              }
              className="font-semibold btn-gradient text-white px-8"
            >
              View All Properties
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}