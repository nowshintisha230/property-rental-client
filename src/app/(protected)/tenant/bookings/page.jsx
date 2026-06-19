// src/app/(protected)/tenant/bookings/page.jsx
import TenantBookingsClient from "@/components/dashboard/tenant/TenantBookingsClient";

export const metadata = { title: "My Bookings — RentEasy" };

export default function TenantBookingsPage() {
  return <TenantBookingsClient />;
}