"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // On mount: read from localStorage or fall back to system preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      const initial =
        stored === "dark" || stored === "light"
          ? stored
          : prefersDark
            ? "dark"
            : "light";

      setTheme(initial);
    } catch {
      setTheme("light");
    }
    setMounted(true);
  }, []);

  // Whenever theme changes: apply class to <html> and persist
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* ignore quota / private mode errors */
    }
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setThemeMode = useCallback((mode) => {
    if (mode === "dark" || mode === "light") setTheme(mode);
  }, []);

  const value = {
    theme,
    isDark: theme === "dark",
    toggleTheme,
    setThemeMode,
    mounted,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export default ThemeContext;