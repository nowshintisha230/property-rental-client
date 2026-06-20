// src/components/payment/StripeCheckoutForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useStripe,
  useElements,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import {
  TbLock,
  TbCreditCard,
  TbCheck,
  TbAlertCircle,
  TbShieldCheck,
} from "react-icons/tb";
import axiosInstance from "@/lib/axios";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

export default function StripeCheckoutForm({
  property,
  bookingData,
  paymentIntentId,
  amount,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/payment/success`,
            receipt_email: email,
          },
          redirect: "if_required",
        });

      if (stripeError) {
        setPaymentError(
          stripeError.message || "Payment failed. Please try again."
        );
        toast.error(stripeError.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        setPaymentSuccess(true);

        // Confirm booking on backend
        try {
          const res = await axiosInstance.post("/payments/confirm", {
            paymentIntentId: paymentIntent.id,
            propertyId: property._id,
            moveInDate: bookingData.moveInDate,
            contactNumber: bookingData.contactNumber,
            additionalNotes: bookingData.additionalNotes || "",
            amount: amount,
          });

          const bookingId = res.data.data.booking?._id;

          // Clear pending booking from sessionStorage
          sessionStorage.removeItem("pendingBooking");

          toast.success("Payment successful! Booking confirmed.");

          // Redirect to success page
          router.push(
            `/payment/success?bookingId=${bookingId}&amount=${amount}&propertyId=${property._id}`
          );
        } catch (confirmError) {
          // Payment succeeded but backend confirmation failed
          // Still redirect to success — webhook will handle the rest
          toast.success(
            "Payment received! Your booking will be confirmed shortly."
          );
          sessionStorage.removeItem("pendingBooking");
          router.push(
            `/payment/success?paymentIntentId=${paymentIntent.id}&amount=${amount}&propertyId=${property._id}`
          );
        }
      } else {
        setPaymentError(
          `Payment status: ${paymentIntent?.status}. Please try again.`
        );
        setIsProcessing(false);
      }
    } catch (err) {
      setPaymentError("An unexpected error occurred. Please try again.");
      toast.error("Payment failed");
      setIsProcessing(false);
    }
  };

  // Payment element options
  const paymentElementOptions = {
    layout: {
      type: "tabs",
      defaultCollapsed: false,
      radios: true,
      spacedAccordionItems: false,
    },
  };

  // Success state
  if (paymentSuccess) {
    return (
      <div className="card-base p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex p-4 rounded-full bg-green-50 dark:bg-green-900/20 mb-5"
        >
          <TbCheck className="w-10 h-10 text-green-500" />
        </motion.div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Redirecting to your booking confirmation...
        </p>
        <div className="mt-4 flex justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="card-base p-6 sm:p-8">
      {/* Form header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
            Payment Details
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Enter your card information to complete the booking
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium">
          <TbShieldCheck className="w-4 h-4" />
          <span>Secured</span>
        </div>
      </div>

      {/* Amount banner */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 mb-6">
        <div className="flex items-center gap-2">
          <TbCurrencyDollar className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Amount to Pay
          </span>
        </div>
        <span className="text-xl font-bold text-blue-700 dark:text-blue-300 font-heading">
          {formatCurrency(amount)}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Link authentication element for autofill */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email for Receipt
          </label>
          <LinkAuthenticationElement
            onChange={(e) => setEmail(e.value?.email || "")}
            options={{
              defaultValues: { email: "" },
            }}
          />
        </div>

        {/* Stripe Payment Element */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Card Information
          </label>
          <div className="stripe-form-wrapper rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden p-1">
            <PaymentElement
              options={paymentElementOptions}
              className="stripe-element"
            />
          </div>
        </div>

        {/* Payment Error */}
        {paymentError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800"
          >
            <TbAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                Payment Failed
              </p>
              <p className="text-xs text-red-600 dark:text-red-300 mt-0.5">
                {paymentError}
              </p>
            </div>
          </motion.div>
        )}

        {/* Booking details reminder */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Booking Details
          </p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Move-in Date
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {bookingData.moveInDate
                  ? new Date(bookingData.moveInDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Contact
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {bookingData.contactNumber}
              </span>
            </div>
            {bookingData.additionalNotes && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Notes
                </span>
                <span className="font-medium text-gray-900 dark:text-white text-right max-w-[200px] truncate">
                  {bookingData.additionalNotes}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isProcessing}
          isDisabled={!stripe || !elements || isProcessing}
          startContent={
            !isProcessing && <TbLock className="w-5 h-5" />
          }
          className="h-14 text-base font-bold btn-gradient text-white mt-2 rounded-xl"
        >
          {isProcessing
            ? "Processing Payment..."
            : `Pay ${formatCurrency(amount)} Securely`}
        </Button>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {[
            { label: "SSL Encrypted" },
            { label: "Stripe Secure" },
            { label: "No Hidden Fees" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500"
            >
              <TbShieldCheck className="w-3.5 h-3.5 text-green-400" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Test card hint */}
        <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800">
          <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-1">
            Test Mode — Use Test Card
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-300 font-mono">
            4242 4242 4242 4242 · 12/34 · 123
          </p>
        </div>
      </form>
    </div>
  );
}