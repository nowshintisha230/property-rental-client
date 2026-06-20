// src/components/ui/ConfirmModal.jsx
"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { TbAlertTriangle } from "react-icons/tb";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmColor = "danger",
  isLoading = false,
  icon: Icon = TbAlertTriangle,
  iconBg = "bg-red-50 dark:bg-red-900/20",
  iconColor = "text-red-500",
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      classNames={{
        backdrop: "backdrop-blur-sm",
        base: "card-base",
      }}
    >
      <ModalContent>
        <ModalHeader
          className={`font-heading text-lg ${
            confirmColor === "danger"
              ? "text-red-600 dark:text-red-400"
              : "text-gray-900 dark:text-white"
          }`}
        >
          {title}
        </ModalHeader>
        <ModalBody>
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-xl flex-shrink-0 ${iconBg}`}
            >
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {message}
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="bordered"
            onPress={onClose}
            className="font-semibold"
            isDisabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            color={confirmColor}
            isLoading={isLoading}
            onPress={onConfirm}
            className="font-semibold"
          >
            {confirmLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}