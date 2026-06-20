// src/components/ui/Navbar.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
} from "@heroui/react";
import {
  TbBuildingEstate,
  TbHome,
  TbBuildingSkyscraper,
  TbLogin,
  TbUserPlus,
  TbLayoutDashboard,
  TbLogout,
  TbUser,
  TbMenu2,
  TbX,
  TbChevronDown,
} from "react-icons/tb";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/", icon: TbHome },
  { label: "Properties", href: "/properties", icon: TbBuildingSkyscraper },
];

const roleColors = {
  admin: "danger",
  owner: "warning",
  tenant: "primary",
};

const roleDashboardPath = {
  admin: "/admin",
  owner: "/owner",
  tenant: "/tenant",
};

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const dashboardPath = user ? roleDashboardPath[user.role] : "/";

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800"
            : "bg-transparent"
        )}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                <TbBuildingEstate className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                RentEasy
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    pathname === link.href
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />

              {/* Auth loading skeleton */}
              {loading ? (
                <div className="w-20 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
              ) : isAuthenticated ? (
                <div className="flex items-center gap-2">
                  {/* Dashboard link */}
                  <Link href={dashboardPath}>
                    <Button
                      variant="light"
                      size="sm"
                      startContent={<TbLayoutDashboard className="w-4 h-4" />}
                      className="font-medium text-gray-700 dark:text-gray-300"
                    >
                      Dashboard
                    </Button>
                  </Link>

                  {/* User dropdown */}
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Avatar
                          src={user?.photo}
                          name={user?.name}
                          size="sm"
                          className="cursor-pointer"
                          isBordered
                          color={roleColors[user?.role] || "primary"}
                        />
                        <div className="text-left hidden lg:block">
                          <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight max-w-[120px] truncate">
                            {user?.name}
                          </p>
                          <Chip
                            size="sm"
                            variant="flat"
                            color={roleColors[user?.role] || "primary"}
                            className="h-4 text-[10px] capitalize"
                          >
                            {user?.role}
                          </Chip>
                        </div>
                        <TbChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="User menu"
                      className="min-w-[200px]"
                      onAction={(key) => {
                        if (key === "profile")
                          router.push(`${dashboardPath}/profile`);
                        if (key === "dashboard") router.push(dashboardPath);
                        if (key === "logout") handleLogout();
                      }}
                    >
                      <DropdownItem
                        key="profile"
                        startContent={<TbUser className="w-4 h-4" />}
                        description={user?.email}
                      >
                        My Profile
                      </DropdownItem>
                      <DropdownItem
                        key="dashboard"
                        startContent={<TbLayoutDashboard className="w-4 h-4" />}
                      >
                        Dashboard
                      </DropdownItem>
                      <DropdownItem
                        key="logout"
                        startContent={<TbLogout className="w-4 h-4" />}
                        color="danger"
                        className="text-danger"
                      >
                        Logout
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              ) : (
                // ✅ Login / Register — Link দিয়ে wrap করা হয়েছে
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button
                      variant="light"
                      size="sm"
                      startContent={<TbLogin className="w-4 h-4" />}
                      className="font-medium text-gray-700 dark:text-gray-300"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="sm"
                      startContent={<TbUserPlus className="w-4 h-4" />}
                      className="font-semibold btn-gradient text-white"
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile: Theme + Menu toggle */}
            <div className="flex md:hidden items-center gap-1">
              <ThemeToggle size="sm" />
              <button
                onClick={() => setIsMenuOpen((o) => !o)}
                className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <TbX className="w-6 h-6" />
                ) : (
                  <TbMenu2 className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 shadow-lg md:hidden"
          >
            <div className="section-container py-4 space-y-1">
              {/* Nav links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
                {loading ? (
                  <div className="px-4 py-3 space-y-2">
                    <div className="w-full h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="w-full h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </div>
                ) : isAuthenticated ? (
                  <>
                    {/* User info */}
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                      <Avatar
                        src={user?.photo}
                        name={user?.name}
                        size="sm"
                        isBordered
                        color={roleColors[user?.role] || "primary"}
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {user?.role}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={dashboardPath}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <TbLayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                    >
                      <TbLogout className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  // ✅ Mobile Login / Register — Link দিয়ে wrap করা হয়েছে
                  <div className="flex flex-col gap-2 px-4">
                    <Link href="/login" className="w-full">
                      <Button
                        variant="bordered"
                        fullWidth
                        startContent={<TbLogin className="w-4 h-4" />}
                        className="font-semibold"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" className="w-full">
                      <Button
                        fullWidth
                        startContent={<TbUserPlus className="w-4 h-4" />}
                        className="font-semibold btn-gradient text-white"
                      >
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}