// src/app/(public)/layout.jsx  ← নতুন file বানাও
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}