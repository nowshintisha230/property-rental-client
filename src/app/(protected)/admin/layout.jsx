// src/app/(protected)/admin/layout.jsx
"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Navbar from "@/components/ui/Navbar";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="flex pt-16">
          <DashboardSidebar role="admin" />
          <main className="flex-1 min-w-0 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}