// src/providers/Providers.jsx
"use client";

import { HeroUIProvider } from "@heroui/react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ScrollToTop from "@/components/ui/ScrollToTop";

function HeroUIWithTheme({ children }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HeroUIWithTheme>
          {children}
          <ScrollToTop />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: "500",
              },
            }}
          />
        </HeroUIWithTheme>
      </AuthProvider>
    </ThemeProvider>
  );
}