// src/components/ui/ShareProperty.jsx
"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Tooltip,
} from "@heroui/react";
import {
  TbShare,
  TbCopy,
  TbCheck,
  TbBrandTwitter,
  TbBrandFacebook,
  TbBrandWhatsapp,
  TbBrandTelegram,
  TbMail,
} from "react-icons/tb";
import { copyToClipboard, getPropertyShareUrl } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ShareProperty({ propertyId, propertyTitle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = getPropertyShareUrl(propertyId);
  const shareText = `Check out this property: ${propertyTitle}`;

  const handleCopy = async () => {
    await copyToClipboard(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      label: "Twitter",
      icon: TbBrandTwitter,
      color: "bg-sky-500 hover:bg-sky-600",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "Facebook",
      icon: TbBrandFacebook,
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "WhatsApp",
      icon: TbBrandWhatsapp,
      color: "bg-green-500 hover:bg-green-600",
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    },
    {
      label: "Telegram",
      icon: TbBrandTelegram,
      color: "bg-sky-400 hover:bg-sky-500",
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      label: "Email",
      icon: TbMail,
      color: "bg-gray-600 hover:bg-gray-700",
      url: `mailto:?subject=${encodeURIComponent(propertyTitle)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
    },
  ];

  return (
    <>
      <Button
        variant="bordered"
        startContent={<TbShare className="w-4 h-4" />}
        onPress={() => setIsOpen(true)}
        className="font-semibold"
        size="sm"
      >
        Share
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="md"
        classNames={{
          backdrop: "backdrop-blur-sm",
          base: "card-base",
        }}
      >
        <ModalContent>
          <ModalHeader className="font-heading text-lg">
            Share Property
          </ModalHeader>
          <ModalBody className="pb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Share this property with friends and family
            </p>

            {/* Social share buttons */}
            <div className="flex flex-wrap gap-2 mb-5">
              {shareOptions.map((option) => (
                <a
                  key={option.label}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all duration-200 ${option.color}`}
                >
                  <option.icon className="w-4 h-4" />
                  {option.label}
                </a>
              ))}
            </div>

            {/* Copy link */}
            <div className="flex gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <p className="flex-1 text-sm text-gray-600 dark:text-gray-300 truncate">
                {shareUrl}
              </p>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors flex-shrink-0"
              >
                {copied ? (
                  <TbCheck className="w-4 h-4 text-green-500" />
                ) : (
                  <TbCopy className="w-4 h-4" />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}