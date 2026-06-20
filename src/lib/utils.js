// src/lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

// Tailwind class merger
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format date
export function formatDate(date) {
  if (!date) return "N/A";
  return format(new Date(date), "MMM dd, yyyy");
}

// Format date with time
export function formatDateTime(date) {
  if (!date) return "N/A";
  return format(new Date(date), "MMM dd, yyyy 'at' hh:mm a");
}

// Format relative time
export function formatRelativeTime(date) {
  if (!date) return "N/A";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// Truncate text
export function truncateText(text, maxLength = 100) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// Get status badge class
export function getStatusBadgeClass(status) {
  const classes = {
    pending: "badge-pending",
    approved: "badge-approved",
    rejected: "badge-rejected",
    paid: "badge-approved",
    unpaid: "badge-pending",
    refunded: "badge-rejected",
  };
  return classes[status] || "badge-pending";
}

// Get status label
export function getStatusLabel(status) {
  const labels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    paid: "Paid",
    unpaid: "Unpaid",
    refunded: "Refunded",
  };
  return labels[status] || status;
}

// Upload image to ImgBB
export async function uploadImageToImgBB(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Image upload failed");
  }

  const data = await response.json();
  return data.data.url;
}

// Upload multiple images to ImgBB
export async function uploadMultipleImages(files) {
  const uploadPromises = Array.from(files).map((file) =>
    uploadImageToImgBB(file)
  );
  return Promise.all(uploadPromises);
}

// Generate star rating array
export function generateStarArray(rating) {
  return Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) return "full";
    if (i < rating) return "half";
    return "empty";
  });
}

// Copy to clipboard
export async function copyToClipboard(text) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
}

// Get property type icon name
export function getPropertyTypeIcon(type) {
  const icons = {
    Apartment: "building",
    House: "home",
    Villa: "castle",
    Studio: "layout",
    Condo: "building2",
    Townhouse: "buildings",
    Office: "briefcase",
    Warehouse: "warehouse",
  };
  return icons[type] || "home";
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Generate share URL
export function getPropertyShareUrl(propertyId) {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/properties/${propertyId}`;
}