// src/components/property/ReviewList.jsx
"use client";

import { Avatar } from "@heroui/react";
import { TbStar, TbStarFilled } from "react-icons/tb";
import { formatRelativeTime } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";

function StarRating({ rating, size = "sm" }) {
  const sizeClass = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>
          {i < rating ? (
            <TbStarFilled className={`${sizeClass} text-yellow-400`} />
          ) : (
            <TbStar className={`${sizeClass} text-gray-300`} />
          )}
        </span>
      ))}
    </div>
  );
}

export default function ReviewList({
  reviews,
  loading,
  averageRating,
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-32 rounded-lg" />
              <div className="skeleton h-3 w-full rounded-lg" />
              <div className="skeleton h-3 w-3/4 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <EmptyState
        type="search"
        title="No Reviews Yet"
        description="Be the first to review this property after your stay."
      />
    );
  }

  return (
    <div>
      {/* Average rating summary */}
      {averageRating > 0 && (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 mb-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900 dark:text-white font-heading">
              {averageRating.toFixed(1)}
            </p>
            <StarRating rating={Math.round(averageRating)} size="md" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Rating breakdown */}
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter(
                (r) => Math.round(r.rating) === star
              ).length;
              const pct = reviews.length
                ? Math.round((count / reviews.length) * 100)
                : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-3">{star}</span>
                  <TbStarFilled className="w-3 h-3 text-yellow-400" />
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-6 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review list */}
      <div className="space-y-5">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="flex gap-3 pb-5 border-b border-gray-100 dark:border-gray-800 last:border-0"
          >
            <Avatar
              src={
                review.tenantId?.photo || review.reviewerSnapshot?.photo
              }
              name={
                review.tenantId?.name || review.reviewerSnapshot?.name
              }
              size="sm"
              isBordered
              color="primary"
              className="flex-shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {review.tenantId?.name || review.reviewerSnapshot?.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {review.tenantId?.email ||
                      review.reviewerSnapshot?.email}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarRating rating={review.rating} />
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatRelativeTime(review.createdAt)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-1.5">
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}