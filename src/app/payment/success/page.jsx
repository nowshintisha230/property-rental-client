// src/app/payment/success/page.jsx
import PaymentSuccessClient from "@/components/payment/PaymentSuccessClient";
import Navbar from "@/components/ui/Navbar";

export const metadata = {
  title: "Payment Successful — RentEasy",
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="pt-16">
        <PaymentSuccessClient />
      </main>
    </div>
  );
}