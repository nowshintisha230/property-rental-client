// src/app/layout.jsx
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import DarkModeScript from "@/components/ui/DarkModeScript";

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
    "Discover and book rental properties with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* ← এটা flash রোধ করে */}
        <DarkModeScript />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}