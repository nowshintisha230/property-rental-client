// src/app/(protected)/admin/users/page.jsx
import AdminUsersClient from "@/components/dashboard/admin/AdminUsersClient";

export const metadata = { title: "All Users — RentEasy Admin" };

export default function AdminUsersPage() {
  return <AdminUsersClient />;
}