// src/app/error.jsx
"use client";

import { useEffect } from "react";
import { Button } from "@heroui/react";
import { TbAlertTriangle, TbRefresh, TbHome } from "react-icons/tb";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-red-50 dark:bg-red-900/20">
            <TbAlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 font-heading">
          Something went wrong!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">
          An unexpected error occurred. Please try refreshing the page or go
          back to the home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onPress={reset}
            color="primary"
            startContent={<TbRefresh className="w-4 h-4" />}
            className="font-semibold"
          >
            Try Again
          </Button>
          <Button
            as={Link}
            href="/"
            variant="bordered"
            startContent={<TbHome className="w-4 h-4" />}
            className="font-semibold"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}