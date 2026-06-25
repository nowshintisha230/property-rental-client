// src/components/payment/PaymentSuccessClient.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Avatar } from "@heroui/react";
import {
  TbCheck,
  TbCalendar,
  TbHome,
  TbDownload,
  TbLayoutDashboard,
  TbMapPin,
  TbPhone,
  TbReceipt,
  TbUser,
  TbArrowRight,
  TbConfetti,
} from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { formatCurrency, formatDate } from "@/lib/utils";
import { generateBookingSummaryPDF } from "@/lib/pdf";
import toast from "react-hot-toast";

// Confetti particle component
function ConfettiParticle({ delay, color }) {
  const randomX = Math.random() * 100;
  const randomDuration = 2 + Math.random() * 2;
  const randomSize = 6 + Math.random() * 8;

  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${randomX}%`,
        top: "-10px",
        width: randomSize,
        height: randomSize,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      }}
      animate={{
        y: ["0vh", "110vh"],
        rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: randomDuration,
        delay,
        ease: "easeIn",
      }}
    />
  );
}

export default function PaymentSuccessClient() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = searchParams.get("bookingId");
  const paymentIntentId = searchParams.get("paymentIntentId");
  const [amount, setAmount] = useState(0);
  const propertyId = searchParams.get("propertyId");

  const [booking, setBooking] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const confettiColors = [
    "#3b82f6","#8b5cf6","#d946ef",
    "#10b981","#f59e0b","#ef4444",
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = [];

        if (bookingId) {
          requests.push(
            axiosInstance
              .get(`/bookings/${bookingId}`)
              .then((res) => {
                setBooking(res.data.data.booking);
                setAmount(res.data.data.booking.amount);
              })
              .catch(() => {})
          );
        } else if (paymentIntentId) {
          requests.push(
            axiosInstance
              .get(`/payments/${paymentIntentId}`)
              .then((res) => setAmount(res.data.data.amount))
              .catch(() => {})
          );
        }

        if (propertyId) {
          requests.push(
            axiosInstance
              .get(`/properties/${propertyId}`)
              .then((res) => setProperty(res.data.data.property))
              .catch(() => {})
          );
        }

        await Promise.all(requests);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId, paymentIntentId, propertyId]);

  const handleDownloadPDF = async () => {
    if (!booking) {
      toast.error("Booking details not available for PDF");
      return;
    }
    setPdfLoading(true);
    try {
      await generateBookingSummaryPDF(booking);
      toast.success("Booking confirmation downloaded!");
    } catch {
      toast.error("Failed to generate PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  const transactionId = paymentIntentId
    ? `TXN-${paymentIntentId.slice(-8).toUpperCase()}`
    : booking?._id
    ? `TXN-${booking._id.slice(-8).toUpperCase()}`
    : "TXN-SUCCESS";

  return (
    <div className="section-container py-12 relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
          aria-hidden="true"
        >
          {Array.from({ length: 60 }).map((_, i) => (
            <ConfettiParticle
              key={i}
              delay={i * 0.05}
              color={confettiColors[i % confettiColors.length]}
            />
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Success header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-center mb-10"
        >
          <div className="relative inline-block mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 12,
                delay: 0.2,
              }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg mx-auto"
            >
              <TbCheck className="w-12 h-12 text-white stroke-[3]" />
            </motion.div>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-green-400"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1 + i * 0.4, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.3,
                  repeat: 1,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-heading mb-3"
          >
            Payment Successful! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 dark:text-gray-400"
          >
            Your booking has been confirmed. Welcome to your new home!
          </motion.p>
        </motion.div>

        {/* Transaction ID + Amount banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-base p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
              Transaction ID
            </p>
            <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg inline-block">
              {transactionId}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
              Amount Paid
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 font-heading">
              {formatCurrency(amount)}
            </p>
          </div>
        </motion.div>

        {/* Booking + Property details */}
        {loading ? (
          <div className="card-base p-6 space-y-4 mb-6">
            <div className="skeleton h-5 w-48 rounded-lg" />
            <div className="skeleton h-32 rounded-xl" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-4 rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card-base p-6 mb-6"
          >
            <h2 className="text-base font-semibold text-gray-900 dark:text-white font-heading mb-5">
              Booking Confirmation
            </h2>

            {(property || booking?.propertySnapshot) && (
              <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 mb-5">
                {(property?.images?.[0] || booking?.propertySnapshot?.image) && (
                  <img
                    src={
                      property?.images?.[0] ||
                      booking?.propertySnapshot?.image
                    }
                    alt="Property"
                    className="w-20 h-16 object-cover rounded-xl flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                    {property?.title ||
                      booking?.propertySnapshot?.title ||
                      "Property"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <TbMapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {property?.location ||
                        booking?.propertySnapshot?.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-lg font-medium">
                      {property?.propertyType ||
                        booking?.propertySnapshot?.propertyType}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: TbCalendar,
                  label: "Move-in Date",
                  value: booking?.moveInDate
                    ? formatDate(booking.moveInDate)
                    : "As scheduled",
                },
                {
                  icon: TbPhone,
                  label: "Contact Number",
                  value: booking?.contactNumber || "On file",
                },
                {
                  icon: TbReceipt,
                  label: "Booking Status",
                  value: (
                    <span className="badge-pending capitalize">
                      {booking?.status || "Pending Review"}
                    </span>
                  ),
                },
                {
                  icon: TbUser,
                  label: "Booked By",
                  value: user?.name || "You",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex-shrink-0">
                    <item.icon className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
                      {item.label}
                    </p>
                    {typeof item.value === "string" ? (
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {item.value}
                      </p>
                    ) : (
                      item.value
                    )}
                  </div>
                </div>
              ))}
            </div>

            {booking?.additionalNotes && (
              <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                  Additional Notes
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {booking.additionalNotes}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* What happens next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card-base p-6 mb-8"
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-white font-heading mb-4">
            What Happens Next?
          </h3>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Booking Under Review",
                description:
                  "The property owner will review your booking request and respond within 24–48 hours.",
                color: "bg-blue-500",
              },
              {
                step: "2",
                title: "Owner Confirmation",
                description:
                  "Once approved, you will receive a confirmation notification in your dashboard.",
                color: "bg-purple-500",
              },
              {
                step: "3",
                title: "Move-in Day",
                description:
                  "Contact the owner using the provided details to coordinate your move-in.",
                color: "bg-green-500",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div
                  className={`w-7 h-7 rounded-full ${item.color} text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}
                >
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button
            as={Link}
            href="/tenant/bookings"
            size="lg"
            startContent={<TbLayoutDashboard className="w-5 h-5" />}
            endContent={<TbArrowRight className="w-4 h-4" />}
            className="flex-1 font-bold btn-gradient text-white h-13"
          >
            View My Bookings
          </Button>

          <Button
            size="lg"
            variant="bordered"
            startContent={<TbDownload className="w-5 h-5" />}
            isLoading={pdfLoading}
            onPress={handleDownloadPDF}
            className="flex-1 font-semibold"
          >
            Download Receipt
          </Button>

          <Button
            as={Link}
            href="/properties"
            size="lg"
            variant="bordered"
            startContent={<TbHome className="w-5 h-5" />}
            className="sm:flex-none font-semibold"
          >
            Browse More
          </Button>
        </motion.div>

        {/* Support note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8"
        ><a>
          Need help? Contact us at{" "}
          
            href="mailto:support@renteasy.com"
            className="text-blue-500 hover:underline"
          >
            support@renteasy.com
          </a>
        </motion.p>
      </div>
    </div>
  );
}