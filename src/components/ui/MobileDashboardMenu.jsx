// src/components/ui/MobileDashboardMenu.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  TbCalendarEvent,
  TbHeart,
  TbUser,
  TbLayoutDashboard,
  TbPlus,
  TbList,
  TbClipboardList,
  TbUsers,
  TbBuildingSkyscraper,
  TbReceipt,
} from "react-icons/tb";
import { cn } from "@/lib/utils";

const navConfig = {
  tenant: [
    {
      label: "Bookings",
      href: "/tenant/bookings",
      icon: TbCalendarEvent,
    },
    {
      label: "Favorites",
      href: "/tenant/favorites",
      icon: TbHeart,
    },
    {
      label: "Profile",
      href: "/tenant/profile",
      icon: TbUser,
    },
  ],
  owner: [
    {
      label: "Dashboard",
      href: "/owner",
      icon: TbLayoutDashboard,
    },
    {
      label: "Add",
      href: "/owner/add-property",
      icon: TbPlus,
    },
    {
      label: "Properties",
      href: "/owner/my-properties",
      icon: TbList,
    },
    {
      label: "Bookings",
      href: "/owner/booking-requests",
      icon: TbClipboardList,
    },
    {
      label: "Profile",
      href: "/owner/profile",
      icon: TbUser,
    },
  ],
  admin: [
    {
      label: "Users",
      href: "/admin/users",
      icon: TbUsers,
    },
    {
      label: "Properties",
      href: "/admin/properties",
      icon: TbBuildingSkyscraper,
    },
    {
      label: "Bookings",
      href: "/admin/bookings",
      icon: TbCalendarEvent,
    },
    {
      label: "Transactions",
      href: "/admin/transactions",
      icon: TbReceipt,
    },
    {
      label: "Profile",
      href: "/admin/profile",
      icon: TbUser,
    },
  ],
};

export default function MobileDashboardMenu() {
  const { user } = useAuth();
  const pathname = usePathname();

  const role = user?.role;
  const links = navConfig[role] || [];

  if (!links.length) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-lg">
      <div className="flex items-center justify-around px-2 py-1">
        {links.map((link) => {
          // Active state detection
          const isActive =
            link.href === `/${role}`
              ? pathname === link.href
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl min-w-0 flex-1 transition-all duration-200",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              {/* Icon container */}
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "bg-transparent"
                )}
              >
                <link.icon
                  className={cn(
                    "w-5 h-5",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                />
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-medium leading-none",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Safe area for iOS home indicator */}
      <div className="h-safe-area-inset-bottom bg-white dark:bg-gray-900" />
    </nav>
  );
}