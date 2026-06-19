// src/app/(protected)/owner/page.jsx
import OwnerDashboardClient from "@/components/dashboard/owner/OwnerDashboardClient";

export const metadata = { title: "Owner Dashboard — RentEasy" };

export default function OwnerDashboardPage() {
  return <OwnerDashboardClient />;
}