// src/app/(protected)/admin/properties/page.jsx
import AdminPropertiesClient from "@/components/dashboard/admin/AdminPropertiesClient";

export const metadata = { title: "All Properties — RentEasy Admin" };

export default function AdminPropertiesPage() {
  return <AdminPropertiesClient />;
}