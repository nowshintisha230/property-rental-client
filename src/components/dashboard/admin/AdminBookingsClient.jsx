// src/components/dashboard/admin/AdminBookingsClient.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Avatar, Button, Chip } from "@heroui/react";
import {
  TbSearch,
  TbRefresh,
  TbCalendarEvent,
  TbCurrencyDollar,
  TbMapPin,
  TbHome,
  TbX,
} from "react-icons/tb";
import axiosInstance from "@/lib/axios";
import { TableRowSkeleton } from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import {
  formatCurrency,
  formatDate,
  getStatusBadgeClass,
  debounce,
} from "@/lib/utils";
import toast from "react-hot-toast";

const STATUS_FILTERS = ["all", "pending", "approved", "rejected"];

export default function AdminBookingsClient() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
    limit: 10,
  });

  const fetchBookings = useCallback(
    async (p = 1, s = "", status = "") => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: p, limit: 10 });
        if (s) params.append("search", s);
        if (status && status !== "all") params.append("status", status);
        const res = await axiosInstance.get(`/bookings/all?${params}`);
        setBookings(res.data.data.bookings || []);
        setPagination(res.data.data.pagination);
      } catch {
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchBookings(page, search, statusFilter);
  }, [fetchBookings, page, search, statusFilter]);

  const debouncedSearch = useCallback(
    debounce((val) => {
      setSearch(val);
      setPage(1);
    }, 500),
    []
  );

  return (
    <div className="page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">All Bookings</h1>
          <p className="page-description">
            Monitor all bookings across the platform
          </p>
        </div>
        <Button
          variant="bordered"
          size="sm"
          startContent={<TbRefresh className="w-4 h-4" />}
          onPress={() => fetchBookings(page, search, statusFilter)}
          className="font-medium"
        >
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-md">
        <TbSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
        <input
          type="text"
          placeholder="Search by tenant name, email, or property..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            debouncedSearch(e.target.value);
          }}
          className="input-base pl-11"
        />
        {searchInput && (
          <button
            onClick={() => {
              setSearchInput("");
              setSearch("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <TbX className="w-4 h-4" />
          </button>
        )}
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
            {s === "all" ? "All Bookings" : s}
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
                  {["Tenant", "Property", "Owner", "Move-in", "Amount", "Status", "Payment"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={7} />
                ))}
              </tbody>
            </table>
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            type="bookings"
            title="No Bookings Found"
            description={
              search
                ? `No bookings match "${search}".`
                : "No bookings have been made on the platform yet."
            }
          />
        ) : (
          <div className="table-container">
            <table className="w-full">
              <thead className="table-head">
                <tr>
                  {["Tenant", "Property", "Owner", "Move-in", "Amount", "Booking Status", "Payment"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                {bookings.map((booking, i) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
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
                            booking.tenantSnapshot?.name ||
                            booking.tenantId?.name
                          }
                          size="sm"
                          isBordered
                          color="primary"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[110px]">
                            {booking.tenantSnapshot?.name ||
                              booking.tenantId?.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[110px]">
                            {booking.tenantSnapshot?.email ||
                              booking.tenantId?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Property */}
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="relative w-9 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                          {booking.propertySnapshot?.image ? (
                            <Image
                              src={booking.propertySnapshot.image}
                              alt=""
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <TbHome className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                          {booking.propertySnapshot?.title ||
                            booking.propertyId?.title}
                        </p>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="table-cell">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[100px]">
                        {booking.ownerSnapshot?.name ||
                          booking.ownerId?.name}
                      </p>
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

                    {/* Booking status */}
                    <td className="table-cell">
                      <span className={getStatusBadgeClass(booking.status)}>
                        {booking.status}
                      </span>
                    </td>

                    {/* Payment status */}
                    <td className="table-cell">
                      <span
                        className={getStatusBadgeClass(booking.paymentStatus)}
                      >
                        {booking.paymentStatus}
                      </span>
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
    </div>
  );
}