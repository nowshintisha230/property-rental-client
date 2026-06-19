// src/app/(protected)/owner/my-properties/page.jsx
import MyPropertiesClient from "@/components/dashboard/owner/MyPropertiesClient";

export const metadata = { title: "My Properties — RentEasy" };

export default function MyPropertiesPage() {
  return <MyPropertiesClient />;
}