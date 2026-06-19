// src/app/layout.jsx
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: {
    default: "RentEasy — Find Your Perfect Home",
    template: "%s | RentEasy",
  },
  description:
    "Discover and book rental properties with ease. Browse apartments, houses, villas, and more. Connect with trusted property owners.",
  keywords: [
    "property rental",
    "rent home",
    "apartments for rent",
    "house rental",
    "booking platform",
  ],
  authors: [{ name: "RentEasy Team" }],
  openGraph: {
    title: "RentEasy — Find Your Perfect Home",
    description:
      "Discover and book rental properties with ease.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}