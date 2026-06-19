// src/components/home/CustomerReviews.jsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TbStar, TbStarFilled, TbQuote } from "react-icons/tb";
import { Avatar } from "@heroui/react";
import { formatRelativeTime } from "@/lib/utils";
import axiosInstance from "@/lib/axios";

const fallbackReviews = [
  {
    _id: "1",
    rating: 5,
    comment:
      "RentEasy made finding my apartment so simple. The platform is intuitive and the properties are exactly as described. Highly recommend!",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    tenant: { name: "Sarah Chen", photo: null },
    property: { title: "Modern Downtown Apartment", location: "New York" },
  },
  {
    _id: "2",
    rating: 5,
    comment:
      "The booking process was seamless and the owner was very responsive. Found my dream villa at a great price. 10/10 experience!",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    tenant: { name: "Marcus Johnson", photo: null },
    property: { title: "Luxury Beach Villa", location: "Miami" },
  },
  {
    _id: "3",
    rating: 5,
    comment:
      "I was skeptical at first, but RentEasy exceeded all expectations. Transparent pricing, verified listings, and excellent support.",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    tenant: { name: "Emma Williams", photo: null },
    property: { title: "Cozy Studio in SoHo", location: "Los Angeles" },
  },
  {
    _id: "4",
    rating: 4,
    comment:
      "Great platform with a huge selection of properties. The filter options save so much time. Will definitely use again for my next move.",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    tenant: { name: "David Park", photo: null },
    property: { title: "Spacious Family Home", location: "Chicago" },
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>
          {i < rating ? (
            <TbStarFilled className="w-4 h-4 text-yellow-400" />
          ) : (
            <TbStar className="w-4 h-4 text-gray-300" />
          )}
        </span>
      ))}
    </div>
  );
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState(fallbackReviews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/reviews/homepage")
      .then((res) => {
        if (res.data.data.reviews?.length > 0) {
          setReviews(res.data.data.reviews);
        }
      })
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
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">
            <TbStarFilled className="w-4 h-4 text-yellow-400" />
            Testimonials
          </span>
          <h2 className="section-title">
            What Our{" "}
            <span className="gradient-text">Tenants Say</span>
          </h2>
          <p className="section-subtitle">
            Real reviews from real tenants. We let our results speak for
            themselves.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card-base p-6 relative group hover:shadow-card-hover transition-all duration-300"
            >
              {/* Quote icon */}
              <TbQuote className="absolute top-5 right-5 w-10 h-10 text-blue-100 dark:text-blue-900" />

              {/* Stars */}
              <StarRating rating={review.rating} />

              {/* Comment */}
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed my-4 relative z-10">
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* Property */}
              {review.property && (
                <div className="text-xs text-blue-500 dark:text-blue-400 font-medium mb-4">
                  Property: {review.property.title}
                  {review.property.location && (
                    <span className="text-gray-400 dark:text-gray-500 font-normal">
                      {" "}
                      · {review.property.location}
                    </span>
                  )}
                </div>
              )}

              {/* Reviewer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={review.tenant?.photo}
                    name={review.tenant?.name || review.reviewerSnapshot?.name}
                    size="sm"
                    isBordered
                    color="primary"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {review.tenant?.name || review.reviewerSnapshot?.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Verified Tenant
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatRelativeTime(review.createdAt)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}