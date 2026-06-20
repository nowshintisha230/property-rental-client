// src/app/(protected)/owner/booking-requests/page.jsx
import OwnerBookingRequestsClient from "@/components/dashboard/owner/OwnerBookingRequestsClient";

export const metadata = { title: "Booking Requests — RentEasy" };

export default function OwnerBookingRequestsPage() {
  return <OwnerBookingRequestsClient />;
}
