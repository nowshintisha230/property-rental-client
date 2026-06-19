// src/components/dashboard/owner/OwnerBookingRequestsClient.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button, Avatar, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import {
  TbCheck,
  TbX,
  TbCalendarEvent,
  TbPhone,
  TbMapPin,
  TbCurrencyDollar,
  TbNote,
  TbUser,
  TbRefresh,
  TbHome,
  TbFilter,
} from "react-icons/tb";
import axiosInstance from "@/lib/axios";
import EmptyState from "@/components/ui/EmptyState";
import { TableRowSkeleton } from "@/components/ui/SkeletonCard";
import {
  formatCurrency,
  formatDate,
  getStatusBadgeClass,
} from "@/lib/utils";
import toast from "react-hot-toast";

const STATUS_FILTERS = ["all", "pending", "approved", "rejected"];

export default function OwnerBookingRequestsClient() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1, limit: 10 });
  const [detailBooking, setDetailBooking] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type, booking }

  const fetchBookings = useCallback(async (p = 1, status = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 10 });
      if (status && status !== "all") params.append("status", status);
      const res = await axiosInstance.get(`/bookings/owner?${params}`);
      setBookings(res.data.data.bookings || []);
      setPagination(res.data.data.pagination);
    } catch {
      toast.error("Failed to load booking requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(page, statusFilter);
  }, [fetchBookings, page, statusFilter]);

  const handleAction = async (bookingId, action) => {
    setActionLoading(bookingId);
    try {
      await axiosInstance.patch(`/bookings/${bookingId}/${action}`);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, status: action === "approve" ? "approved" : "rejected" }
            : b
        )
      );
      toast.success(
        `Booking ${action === "approve" ? "approved" : "rejected"} successfully`
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
      setConfirmAction(null);
    }
  };

  const filteredBookings =
    statusFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  return (
    <div className="page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">Booking Requests</h1>
          <p className="page-description">
            Review and manage tenant booking requests for your properties
          </p>
        </div>
        <Button
          variant="bordered"
          size="sm"
          startContent={<TbRefresh className="w-4 h-4" />}
          onPress={() => fetchBookings(page, statusFilter)}
          className="font-medium"
        >
          Refresh
        </Button>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              statusFilter === s
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300"
            }`}
          >
            {s === "all" ? "All Requests" : s}
            <span
              className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                statusFilter === s
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500"
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
                  {["Tenant", "Property", "Move-in", "Amount", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
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
                ? "No Booking Requests"
                : `No ${statusFilter} requests`
            }
            description="No booking requests match the current filter."
          />
        ) : (
          <div className="table-container">
            <table className="w-full">
              <thead className="table-head">
                <tr>
                  {["Tenant", "Property", "Move-in Date", "Amount", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                {filteredBookings.map((booking, i) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="table-row"
                  >
                    {/* Tenant */}
                    <td className="table-cell">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          src={
                            booking.tenantId?.photo ||
                            booking.tenantSnapshot?.photo
                          }
                          name={
                            booking.tenantId?.name ||
                            booking.tenantSnapshot?.name
                          }
                          size="sm"
                          isBordered
                          color="primary"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                            {booking.tenantSnapshot?.name ||
                              booking.tenantId?.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[120px]">
                            {booking.tenantSnapshot?.email ||
                              booking.tenantId?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Property */}
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="relative w-10 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                          {booking.propertySnapshot?.image ? (
                            <Image
                              src={booking.propertySnapshot.image}
                              alt=""
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <TbHome className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[130px]">
                          {booking.propertySnapshot?.title ||
                            booking.propertyId?.title}
                        </p>
                      </div>
                    </td>

                    {/* Move-in date */}
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

                    {/* Status */}
                    <td className="table-cell">
                      <span className={getStatusBadgeClass(booking.status)}>
                        {booking.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="table-cell">
                      <div className="flex items-center gap-1.5">
                        <Tooltip content="View details">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => setDetailBooking(booking)}
                            className="text-blue-500"
                          >
                            <TbUser className="w-4 h-4" />
                          </Button>
                        </Tooltip>

                        {booking.status === "pending" && (
                          <>
                            <Tooltip content="Approve booking">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                color="success"
                                isLoading={actionLoading === booking._id}
                                onPress={() =>
                                  setConfirmAction({
                                    type: "approve",
                                    booking,
                                  })
                                }
                              >
                                <TbCheck className="w-4 h-4" />
                              </Button>
                            </Tooltip>
                            <Tooltip content="Reject booking">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                color="danger"
                                isLoading={actionLoading === booking._id}
                                onPress={() =>
                                  setConfirmAction({
                                    type: "reject",
                                    booking,
                                  })
                                }
                              >
                                <TbX className="w-4 h-4" />
                              </Button>
                            </Tooltip>
                          </>
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
              {pagination.total} total requests
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="bordered"
                isDisabled={page <= 1}
                onPress={() => setPage((p) => p - 1)}
                className="font-medium"
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="bordered"
                isDisabled={page >= pagination.pages}
                onPress={() => setPage((p) => p + 1)}
                className="font-medium"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      <Modal
        isOpen={!!detailBooking}
        onClose={() => setDetailBooking(null)}
        size="md"
        classNames={{ backdrop: "backdrop-blur-sm", base: "card-base" }}
      >
        <ModalContent>
          <ModalHeader className="font-heading text-lg border-b border-gray-100 dark:border-gray-800 pb-4">
            Booking Request Detail
          </ModalHeader>
          <ModalBody className="py-6 space-y-4">
            {detailBooking && (
              <>
                {/* Tenant */}
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">
                    Tenant Information
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={detailBooking.tenantId?.photo}
                      name={
                        detailBooking.tenantSnapshot?.name ||
                        detailBooking.tenantId?.name
                      }
                      size="md"
                      isBordered
                      color="primary"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {detailBooking.tenantSnapshot?.name ||
                          detailBooking.tenantId?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {detailBooking.tenantSnapshot?.email ||
                          detailBooking.tenantId?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Booking fields */}
                {[
                  {
                    icon: TbCalendarEvent,
                    label: "Move-in Date",
                    value: formatDate(detailBooking.moveInDate),
                  },
                  {
                    icon: TbPhone,
                    label: "Contact Number",
                    value: detailBooking.contactNumber,
                  },
                  {
                    icon: TbCurrencyDollar,
                    label: "Amount",
                    value: formatCurrency(detailBooking.amount),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800"
                  >
                    <item.icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-32 flex-shrink-0">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.value}
                    </span>
                  </div>
                ))}

                {/* Status */}
                <div className="flex items-center gap-3 py-2">
                  <TbNote className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-32 flex-shrink-0">
                    Status
                  </span>
                  <span className={getStatusBadgeClass(detailBooking.status)}>
                    {detailBooking.status}
                  </span>
                </div>

                {/* Notes */}
                {detailBooking.additionalNotes && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold">
                      Additional Notes
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {detailBooking.additionalNotes}
                    </p>
                  </div>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <Button
              variant="bordered"
              onPress={() => setDetailBooking(null)}
              className="font-semibold"
            >
              Close
            </Button>
            {detailBooking?.status === "pending" && (
              <>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() => {
                    setDetailBooking(null);
                    setConfirmAction({ type: "reject", booking: detailBooking });
                  }}
                  className="font-semibold"
                >
                  Reject
                </Button>
                <Button
                  color="success"
                  onPress={() => {
                    setDetailBooking(null);
                    setConfirmAction({ type: "approve", booking: detailBooking });
                  }}
                  className="font-semibold text-white"
                >
                  Approve
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirm Action Modal */}
      <Modal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        size="sm"
        classNames={{ backdrop: "backdrop-blur-sm", base: "card-base" }}
      >
        <ModalContent>
          <ModalHeader
            className={`font-heading text-lg ${
              confirmAction?.type === "approve"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {confirmAction?.type === "approve"
              ? "Approve Booking"
              : "Reject Booking"}
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to{" "}
              <strong>{confirmAction?.type}</strong> the booking from{" "}
              <strong className="text-gray-900 dark:text-white">
                {confirmAction?.booking?.tenantSnapshot?.name ||
                  confirmAction?.booking?.tenantId?.name}
              </strong>
              ?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="bordered"
              onPress={() => setConfirmAction(null)}
              className="font-semibold"
            >
              Cancel
            </Button>
            <Button
              color={
                confirmAction?.type === "approve" ? "success" : "danger"
              }
              isLoading={!!actionLoading}
              onPress={() =>
                handleAction(
                  confirmAction.booking._id,
                  confirmAction.type
                )
              }
              className="font-semibold text-white"
            >
              {confirmAction?.type === "approve" ? "Approve" : "Reject"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}