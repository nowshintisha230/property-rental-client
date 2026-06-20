// src/app/properties/[id]/page.jsx
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import PropertyDetailsClient from "@/components/property/PropertyDetailsClient";

export const metadata = {
  title: "Property Details — RentEasy",
};

export default async function PropertyDetailsPage({ params }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <main className="pt-16">
        <PropertyDetailsClient id={id} />
      </main>
      <Footer />
    </div>
  );
}