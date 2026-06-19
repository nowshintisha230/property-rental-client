// src/app/(protected)/owner/profile/page.jsx
// Owner profile reuses the same profile client component
import TenantProfileClient from "@/components/dashboard/tenant/TenantProfileClient";

export const metadata = { title: "My Profile — RentEasy" };

export default function OwnerProfilePage() {
  return <TenantProfileClient />;
}