"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { TbLock, TbHome, TbLogin } from "react-icons/tb";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-5 rounded-full bg-orange-50 dark:bg-orange-900/20">
            <TbLock className="w-14 h-14 text-orange-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 font-heading">
          Access Denied
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          You do not have permission to view this page. Please log in with the
          appropriate account or contact support.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            as={Link}
            href="/login"
            color="primary"
            startContent={<TbLogin className="w-4 h-4" />}
            className="font-semibold btn-gradient"
          >
            Login
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