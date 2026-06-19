// src/app/(protected)/tenant/favorites/page.jsx
import TenantFavoritesClient from "@/components/dashboard/tenant/TenantFavoritesClient";

export const metadata = { title: "My Favorites — RentEasy" };

export default function TenantFavoritesPage() {
  return <TenantFavoritesClient />;
}