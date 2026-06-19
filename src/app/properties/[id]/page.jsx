// src/app/properties/[id]/page.jsx
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import PropertyDetailsClient from "@/components/property/PropertyDetailsClient";

export const metadata = {
  title: "Property Details — RentEasy",
};

export default function PropertyDetailsPage({ params }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <main className="pt-16">
        <PropertyDetailsClient id={params.id} />
      </main>
      <Footer />
    </div>
  );
}