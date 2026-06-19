// src/providers/Providers.jsx
"use client";

import { HeroUIProvider } from "@heroui/react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function HeroUIWithTheme({ children }) {
  const { theme } = useTheme();
  return (
    <HeroUIProvider>
      {children}
    </HeroUIProvider>
  );
}

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HeroUIWithTheme>
          {children}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              className: "toast-custom",
              duration: 4000,
              style: {
                background: "var(--toast-bg, #fff)",
                color: "var(--toast-color, #1f2937)",
                border: "1px solid var(--toast-border, #e5e7eb)",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow:
                  "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </HeroUIWithTheme>
      </AuthProvider>
    </ThemeProvider>
  );
}