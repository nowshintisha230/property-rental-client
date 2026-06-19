// src/components/property/AllPropertiesClient.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Chip } from "@heroui/react";
import {
  TbSearch,
  TbFilter,
  TbX,
  TbSortAscending,
  TbSortDescending,
  TbAdjustmentsHorizontal,
  TbRefresh,
} from "react-icons/tb";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";
import { PropertyCardSkeleton } from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import axiosInstance from "@/lib/axios";
import { debounce } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function AllPropertiesClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 1,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    propertyType: searchParams.get("propertyType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "newest",
    page: parseInt(searchParams.get("page")) || 1,
  });

  const [searchInput, setSearchInput] = useState(filters.search);

  // Sync URL params to state on mount
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      location: searchParams.get("location") || "",
      propertyType: searchParams.get("propertyType") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sort: searchParams.get("sort") || "newest",
      page: parseInt(searchParams.get("page")) || 1,
    });
  }, [searchParams]);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== "" && v !== null && v !== undefined) {
          params.append(k, v);
        }
      });
      params.set("limit", "9");

      const res = await axiosInstance.get(`/properties?${params}`);
      setProperties(res.data.data.properties);
      setPagination(res.data.data.pagination);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Update URL when filters change
  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== "" && v !== null && v !== undefined && v !== 1) {
        params.set(k, v);
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    updateURL(newFilters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      handleFilterChange("search", value);
    }, 500),
    [filters]
  );

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const clearFilters = () => {
    const reset = {
      search: "",
      location: "",
      propertyType: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
      page: 1,
    };
    setFilters(reset);
    setSearchInput("");
    router.push(pathname);
  };

  const hasActiveFilters =
    filters.location ||
    filters.propertyType ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.search;

  const activeFilterCount = [
    filters.location,
    filters.propertyType,
    filters.minPrice,
    filters.maxPrice,
    filters.search,
  ].filter(Boolean).length;

  return (
    <div className="section-container py-8 md:py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-heading mb-2">
          All Properties
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {loading
            ? "Loading..."
            : `${pagination.total} properties available`}
        </p>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <TbSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
          <input
            type="text"
            placeholder="Search by title, location, or description..."
            value={searchInput}
            onChange={handleSearchInput}
            className="input-base pl-11 pr-4"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                handleFilterChange("search", "");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <TbX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="input-base w-auto px-3 py-2.5 text-sm cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Filter toggle */}
          <Button
            variant={showFilters ? "solid" : "bordered"}
            color={showFilters ? "primary" : "default"}
            onPress={() => setShowFilters((p) => !p)}
            startContent={<TbAdjustmentsHorizontal className="w-4 h-4" />}
            className="font-medium flex-shrink-0"
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-5">
          {filters.search && (
            <Chip
              onClose={() => {
                setSearchInput("");
                handleFilterChange("search", "");
              }}
              variant="flat"
              color="primary"
              size="sm"
            >
              Search: {filters.search}
            </Chip>
          )}
          {filters.location && (
            <Chip
              onClose={() => handleFilterChange("location", "")}
              variant="flat"
              color="primary"
              size="sm"
            >
              Location: {filters.location}
            </Chip>
          )}
          {filters.propertyType && (
            <Chip
              onClose={() => handleFilterChange("propertyType", "")}
              variant="flat"
              color="primary"
              size="sm"
            >
              Type: {filters.propertyType}
            </Chip>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <Chip
              onClose={() => {
                handleFilterChange("minPrice", "");
                handleFilterChange("maxPrice", "");
              }}
              variant="flat"
              color="primary"
              size="sm"
            >
              Price: ${filters.minPrice || "0"} — ${filters.maxPrice || "∞"}
            </Chip>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
          >
            <TbRefresh className="w-3 h-3" />
            Clear all
          </button>
        </div>
      )}

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <PropertyFilters
              filters={filters}
              onChange={handleFilterChange}
              onClear={clearFilters}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <EmptyState
          type="search"
          title="No Properties Found"
          description="No properties match your current filters. Try adjusting your search criteria."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, i) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <Button
            variant="bordered"
            size="sm"
            isDisabled={filters.page <= 1}
            onPress={() => handlePageChange(filters.page - 1)}
            className="font-medium"
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === pagination.pages ||
                  Math.abs(p - filters.page) <= 1
              )
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) {
                  acc.push("...");
                }
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="px-2 text-gray-400 text-sm"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => handlePageChange(item)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                      item === filters.page
                        ? "bg-blue-500 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
          </div>

          <Button
            variant="bordered"
            size="sm"
            isDisabled={filters.page >= pagination.pages}
            onPress={() => handlePageChange(filters.page + 1)}
            className="font-medium"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}