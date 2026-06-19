// src/components/dashboard/tenant/BookingDetailModal.jsx
"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Avatar,
} from "@heroui/react";
import {
  TbCalendarEvent,
  TbPhone,
  TbMapPin,
  TbBed,
  TbBath,
  TbCurrencyDollar,
  TbDownload,
  TbUser,
  TbNote,
  TbHome,
} from "react-icons/tb";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getStatusBadgeClass,
} from "@/lib/utils";
import { generateBookingSummaryPDF } from "@/lib/pdf";
import toast from "react-hot-toast";

export default function BookingDetailModal({ booking, onClose }) {
  if (!booking) return null;

  const handleDownload = async () => {
    try {
      await generateBookingSummaryPDF(booking);
      toast.success("PDF downloaded successfully!");
    } catch {
      toast.error("Failed to generate PDF");
    }
  };

  const property = booking.propertyId;
  const owner = booking.ownerId;

  return (
    <Modal
      isOpen={!!booking}
      onClose={onClose}
      size="lg"
      scrollBehavior="inside"
      classNames={{
        backdrop: "backdrop-blur-sm",
        base: "card-base",
      }}
    >
      <ModalContent>
        <ModalHeader className="font-heading text-xl border-b border-gray-100 dark:border-gray-800 pb-4">
          Booking Details
        </ModalHeader>

        <ModalBody className="py-6 space-y-5">
          {/* Property info */}
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              Property
            </p>
            <div className="flex gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              {booking.propertySnapshot?.image && (
                <img
                  src={booking.propertySnapshot.image}
                  alt={booking.propertySnapshot.title}
                  className="w-16 h-14 object-cover rounded-xl flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                  {booking.propertySnapshot?.title || property?.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <TbMapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {booking.propertySnapshot?.location || property?.location}
                  </p>
                </div>
                <div className="flex gap-3 mt-2">
                  {property?.bedrooms !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <TbBed className="w-3.5 h-3.5 text-blue-500" />
                      {property.bedrooms} beds
                    </div>
                  )}
                  {property?.bathrooms !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <TbBath className="w-3.5 h-3.5 text-blue-500" />
                      {property.bathrooms} baths
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Divider />

          {/* Booking details */}
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              Booking Information
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: TbCalendarEvent,
                  label: "Move-in Date",
                  value: formatDate(booking.moveInDate),
                },
                {
                  icon: TbCalendarEvent,
                  label: "Booked On",
                  value: formatDate(booking.createdAt),
                },
                {
                  icon: TbPhone,
                  label: "Contact Number",
                  value: booking.contactNumber,
                },
                {
                  icon: TbCurrencyDollar,
                  label: "Amount Paid",
                  value: formatCurrency(booking.amount),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <item.icon className="w-3.5 h-3.5 text-blue-500" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.label}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                Booking Status
              </p>
              <span className={getStatusBadgeClass(booking.status)}>
                {booking.status}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                Payment Status
              </p>
              <span className={getStatusBadgeClass(booking.paymentStatus)}>
                {booking.paymentStatus}
              </span>
            </div>
          </div>

          {/* Notes */}
          {booking.additionalNotes && (
            <>
              <Divider />
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <TbNote className="w-4 h-4 text-blue-500" />
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Additional Notes
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                  {booking.additionalNotes}
                </p>
              </div>
            </>
          )}

          {/* Owner info */}
          {owner && (
            <>
              <Divider />
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  Property Owner
                </p>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <Avatar
                    src={owner.photo}
                    name={owner.name}
                    size="sm"
                    isBordered
                    color="primary"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {owner.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {owner.email}
                    </p>
                  </div>
                </div>
              </div>
            </>
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
          <Button
            startContent={<TbDownload className="w-4 h-4" />}
            onPress={handleDownload}
            className="font-semibold btn-gradient text-white"
          >
            Download PDF
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}