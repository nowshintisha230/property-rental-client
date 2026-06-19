// src/components/dashboard/owner/MyPropertiesClient.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import {
  TbEdit,
  TbTrash,
  TbEye,
  TbPlus,
  TbRefresh,
  TbHome,
  TbAlertTriangle,
  TbMessageCircle,
} from "react-icons/tb";
import axiosInstance from "@/lib/axios";
import EmptyState from "@/components/ui/EmptyState";
import { TableRowSkeleton } from "@/components/ui/SkeletonCard";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";
import RejectionFeedbackModal from "./RejectionFeedbackModal";
import EditPropertyModal from "./EditPropertyModal";
import toast from "react-hot-toast";

export default function MyPropertiesClient() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1, limit: 10 });
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [feedbackProperty, setFeedbackProperty] = useState(null);
  const [editProperty, setEditProperty] = useState(null);

  const fetchProperties = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/properties/owner?page=${p}&limit=10`
      );
      setProperties(res.data.data.properties || []);
      setPagination(res.data.data.pagination);
    } catch {
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties(page);
  }, [fetchProperties, page]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      setPagination((p) => ({ ...p, total: p.total - 1 }));
      toast.success("Property deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete property");
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handlePropertyUpdated = (updated) => {
    setProperties((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p))
    );
    setEditProperty(null);
    toast.success("Property updated successfully!");
  };

  const statusCounts = {
    all: properties.length,
    pending: properties.filter((p) => p.status === "pending").length,
    approved: properties.filter((p) => p.status === "approved").length,
    rejected: properties.filter((p) => p.status === "rejected").length,
  };

  return (
    <div className="page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">My Properties</h1>
          <p className="page-description">
            Manage your property listings and track approval status
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="bordered"
            size="sm"
            startContent={<TbRefresh className="w-4 h-4" />}
            onPress={() => fetchProperties(page)}
            className="font-medium"
          >
            Refresh
          </Button>
          <Button
            as={Link}
            href="/owner/add-property"
            size="sm"
            startContent={<TbPlus className="w-4 h-4" />}
            className="font-semibold btn-gradient text-white"
          >
            Add Property
          </Button>
        </div>
      </div>

      {/* Status summary pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(statusCounts).map(([key, count]) => (
          <div
            key={key}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize ${
              key === "pending"
                ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                : key === "approved"
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                : key === "rejected"
                ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {key}: {count}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden">
        {loading ? (
          <div className="table-container">
            <table className="w-full">
              <thead className="table-head">
                <tr>
                  {["Property", "Type", "Price", "Status", "Listed", "Actions"].map(
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
        ) : properties.length === 0 ? (
          <EmptyState
            type="properties"
            title="No Properties Yet"
            description="You have not added any properties yet. Start listing your first property today!"
            actionLabel="Add Your First Property"
            actionHref="/owner/add-property"
          />
        ) : (
          <div className="table-container">
            <table className="w-full">
              <thead className="table-head">
                <tr>
                  {["Property", "Type", "Price", "Status", "Listed", "Actions"].map(
                    (h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
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
                      <div className="flex items-center gap-2">
                        <span className={getStatusBadgeClass(property.status)}>
                          {property.status}
                        </span>
                        {property.status === "rejected" && (
                          <Tooltip content="View rejection feedback">
                            <button
                              onClick={() => setFeedbackProperty(property)}
                              className="p-1 text-red-400 hover:text-red-600 transition-colors"
                            >
                              <TbMessageCircle className="w-4 h-4" />
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </td>

                    {/* Listed date */}
                    <td className="table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(property.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="table-cell">
                      <div className="flex items-center gap-1.5">
                        <Tooltip content="View property">
                          <Button
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
                        <Tooltip content="Edit property">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => setEditProperty(property)}
                            className="text-blue-500"
                          >
                            <TbEdit className="w-4 h-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete property">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => setConfirmDelete(property)}
                            className="text-red-500"
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
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
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Are you sure you want to delete{" "}
                  <strong className="text-gray-900 dark:text-white">
                    {confirmDelete?.title}
                  </strong>
                  ?
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This action cannot be undone. All associated data will be
                  permanently removed.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="bordered"
              onPress={() => setConfirmDelete(null)}
              className="font-semibold"
            >
              Cancel
            </Button>
            <Button
              color="danger"
              isLoading={!!deletingId}
              onPress={() => handleDelete(confirmDelete._id)}
              className="font-semibold"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Rejection Feedback Modal */}
      <RejectionFeedbackModal
        property={feedbackProperty}
        onClose={() => setFeedbackProperty(null)}
      />

      {/* Edit Property Modal */}
      <EditPropertyModal
        property={editProperty}
        onClose={() => setEditProperty(null)}
        onUpdated={handlePropertyUpdated}
      />
    </div>
  );
}