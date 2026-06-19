// src/app/(protected)/admin/bookings/page.jsx
import AdminBookingsClient from "@/components/dashboard/admin/AdminBookingsClient";

export const metadata = { title: "All Bookings — RentEasy Admin" };

export default function AdminBookingsPage() {
  return <AdminBookingsClient />;
}