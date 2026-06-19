// src/app/(protected)/admin/page.jsx
import AdminDashboardClient from "@/components/dashboard/admin/AdminDashboardClient";

export const metadata = { title: "Admin Dashboard — RentEasy" };

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}