// src/components/ui/Pagination.jsx
"use client";

import { Button } from "@heroui/react";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  className = "",
}) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Build page number array with ellipsis
  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        Math.abs(i - page) <= 1
      ) {
        pages.push(i);
      } else if (
        pages[pages.length - 1] !== "..." &&
        (i < page - 1 || i > page + 1)
      ) {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 dark:border-gray-800 ${className}`}
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {start}–{end}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {total}
        </span>{" "}
        results
      </p>

      <div className="flex items-center gap-1">
        <Button
          isIconOnly
          size="sm"
          variant="bordered"
          isDisabled={page <= 1}
          onPress={() => onPageChange(page - 1)}
          className="w-8 h-8 min-w-0"
        >
          <TbChevronLeft className="w-4 h-4" />
        </Button>

        {getPages().map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="px-2 text-gray-400 text-sm"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-xl text-sm font-medium transition-all ${
                p === page
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {p}
            </button>
          )
        )}

        <Button
          isIconOnly
          size="sm"
          variant="bordered"
          isDisabled={page >= totalPages}
          onPress={() => onPageChange(page + 1)}
          className="w-8 h-8 min-w-0"
        >
          <TbChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}