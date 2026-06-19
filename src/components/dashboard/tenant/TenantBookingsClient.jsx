// src/components/dashboard/tenant/TenantBookingsClient.jsx
"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Chip, Tooltip } from "@heroui/react";
import {
  TbCalendarEvent,
  TbMapPin,
  TbCurrencyDollar,
  TbHome,
  TbEye,
  TbDownload,
  TbRefresh,
  TbFilter,
} from "react-icons/tb";
import { useTenantBookings } from "@/hooks/useBookings";
import EmptyState from "@/components/ui/EmptyState";
import { TableRowSkeleton } from "@/components/ui/SkeletonCard";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";
import BookingDetailModal from "./BookingDetailModal";
import { generateBookingSummaryPDF } from "@/lib/pdf";
import toast from "react-hot-toast";

const STATUS_FILTERS = ["all", "pending", "approved", "rejected"];

export default function TenantBookingsClient() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { bookings, loading, pagination, refetch } = useTenantBookings();

  const filteredBookings =
    statusFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  const handleDownloadPDF = async (booking) => {
    try {
      await generateBookingSummaryPDF(booking);
      toast.success("Booking summary downloaded!");
    } catch {
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="page-transition">
      {/* Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">My Bookings</h1>
          <p className="page-description">
            Track all your property bookings and payment status
          </p>
        </div>
        <Button
          variant="bordered"
          size="sm"
          startContent={<TbRefresh className="w-4 h-4" />}
          onPress={() => refetch(page)}
          className="font-medium"
        >
          Refresh
        </Button>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              statusFilter === s
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
            }`}
          >
            {s === "all" ? "All Bookings" : s}
            <span
              className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                statusFilter === s
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              {s === "all"
                ? bookings.length
                : bookings.filter((b) => b.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden">
        {loading ? (
          <div className="table-container">
            <table className="w-full">
              <thead className="table-head">
                <tr>
                  {["Property", "Move-in Date", "Amount", "Status", "Payment", "Actions"].map(
                    (h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={6} />
                ))}
              </tbody>
            </table>
          </div>
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            type="bookings"
            title={
              statusFilter === "all"
                ? "No Bookings Yet"
                : `No ${statusFilter} bookings`
            }
            description={
              statusFilter === "all"
                ? "You have not made any bookings yet. Start exploring properties!"
                : `You have no ${statusFilter} bookings at the moment.`
            }
            actionLabel="Browse Properties"
            actionHref="/properties"
          />
        ) : (
          <div className="table-container">
            <table className="w-full">
              <thead className="table-head">
                <tr>
                  {["Property", "Move-in Date", "Amount Paid", "Booking Status", "Payment", "Actions"].map(
                    (h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                {filteredBookings.map((booking, i) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="table-row"
                  >
                    {/* Property */}
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                          {booking.propertySnapshot?.image ? (
                            <Image
                              src={booking.propertySnapshot.image}
                              alt={booking.propertySnapshot.title || "Property"}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <TbHome className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[180px]">
                            {booking.propertySnapshot?.title ||
                              booking.propertyId?.title ||
                              "Property"}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <TbMapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="text-xs text-gray-400 truncate max-w-[140px]">
                              {booking.propertySnapshot?.location ||
                                booking.propertyId?.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Move-in Date */}
                    <td className="table-cell">
                      <div className="flex items-center gap-1.5">
                        <TbCalendarEvent className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="text-sm">
                          {formatDate(booking.moveInDate)}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        <TbCurrencyDollar className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(booking.amount)}
                        </span>
                      </div>
                    </td>

                    {/* Booking Status */}
                    <td className="table-cell">
                      <span className={getStatusBadgeClass(booking.status)}>
                        {booking.status}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="table-cell">
                      <span
                        className={getStatusBadgeClass(booking.paymentStatus)}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Tooltip content="View Details">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => setSelectedBooking(booking)}
                            className="text-blue-500"
                          >
                            <TbEye className="w-4 h-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Download PDF">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => handleDownloadPDF(booking)}
                            className="text-gray-500"
                          >
                            <TbDownload className="w-4 h-4" />
                          </Button>
                        </Tooltip>
                        {booking.propertyId?._id && (
                          <Tooltip content="View Property">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              as={Link}
                              href={`/properties/${booking.propertyId._id}`}
                              className="text-gray-500"
                            >
                              <TbHome className="w-4 h-4" />
                            </Button>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.total
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {pagination.total}
              </span>{" "}
              bookings
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="bordered"
                isDisabled={page <= 1}
                onPress={() => {
                  setPage((p) => p - 1);
                  refetch(page - 1);
                }}
                className="font-medium"
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="bordered"
                isDisabled={page >= pagination.pages}
                onPress={() => {
                  setPage((p) => p + 1);
                  refetch(page + 1);
                }}
                className="font-medium"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}