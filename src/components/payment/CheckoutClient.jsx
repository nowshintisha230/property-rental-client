// src/components/payment/CheckoutClient.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import {
  TbLock,
  TbShieldCheck,
  TbArrowLeft,
  TbHome,
  TbCalendar,
  TbCurrencyDollar,
  TbMapPin,
  TbBed,
  TbBath,
} from "react-icons/tb";
import { getStripe } from "@/lib/stripe";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";
import StripeCheckoutForm from "./StripeCheckoutForm";
import Link from "next/link";
import toast from "react-hot-toast";

const stripePromise = getStripe();

export default function CheckoutClient() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");

  const [property, setProperty] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [intentLoading, setIntentLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/payment/checkout?propertyId=${propertyId}`);
    }
  }, [isAuthenticated]);

  // Load pending booking data from sessionStorage
  useEffect(() => {
    if (!propertyId) {
      setError("No property selected. Please start over.");
      setLoading(false);
      return;
    }

    const stored = sessionStorage.getItem("pendingBooking");
    if (!stored) {
      setError("Booking data expired. Please start the booking again.");
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (parsed.propertyId !== propertyId) {
        setError("Booking data mismatch. Please start over.");
        setLoading(false);
        return;
      }
      setBookingData(parsed);
    } catch {
      setError("Invalid booking data. Please start over.");
      setLoading(false);
    }
  }, [propertyId]);

  // Fetch property details
  useEffect(() => {
    if (!propertyId) return;
    axiosInstance
      .get(`/properties/${propertyId}`)
      .then((res) => setProperty(res.data.data.property))
      .catch(() => setError("Property not found."))
      .finally(() => setLoading(false));
  }, [propertyId]);

  // Create Stripe Payment Intent once we have property + bookingData
  useEffect(() => {
    if (!property || !bookingData || clientSecret) return;
    setIntentLoading(true);

    axiosInstance
      .post("/payments/create-intent", {
        propertyId,
        amount: bookingData.amount || property.price,
      })
      .then((res) => {
        setClientSecret(res.data.data.clientSecret);
        setPaymentIntentId(res.data.data.paymentIntentId);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Failed to initialize payment. Please try again."
        );
        toast.error("Payment initialization failed");
      })
      .finally(() => setIntentLoading(false));
  }, [property, bookingData]);

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#3b82f6",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#ef4444",
        fontFamily: "Inter, system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "12px",
      },
    },
  };

  // Loading state
  if (loading || intentLoading) {
    return (
      <div className="section-container py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form skeleton */}
            <div className="lg:col-span-3 card-base p-8 space-y-5">
              <div className="skeleton h-8 w-48 rounded-xl" />
              <div className="skeleton h-4 w-64 rounded-lg" />
              <div className="space-y-3 mt-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton h-12 rounded-xl" />
                ))}
              </div>
              <div className="skeleton h-14 rounded-xl mt-4" />
            </div>
            {/* Summary skeleton */}
            <div className="lg:col-span-2 space-y-4">
              <div className="card-base p-6 space-y-4">
                <div className="skeleton h-5 w-32 rounded-lg" />
                <div className="skeleton h-36 rounded-xl" />
                <div className="skeleton h-4 w-full rounded-lg" />
                <div className="skeleton h-4 w-3/4 rounded-lg" />
                <div className="skeleton h-10 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="section-container py-24 text-center">
        <div className="max-w-md mx-auto">
          <div className="p-5 rounded-full bg-red-50 dark:bg-red-900/20 inline-flex mb-5">
            <TbHome className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-3">
            Checkout Error
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
            {error}
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 btn-gradient text-white font-semibold px-6 py-3 rounded-xl"
          >
            <TbArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  if (!property || !bookingData || !clientSecret) return null;

  const amount = bookingData.amount || property.price;

  return (
    <div className="section-container py-8 md:py-12">
      {/* Back link */}
      <Link
        href={`/properties/${propertyId}`}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-8 group"
      >
        <TbArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Property
      </Link>

      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <TbLock className="w-5 h-5 text-green-500" />
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
              Secure Checkout
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">
            Complete Your Booking
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Your payment is protected by Stripe&apos;s industry-leading
            security
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT: Stripe Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Elements stripe={stripePromise} options={stripeOptions}>
                <StripeCheckoutForm
                  property={property}
                  bookingData={bookingData}
                  paymentIntentId={paymentIntentId}
                  amount={amount}
                />
              </Elements>
            </motion.div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="space-y-4"
            >
              {/* Property card */}
              <div className="card-base p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Booking Summary
                </h3>

                {/* Property image */}
                <div className="relative h-36 rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-700">
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <TbHome className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Property info */}
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-2">
                  {property.title}
                </h4>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <TbMapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  <span className="truncate">{property.location}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <TbBed className="w-3.5 h-3.5 text-blue-500" />
                    <span>{property.bedrooms} beds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TbBath className="w-3.5 h-3.5 text-blue-500" />
                    <span>{property.bathrooms} baths</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2.5">
                  {/* Move-in date */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <TbCalendar className="w-4 h-4 text-blue-500" />
                      <span>Move-in Date</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {bookingData.moveInDate
                        ? new Date(bookingData.moveInDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </span>
                  </div>

                  {/* Rent type */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Rent Period
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {property.rentType}
                    </span>
                  </div>

                  {/* Subtotal */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(amount)}
                    </span>
                  </div>

                  {/* Processing fee */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Processing Fee
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      Free
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-4 flex items-center justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">
                    Total Due
                  </span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400 font-heading">
                    {formatCurrency(amount)}
                  </span>
                </div>
              </div>

              {/* Security badges */}
              <div className="card-base p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TbShieldCheck className="w-4 h-4 text-green-500" />
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Payment Security
                  </p>
                </div>
                <div className="space-y-2">
                  {[
                    "256-bit SSL encryption",
                    "PCI DSS compliant",
                    "Powered by Stripe",
                    "No card data stored",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tenant info */}
              <div className="card-base p-4">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Booking For
                </p>
                <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <p>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Name:
                    </span>{" "}
                    {user?.name}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Email:
                    </span>{" "}
                    {user?.email}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Phone:
                    </span>{" "}
                    {bookingData.contactNumber}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}