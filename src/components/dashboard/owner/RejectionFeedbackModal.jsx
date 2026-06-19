// src/components/dashboard/owner/RejectionFeedbackModal.jsx
"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import {
  TbAlertTriangle,
  TbCalendar,
  TbUser,
  TbMessageCircle,
} from "react-icons/tb";
import axiosInstance from "@/lib/axios";
import { formatDateTime } from "@/lib/utils";

export default function RejectionFeedbackModal({ property, onClose }) {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!property?._id) return;
    setLoading(true);
    setError(null);
    setFeedback(null);

    axiosInstance
      .get(`/feedback/${property._id}`)
      .then((res) => setFeedback(res.data.data.feedback))
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "No rejection feedback found."
        );
      })
      .finally(() => setLoading(false));
  }, [property]);

  return (
    <Modal
      isOpen={!!property}
      onClose={onClose}
      size="md"
      classNames={{
        backdrop: "backdrop-blur-sm",
        base: "card-base",
      }}
    >
      <ModalContent>
        <ModalHeader className="font-heading text-lg border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-red-50 dark:bg-red-900/20">
              <TbAlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            Rejection Feedback
          </div>
        </ModalHeader>

        <ModalBody className="py-6">
          {/* Property name */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 mb-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
              Property
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
              {property?.title}
            </p>
          </div>

          {loading && (
            <div className="space-y-3 animate-pulse">
              <div className="skeleton h-4 w-2/3 rounded-lg" />
              <div className="skeleton h-20 rounded-xl" />
              <div className="skeleton h-4 w-1/2 rounded-lg" />
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-6">
              <TbMessageCircle className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {error}
              </p>
            </div>
          )}

          {feedback && !loading && (
            <div className="space-y-4">
              {/* Admin info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <TbUser className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Reviewed by
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {feedback.adminSnapshot?.name ||
                      feedback.adminId?.name ||
                      "Admin"}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Date
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {formatDateTime(feedback.createdAt)}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <TbMessageCircle className="w-3.5 h-3.5" />
                  Reason for Rejection
                </p>
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-300 leading-relaxed">
                    {feedback.reason}
                  </p>
                </div>
              </div>

              {/* What to do */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
                  What can you do?
                </p>
                <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-0.5">
                  <li>• Update your property to address the feedback</li>
                  <li>
                    • Edit the property listing and resubmit it
                  </li>
                  <li>
                    • Contact support if you believe this is an error
                  </li>
                </ul>
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
          <Button
            variant="bordered"
            onPress={onClose}
            className="font-semibold"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}