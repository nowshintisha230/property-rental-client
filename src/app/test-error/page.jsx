// src/app/test-error/page.jsx
"use client";

import { useState } from "react";

export default function TestErrorPage() {
  const [crash, setCrash] = useState(false);

  if (crash) {
    throw new Error("Triggered by button click");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={() => setCrash(true)}
        className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold"
      >
        Trigger Error
      </button>
    </div>
  );
}