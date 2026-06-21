// src/app/page.jsx


import Banner from "@/components/home/Banner";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CustomerReviews from "@/components/home/CustomerReviews";
import TopLocations from "@/components/home/TopLocations";
import RecentlyAdded from "@/components/home/RecentlyAdded";
import RentalStatistics from "@/components/home/RentalStatistics";
import TrustedOwners from "@/components/home/TrustedOwners";

export const metadata = {
  title: "RentEasy — Find Your Perfect Home",
  description:
    "Discover and book rental properties with ease. Browse apartments, houses, villas, and more.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
    
      <main>
        <Banner />
        <FeaturedProperties />
        <WhyChooseUs />
        <CustomerReviews />
        <TopLocations />
        <RecentlyAdded />
        <RentalStatistics />
        <TrustedOwners />
      </main>
  
    </div>
  );
}