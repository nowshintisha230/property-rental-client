// src/app/payment/checkout/page.jsx
import CheckoutClient from "@/components/payment/CheckoutClient";
import Navbar from "@/components/ui/Navbar";

export const metadata = {
  title: "Secure Checkout — RentEasy",
  description: "Complete your property booking with secure Stripe payment.",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="pt-16">
        <CheckoutClient />
      </main>
    </div>
  );
}