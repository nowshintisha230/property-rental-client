// src/app/not-found.jsx
import Link from "next/link";
import { Button } from "@heroui/react";
import { TbError404, TbHome, TbArrowLeft } from "react-icons/tb";

export const metadata = {
  title: "404 — Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="text-center max-w-lg">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="text-9xl font-black text-gray-100 dark:text-gray-800 select-none font-heading">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <TbError404 className="w-24 h-24 text-blue-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 font-heading">
          Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved. Let us
          help you find your way back.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            as={Link}
            href="/"
            color="primary"
            startContent={<TbHome className="w-4 h-4" />}
            className="font-semibold btn-gradient"
          >
            Back to Home
          </Button>
          <Button
            as={Link}
            href="/properties"
            variant="bordered"
            startContent={<TbArrowLeft className="w-4 h-4" />}
            className="font-semibold"
          >
            Browse Properties
          </Button>
        </div>
      </div>
    </div>
  );
}