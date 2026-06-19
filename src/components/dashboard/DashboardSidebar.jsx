// src/components/dashboard/DashboardSidebar.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, Button, Chip } from "@heroui/react";
import {
  TbHome,
  TbBuildingSkyscraper,
  TbCalendarEvent,
  TbHeart,
  TbUser,
  TbPlus,
  TbList,
  TbClipboardList,
  TbUsers,
  TbShieldCheck,
  TbReceipt,
  TbLogout,
  TbChevronLeft,
  TbChevronRight,
  TbLayoutDashboard,
  TbBuildingEstate,
} from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const sidebarConfig = {
  tenant: {
    label: "Tenant",
    color: "primary",
    links: [
      { label: "My Bookings", href: "/tenant/bookings", icon: TbCalendarEvent },
      { label: "Favorites", href: "/tenant/favorites", icon: TbHeart },
      { label: "Profile", href: "/tenant/profile", icon: TbUser },
    ],
  },
  owner: {
    label: "Owner",
    color: "warning",
    links: [
      { label: "Dashboard", href: "/owner", icon: TbLayoutDashboard },
      { label: "Add Property", href: "/owner/add-property", icon: TbPlus },
      { label: "My Properties", href: "/owner/my-properties", icon: TbList },
      {
        label: "Booking Requests",
        href: "/owner/booking-requests",
        icon: TbClipboardList,
      },
      { label: "Profile", href: "/owner/profile", icon: TbUser },
    ],
  },
  admin: {
    label: "Admin",
    color: "danger",
    links: [
      { label: "All Users", href: "/admin/users", icon: TbUsers },
      {
        label: "All Properties",
        href: "/admin/properties",
        icon: TbBuildingSkyscraper,
      },
      {
        label: "All Bookings",
        href: "/admin/bookings",
        icon: TbCalendarEvent,
      },
      { label: "Transactions", href: "/admin/transactions", icon: TbReceipt },
      { label: "Profile", href: "/admin/profile", icon: TbUser },
    ],
  },
};

export default function DashboardSidebar({ role }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const config = sidebarConfig[role] || sidebarConfig.tenant;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-[calc(100vh-64px)] sticky top-16 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 dashboard-scroll overflow-y-auto",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
      >
        {collapsed ? (
          <TbChevronRight className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
        ) : (
          <TbChevronLeft className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      <div className="flex flex-col h-full p-3">
        {/* User profile summary */}
        <div
          className={cn(
            "flex items-center gap-3 p-3 mb-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50",
            collapsed && "justify-center p-2"
          )}
        >
          <Avatar
            src={user?.photo}
            name={user?.name}
            size="sm"
            isBordered
            color={config.color}
            className="flex-shrink-0"
          />
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <Chip
                size="sm"
                variant="flat"
                color={config.color}
                className="h-4 text-[10px] capitalize mt-0.5"
              >
                {config.label}
              </Chip>
            </div>
          )}
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1">
          {!collapsed && (
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
              Navigation
            </p>
          )}
          {config.links.map((link) => {
            const isActive =
              link.href === `/${role}`
                ? pathname === link.href
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "sidebar-link",
                  isActive && "active",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? link.label : undefined}
              >
                <link.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                />
                {!collapsed && (
                  <span className="truncate">{link.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-1">
          <Link
            href="/"
            className={cn(
              "sidebar-link",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? "Home" : undefined}
          >
            <TbHome className="w-5 h-5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
            {!collapsed && <span>Back to Home</span>}
          </Link>
          <button
            onClick={handleLogout}
            className={cn(
              "sidebar-link w-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? "Logout" : undefined}
          >
            <TbLogout className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}