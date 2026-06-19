// src/components/property/PropertyFilters.jsx
"use client";

import { Button } from "@heroui/react";
import { TbRefresh } from "react-icons/tb";

const PROPERTY_TYPES = [
  "Apartment","House","Villa","Studio",
  "Condo","Townhouse","Office","Warehouse",
];

export default function PropertyFilters({ filters, onChange, onClear }) {
  return (
    <div className="card-base p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Filter Properties
        </h3>
        <Button
          variant="light"
          size="sm"
          startContent={<TbRefresh className="w-4 h-4" />}
          onPress={onClear}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium text-xs"
        >
          Reset All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Location */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Location
          </label>
          <input
            type="text"
            placeholder="Enter city or area"
            value={filters.location}
            onChange={(e) => onChange("location", e.target.value)}
            className="input-base text-sm py-2"
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Property Type
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => onChange("propertyType", e.target.value)}
            className="input-base text-sm py-2 cursor-pointer"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Min Price ($/month)
          </label>
          <input
            type="number"
            placeholder="0"
            min="0"
            value={filters.minPrice}
            onChange={(e) => onChange("minPrice", e.target.value)}
            className="input-base text-sm py-2"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Max Price ($/month)
          </label>
          <input
            type="number"
            placeholder="Any"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => onChange("maxPrice", e.target.value)}
            className="input-base text-sm py-2"
          />
        </div>
      </div>

      {/* Property Type quick select pills */}
      <div className="mt-4">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quick Type Select
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onChange("propertyType", "")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              !filters.propertyType
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            All
          </button>
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t}
              onClick={() =>
                onChange(
                  "propertyType",
                  filters.propertyType === t ? "" : t
                )
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filters.propertyType === t
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}