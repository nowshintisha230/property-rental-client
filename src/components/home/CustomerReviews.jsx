"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TbStar, TbStarFilled, TbQuote } from "react-icons/tb";
import { formatRelativeTime } from "@/lib/utils";
import axiosInstance from "@/lib/axios";

function StarRating({ rating = 0 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>
          {i < rating ? (
            <TbStarFilled className="w-4 h-4 text-yellow-400" />
          ) : (
            <TbStar className="w-4 h-4 text-gray-300 dark:text-gray-600" />
          )}
        </span>
      ))}
    </div>
  );
}

function normalizePhoto(url) {
  if (!url || typeof url !== "string" || url.trim() === "") return null;
  // Fix common typo: i.ibb.co.com → i.ibb.co
  return url.replace(/^https?:\/\/i\.ibb\.co\.com\//, "https://i.ibb.co/");
}

function ReviewerAvatar({ name, photo, seed }) {
  const fixed = normalizePhoto(photo);
  const fallback = `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(
    seed || name || "tenant"
  )}&size=96`;

  return (
    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500 bg-gray-100 dark:bg-gray-800 flex-shrink-0">
      <img
        src={fixed || fallback}
        alt={name || "Tenant"}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = fallback;
        }}
      />
    </div>
  );
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchReviews() {
      try {
        const res = await axiosInstance.get("/reviews/homepage");

        const fetchedReviews = res.data?.data?.reviews;

        if (!Array.isArray(fetchedReviews)) {
          throw new Error("Invalid reviews response");
        }

        if (!cancelled) {
          setReviews(fetchedReviews);
          setError(false);
        }
      } catch (err) {
        console.error("Failed to fetch customer reviews:", err);

        if (!cancelled) {
          setReviews([]);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchReviews();

    return () => {
      cancelled = true;
    };
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
            What Our <span className="gradient-text">Tenants Say</span>
          </h2>

          <p className="section-subtitle">Reviews shared by our tenants.</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="card-base p-6 animate-pulse"
              >
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded mb-2" />
                <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="flex-1">
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded mb-1" />
                    <div className="h-2 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Unable to load reviews. Please try again later.
          </p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No reviews available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, i) => {
              const reviewerName =
                review.tenant?.name ||
                review.reviewerSnapshot?.name ||
                "Tenant";
              const reviewerPhoto =
                review.tenant?.photo || review.reviewerSnapshot?.photo;

              return (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="card-base p-6 relative group hover:shadow-card-hover transition-all duration-300"
                >
                  <TbQuote className="absolute top-5 right-5 w-10 h-10 text-blue-100 dark:text-blue-900" />

                  <StarRating rating={review.rating} />

                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed my-4 relative z-10">
                    &ldquo;{review.comment}&rdquo;
                  </p>

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

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 min-w-0">
                      <ReviewerAvatar
                        name={reviewerName}
                        photo={reviewerPhoto}
                        seed={review._id}
                      />

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {reviewerName}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Verified Tenant
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2">
                      {review.createdAt
                        ? formatRelativeTime(review.createdAt)
                        : ""}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}