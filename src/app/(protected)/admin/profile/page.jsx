// src/app/(protected)/admin/profile/page.jsx
// Admin profile reuses the shared profile client
import TenantProfileClient from "@/components/dashboard/tenant/TenantProfileClient";

export const metadata = { title: "Admin Profile — RentEasy" };

export default function AdminProfilePage() {
  return <TenantProfileClient />;
}