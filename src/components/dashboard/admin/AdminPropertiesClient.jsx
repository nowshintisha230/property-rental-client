"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Button,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import {
  TbCheck,
  TbX,
  TbEye,
  TbTrash,
  TbSearch,
  TbRefresh,
  TbHome,
  TbAlertTriangle,
  TbMessageCircle,
  TbFilter,
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

export default function AdminPropertiesClient() {
  const [properties, setProperties] = useState([]);
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
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState(null); // property
  const [rejectReason, setRejectReason] = useState("");
  const [deleteModal, setDeleteModal] = useState(null); // property
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProperties = useCallback(
    async (p = 1, s = "", status = "") => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: p, limit: 10 });
        if (s) params.append("search", s);
        if (status && status !== "all") params.append("status", status);
        const res = await axiosInstance.get(`/properties/all?${params}`);
        setProperties(res.data.data.properties || []);
        setPagination(res.data.data.pagination);
      } catch {
        toast.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchProperties(page, search, statusFilter);
  }, [fetchProperties, page, search, statusFilter]);

  const debouncedSearch = useCallback(
    debounce((val) => {
      setSearch(val);
      setPage(1);
    }, 500),
    []
  );

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await axiosInstance.patch(`/properties/${id}/approve`);
      setProperties((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, status: "approved" } : p
        )
      );
      toast.success("Property approved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim() || rejectReason.trim().length < 10) {
      toast.error("Please provide a reason (min 10 characters)");
      return;
    }
    setActionLoading(rejectModal._id);
    try {
      await axiosInstance.patch(`/properties/${rejectModal._id}/reject`, {
        reason: rejectReason.trim(),
      });
      setProperties((prev) =>
        prev.map((p) =>
          p._id === rejectModal._id ? { ...p, status: "rejected" } : p
        )
      );
      toast.success("Property rejected with feedback");
      setRejectModal(null);
      setRejectReason("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(`/properties/${deleteModal._id}`);
      setProperties((prev) =>
        prev.filter((p) => p._id !== deleteModal._id)
      );
      setPagination((p) => ({ ...p, total: p.total - 1 }));
      toast.success("Property deleted");
      setDeleteModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  const statusCounts = {
    all: pagination.total,
    pending: properties.filter((p) => p.status === "pending").length,
    approved: properties.filter((p) => p.status === "approved").length,
    rejected: properties.filter((p) => p.status === "rejected").length,
  };

  return (
    <div className="page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">All Properties</h1>
          <p className="page-description">
            Review, approve, reject, and manage all platform listings
          </p>
        </div>
        <Button type="button"
          variant="bordered"
          size="sm"
          startContent={<TbRefresh className="w-4 h-4" />}
          onPress={() => fetchProperties(page, search, statusFilter)}
          className="font-medium"
        >
          Refresh
        </Button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <TbSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              debouncedSearch(e.target.value);
            }}
            className="input-base w-full"
            style={{ paddingLeft: "2.75rem" }}
          />
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((s) => (
          <button type="button"
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
            {s === "all" ? "All Properties" : s}
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
                  {["Property", "Owner", "Type", "Price", "Status", "Actions"].map(
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
                  <TableRowSkeleton key={i} cols={6} />
                ))}
              </tbody>
            </table>
          </div>
        ) : properties.length === 0 ? (
          <EmptyState
            type="properties"
            title="No Properties Found"
            description={
              search
                ? `No properties match "${search}".`
                : `No ${statusFilter !== "all" ? statusFilter : ""} properties found.`
            }
          />
        ) : (
          <div className="table-container">
            <table className="w-full">
              <thead className="table-head">
                <tr>
                  {["Property", "Owner", "Type", "Price", "Status", "Listed", "Actions"].map(
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
                {properties.map((property, i) => (
                  <motion.tr
                    key={property._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="table-row"
                  >
                    {/* Property */}
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                          {property.images?.[0] ? (
                            <Image
                              src={property.images[0]}
                              alt={property.title}
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
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[160px]">
                            {property.title}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[140px]">
                            {property.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="table-cell">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                          {property.ownerId?.name || property.ownerInfo?.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[120px]">
                          {property.ownerId?.email || property.ownerInfo?.email}
                        </p>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="table-cell">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {property.propertyType}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="table-cell">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(property.price)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {property.rentType}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="table-cell">
                      <span className={getStatusBadgeClass(property.status)}>
                        {property.status}
                      </span>
                    </td>

                    {/* Listed date */}
                    <td className="table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(property.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        <Tooltip content="View property">
                          <Button type="button"
                            isIconOnly
                            size="sm"
                            variant="light"
                            as={Link}
                            href={`/properties/${property._id}`}
                            className="text-gray-500"
                          >
                            <TbEye className="w-4 h-4" />
                          </Button>
                        </Tooltip>

                        {property.status !== "approved" && (
                          <Tooltip content="Approve">
                            <Button type="button"
                              isIconOnly
                              size="sm"
                              variant="flat"
                              color="success"
                              isLoading={actionLoading === property._id}
                              onPress={() => handleApprove(property._id)}
                            >
                              <TbCheck className="w-4 h-4" />
                            </Button>
                          </Tooltip>
                        )}

                        {property.status !== "rejected" && (
                          <Tooltip content="Reject with feedback">
                            <Button type="button"
                              isIconOnly
                              size="sm"
                              variant="flat"
                              color="warning"
                              isLoading={actionLoading === property._id}
                              onPress={() => {
                                setRejectModal(property);
                                setRejectReason("");
                              }}
                            >
                              <TbMessageCircle className="w-4 h-4" />
                            </Button>
                          </Tooltip>
                        )}

                        <Tooltip content="Delete property">
                          <Button type="button"
                            isIconOnly
                            size="sm"
                            variant="flat"
                            color="danger"
                            onPress={() => setDeleteModal(property)}
                          >
                            <TbTrash className="w-4 h-4" />
                          </Button>
                        </Tooltip>
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
              {pagination.total} total properties
            </p>
            <div className="flex gap-2">
              <Button type="button"
                size="sm"
                variant="bordered"
                isDisabled={page <= 1}
                onPress={() => setPage((p) => p - 1)}
                className="font-medium"
              >
                Previous
              </Button>
              <Button type="button"
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

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectModal}
        onClose={() => {
          setRejectModal(null);
          setRejectReason("");
        }}
        size="md"
        classNames={{ backdrop: "backdrop-blur-sm", base: "card-base" }}
      >
        <ModalContent>
          <ModalHeader className="font-heading text-lg text-orange-600 dark:text-orange-400 border-b border-gray-100 dark:border-gray-800 pb-4">
            Reject Property
          </ModalHeader>
          <ModalBody className="py-6">
            {rejectModal && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-400 mb-0.5">Property</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {rejectModal.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    by{" "}
                    {rejectModal.ownerId?.name || rejectModal.ownerInfo?.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Rejection Reason *{" "}
                    <span className="text-gray-400 font-normal">
                      (min 10 characters)
                    </span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Explain why this property is being rejected. Be specific so the owner can improve their listing..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className={`input-base resize-none ${
                      rejectReason.length > 0 && rejectReason.length < 10
                        ? "border-red-400"
                        : ""
                    }`}
                  />
                  <div className="flex justify-between mt-1">
                    {rejectReason.length > 0 && rejectReason.length < 10 ? (
                      <p className="text-xs text-red-500">
                        Minimum 10 characters required
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs text-gray-400">
                      {rejectReason.length}/1000
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800">
                  <p className="text-xs text-orange-700 dark:text-orange-400">
                    The owner will be able to see this feedback and update
                    their listing accordingly.
                  </p>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <Button type="button"
              variant="bordered"
              onPress={() => {
                setRejectModal(null);
                setRejectReason("");
              }}
              className="font-semibold"
            >
              Cancel
            </Button>
            <Button type="button"
              color="warning"
              isLoading={!!actionLoading}
              isDisabled={rejectReason.trim().length < 10}
              onPress={handleReject}
              className="font-semibold text-white"
            >
              Reject Property
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        size="sm"
        classNames={{ backdrop: "backdrop-blur-sm", base: "card-base" }}
      >
        <ModalContent>
          <ModalHeader className="font-heading text-lg text-red-600 dark:text-red-400">
            Delete Property
          </ModalHeader>
          <ModalBody>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 flex-shrink-0">
                <TbAlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Are you sure you want to permanently delete{" "}
                  <strong className="text-gray-900 dark:text-white">
                    {deleteModal?.title}
                  </strong>
                  ? This cannot be undone.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button"
              variant="bordered"
              onPress={() => setDeleteModal(null)}
              className="font-semibold"
            >
              Cancel
            </Button>
            <Button type="button"
              color="danger"
              isLoading={deleteLoading}
              onPress={handleDelete}
              className="font-semibold"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}