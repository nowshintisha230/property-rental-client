// src/components/ui/EmptyState.jsx
import { Button } from "@heroui/react";
import Link from "next/link";
import {
  TbBuildingSkyscraper,
  TbCalendarOff,
  TbHeartOff,
  TbUsersOff,
  TbReceiptOff,
  TbSearch,
} from "react-icons/tb";

const icons = {
  properties: TbBuildingSkyscraper,
  bookings: TbCalendarOff,
  favorites: TbHeartOff,
  users: TbUsersOff,
  transactions: TbReceiptOff,
  search: TbSearch,
};

export default function EmptyState({
  type = "properties",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}) {
  const Icon = icons[type] || TbBuildingSkyscraper;

  const defaults = {
    properties: {
      title: "No Properties Found",
      description:
        "There are no properties matching your criteria. Try adjusting your filters.",
    },
    bookings: {
      title: "No Bookings Yet",
      description:
        "You have not made any bookings yet. Start exploring properties to find your perfect home.",
    },
    favorites: {
      title: "No Favorites Yet",
      description:
        "You have not added any properties to your favorites. Browse properties and save the ones you love.",
    },
    users: {
      title: "No Users Found",
      description: "No users match your search criteria.",
    },
    transactions: {
      title: "No Transactions Found",
      description: "No transactions have been recorded yet.",
    },
    search: {
      title: "No Results Found",
      description:
        "We could not find what you are looking for. Try different keywords.",
    },
  };

  const displayTitle = title || defaults[type]?.title || "Nothing Here";
  const displayDescription =
    description ||
    defaults[type]?.description ||
    "No items to display.";

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-5 rounded-full bg-gray-100 dark:bg-gray-800 mb-5">
        <Icon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-heading">
        {displayTitle}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
        {displayDescription}
      </p>
      {actionLabel && (actionHref || onAction) && (
        <>
          {actionHref ? (
            <Button
              as={Link}
              href={actionHref}
              color="primary"
              className="font-semibold btn-gradient"
            >
              {actionLabel}
            </Button>
          ) : (
            <Button
              onPress={onAction}
              color="primary"
              className="font-semibold btn-gradient"
            >
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
}