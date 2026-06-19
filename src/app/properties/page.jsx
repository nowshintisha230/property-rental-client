// src/app/properties/page.jsx
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import AllPropertiesClient from "@/components/property/AllPropertiesClient";

export const metadata = {
  title: "All Properties — RentEasy",
  description:
    "Browse all available rental properties. Filter by location, type, and price.",
};

export default function AllPropertiesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <main className="pt-16">
        <AllPropertiesClient />
      </main>
      <Footer />
    </div>
  );
}