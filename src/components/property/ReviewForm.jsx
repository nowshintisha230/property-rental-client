// src/components/property/ReviewForm.jsx
"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { TbStar, TbStarFilled, TbSend } from "react-icons/tb";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

export default function ReviewForm({ propertyId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/reviews", {
        propertyId,
        rating,
        comment: data.comment,
      });
      toast.success("Review submitted successfully!");
      onReviewSubmitted(res.data.data.review);
      reset();
      setRating(0);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to submit review"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Write a Review
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Star rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Rating *
          </label>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                {i < (hoverRating || rating) ? (
                  <TbStarFilled className="w-8 h-8 text-yellow-400" />
                ) : (
                  <TbStar className="w-8 h-8 text-gray-300 dark:text-gray-600 hover:text-yellow-300" />
                )}
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400 self-center">
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Your Review *
          </label>
          <textarea
            rows={4}
            placeholder="Share your experience with this property..."
            {...register("comment", {
              required: "Please write a review",
              minLength: {
                value: 10,
                message: "Review must be at least 10 characters",
              },
              maxLength: {
                value: 1000,
                message: "Review cannot exceed 1000 characters",
              },
            })}
            className={`input-base resize-none ${
              errors.comment ? "border-red-400 focus:ring-red-400" : ""
            }`}
          />
          {errors.comment && (
            <p className="text-xs text-red-500 mt-1">
              {errors.comment.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          endContent={!isLoading && <TbSend className="w-4 h-4" />}
          className="font-semibold btn-gradient text-white"
        >
          Submit Review
        </Button>
      </form>
    </div>
  );
}