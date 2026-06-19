// src/components/property/BookingModal.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Input, Textarea, Divider,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import {
  TbCalendar, TbPhone, TbNote,
  TbCreditCard, TbUser,
} from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

export default function BookingModal({ isOpen, onClose, property }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      moveInDate: "",
      contactNumber: "",
      additionalNotes: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Store booking data and redirect to payment
      const bookingData = {
        propertyId: property._id,
        moveInDate: data.moveInDate,
        contactNumber: data.contactNumber,
        additionalNotes: data.additionalNotes,
        amount: property.price,
        propertyTitle: property.title,
        propertyImage: property.images?.[0],
      };
      sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));
      router.push(`/payment/checkout?propertyId=${property._id}`);
      handleClose();
    } catch (err) {
      toast.error("Failed to initiate booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      classNames={{
        backdrop: "backdrop-blur-sm",
        base: "card-base",
      }}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="font-heading text-xl border-b border-gray-100 dark:border-gray-800 pb-4">
          Book This Property
        </ModalHeader>

        <ModalBody className="py-6">
          {/* Property summary */}
          <div className="flex gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 mb-4">
            {property?.images?.[0] && (
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-16 h-14 object-cover rounded-xl flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                {property?.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {property?.location}
              </p>
              <p className="text-blue-600 dark:text-blue-400 font-bold text-sm mt-1">
                {formatCurrency(property?.price)}{" "}
                <span className="font-normal text-gray-400 text-xs">
                  / {property?.rentType}
                </span>
              </p>
            </div>
          </div>

          {/* Tenant info (readonly) */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                Tenant Name
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                Email
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <form
            id="booking-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Move-in date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Move-in Date *
              </label>
              <div className="relative">
                <TbCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="date"
                  min={today}
                  {...register("moveInDate", {
                    required: "Move-in date is required",
                    validate: (v) =>
                      new Date(v) >= new Date(today) ||
                      "Date cannot be in the past",
                  })}
                  className={`input-base pl-11 ${
                    errors.moveInDate
                      ? "border-red-400 focus:ring-red-400"
                      : ""
                  }`}
                />
              </div>
              {errors.moveInDate && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.moveInDate.message}
                </p>
              )}
            </div>

            {/* Contact number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Contact Number *
              </label>
              <div className="relative">
                <TbPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  {...register("contactNumber", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^[+]?[\d\s\-()]{7,20}$/,
                      message: "Please enter a valid phone number",
                    },
                  })}
                  className={`input-base pl-11 ${
                    errors.contactNumber
                      ? "border-red-400 focus:ring-red-400"
                      : ""
                  }`}
                />
              </div>
              {errors.contactNumber && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.contactNumber.message}
                </p>
              )}
            </div>

            {/* Additional notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Additional Notes
              </label>
              <textarea
                rows={3}
                placeholder="Any special requests or information for the owner..."
                {...register("additionalNotes", {
                  maxLength: {
                    value: 500,
                    message: "Notes cannot exceed 500 characters",
                  },
                })}
                className={`input-base resize-none ${
                  errors.additionalNotes
                    ? "border-red-400 focus:ring-red-400"
                    : ""
                }`}
              />
              {errors.additionalNotes && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.additionalNotes.message}
                </p>
              )}
            </div>
          </form>

          {/* Payment note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 mt-2">
            <TbCreditCard className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-300">
              You will be redirected to our secure Stripe payment page. Your
              booking will be confirmed after successful payment of{" "}
              <strong>{formatCurrency(property?.price)}</strong>.
            </p>
          </div>
        </ModalBody>

        <ModalFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
          <Button
            variant="bordered"
            onPress={handleClose}
            className="font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="booking-form"
            isLoading={isLoading}
            startContent={
              !isLoading && <TbCreditCard className="w-4 h-4" />
            }
            className="font-semibold btn-gradient text-white"
          >
            Proceed to Payment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}