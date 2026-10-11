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
  TbSun,
  TbMoon,
  TbSparkles,
  TbMapPin,
} from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/", icon: TbHome },
  { label: "Properties", href: "/properties", icon: TbBuildingSkyscraper },
  { label: "Why RentEasy", href: "/#why-renteasy", icon: TbSparkles },
  { label: "Locations", href: "/#locations", icon: TbMapPin },
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
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const dashboardPath = user?.role
    ? roleDashboardPath[user.role] ?? "/"
    : "/";

  // Active state helper — handles hash links too
  const isLinkActive = (href) => {
    if (href.startsWith("/#")) {
      return pathname === "/" && false; // hashes don't map to pathname, skip
    }
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Smooth-scroll handler for in-page anchors
  const handleHashLink = (e, href) => {
    if (!href.startsWith("/#")) return;
    const id = href.slice(2);
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setIsMenuOpen(false);
      }
    }
  };

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

            {/* ===== LOGO ===== */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                <TbBuildingEstate className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                RentEasy
              </span>
            </Link>

            {/* ===== DESKTOP NAV LINKS ===== */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleHashLink(e, link.href)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      active
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* ===== DESKTOP RIGHT SIDE ===== */}
            <div className="hidden md:flex items-center gap-2">

              {/* DARK MODE TOGGLE — DESKTOP */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <AnimatePresence mode="wait">
                    {isDark ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TbSun className="w-5 h-5 text-yellow-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TbMoon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              )}

              {/* Authenticated user */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Button
                    as={Link}
                    href={dashboardPath}
                    variant="light"
                    size="sm"
                    startContent={<TbLayoutDashboard className="w-4 h-4" />}
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Dashboard
                  </Button>

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
                    <DropdownMenu aria-label="User menu">
                      <DropdownItem
                        key="profile"
                        startContent={<TbUser className="w-4 h-4" />}
                        onPress={() => router.push(`${dashboardPath}/profile`)}
                        description={user?.email}
                      >
                        My Profile
                      </DropdownItem>
                      <DropdownItem
                        key="dashboard"
                        startContent={<TbLayoutDashboard className="w-4 h-4" />}
                        onPress={() => router.push(dashboardPath)}
                      >
                        Dashboard
                      </DropdownItem>
                      <DropdownItem
                        key="logout"
                        startContent={<TbLogout className="w-4 h-4" />}
                        color="danger"
                        className="text-danger"
                        onPress={handleLogout}
                      >
                        Logout
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    as={Link}
                    href="/login"
                    variant="light"
                    size="sm"
                    startContent={<TbLogin className="w-4 h-4" />}
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Login
                  </Button>
                  <Button
                    as={Link}
                    href="/register"
                    size="sm"
                    startContent={<TbUserPlus className="w-4 h-4" />}
                    className="font-semibold btn-gradient text-white"
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>

            {/* ===== MOBILE RIGHT SIDE ===== */}
            <div className="flex md:hidden items-center gap-1">

              {/* DARK MODE TOGGLE — MOBILE */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  {isDark ? (
                    <TbSun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <TbMoon className="w-5 h-5" />
                  )}
                </button>
              )}

              {/* Hamburger menu */}
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

      {/* ===== MOBILE MENU ===== */}
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
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleHashLink(e, link.href)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      active
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}

              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
                {isAuthenticated ? (
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

                    {/* Dark mode toggle in mobile menu */}
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 w-full"
                    >
                      {isDark ? (
                        <>
                          <TbSun className="w-5 h-5 text-yellow-500" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <TbMoon className="w-5 h-5" />
                          Dark Mode
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                    >
                      <TbLogout className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {/* Dark mode toggle for non-authenticated mobile */}
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 w-full mb-2"
                    >
                      {isDark ? (
                        <>
                          <TbSun className="w-5 h-5 text-yellow-500" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <TbMoon className="w-5 h-5" />
                          Dark Mode
                        </>
                      )}
                    </button>

                    <div className="flex flex-col gap-2 px-4">
                      <Button
                        as={Link}
                        href="/login"
                        variant="bordered"
                        fullWidth
                        startContent={<TbLogin className="w-4 h-4" />}
                        className="font-semibold"
                      >
                        Login
                      </Button>
                      <Button
                        as={Link}
                        href="/register"
                        fullWidth
                        startContent={<TbUserPlus className="w-4 h-4" />}
                        className="font-semibold btn-gradient text-white"
                      >
                        Register
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu backdrop */}
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