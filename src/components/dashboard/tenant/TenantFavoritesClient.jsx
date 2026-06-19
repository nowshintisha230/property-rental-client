// src/components/dashboard/tenant/TenantFavoritesClient.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Tooltip } from "@heroui/react";
import {
  TbHeart,
  TbHeartOff,
  TbExternalLink,
  TbMapPin,
  TbBed,
  TbBath,
  TbCurrencyDollar,
  TbRefresh,
  TbHome,
  TbStar,
} from "react-icons/tb";
import axiosInstance from "@/lib/axios";
import EmptyState from "@/components/ui/EmptyState";
import { PropertyCardSkeleton } from "@/components/ui/SkeletonCard";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

export default function TenantFavoritesClient() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 1,
  });

  const fetchFavorites = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/favorites?page=${page}&limit=9`
      );
      setFavorites(res.data.data.favorites || []);
      setPagination(res.data.data.pagination);
    } catch {
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemoveFavorite = async (propertyId, favId) => {
    setRemovingId(favId);
    try {
      await axiosInstance.delete(`/favorites/${propertyId}`);
      setFavorites((prev) => prev.filter((f) => f._id !== favId));
      setPagination((p) => ({ ...p, total: p.total - 1 }));
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to remove favorite"
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">My Favorites</h1>
          <p className="page-description">
            {loading
              ? "Loading..."
              : `${pagination.total} saved propert${pagination.total !== 1 ? "ies" : "y"}`}
          </p>
        </div>
        <Button
          variant="bordered"
          size="sm"
          startContent={<TbRefresh className="w-4 h-4" />}
          onPress={() => fetchFavorites()}
          className="font-medium"
        >
          Refresh
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          type="favorites"
          title="No Favorites Yet"
          description="You have not saved any properties yet. Browse properties and tap the heart icon to save them here."
          actionLabel="Browse Properties"
          actionHref="/properties"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {favorites.map((fav, i) => {
                const property = fav.propertyId;
                if (!property) return null;

                const image =
                  property.images?.[0] ||
                  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80";

                return (
                  <motion.div
                    key={fav._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="card-base overflow-hidden group"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={image}
                        alt={property.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Overlay: remove + view */}
                      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip content="Remove from favorites">
                          <button
                            onClick={() =>
                              handleRemoveFavorite(property._id, fav._id)
                            }
                            disabled={removingId === fav._id}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition-colors disabled:opacity-50"
                          >
                            {removingId === fav._id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <TbHeartOff className="w-4 h-4" />
                            )}
                          </button>
                        </Tooltip>
                        <Tooltip content="View property">
                          <Link
                            href={`/properties/${property._id}`}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md transition-colors"
                          >
                            <TbExternalLink className="w-4 h-4" />
                          </Link>
                        </Tooltip>
                      </div>

                      {/* Status chip */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            property.status === "approved"
                              ? "bg-green-500 text-white"
                              : "bg-yellow-500 text-white"
                          }`}
                        >
                          {property.status}
                        </span>
                      </div>

                      {/* Price overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-white font-bold text-base font-heading">
                          {formatCurrency(property.price)}
                          <span className="text-gray-300 text-xs font-normal ml-1">
                            {property.rentType}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 mb-1 font-heading">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs mb-3">
                        <TbMapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>

                      {/* Specs row */}
                      <div className="flex items-center gap-3 py-2 border-t border-gray-100 dark:border-gray-800 mb-3">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <TbBed className="w-3.5 h-3.5 text-blue-500" />
                          <span>{property.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <TbBath className="w-3.5 h-3.5 text-blue-500" />
                          <span>{property.bathrooms} Baths</span>
                        </div>
                        {property.averageRating > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 ml-auto">
                            <TbStar className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span>{property.averageRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          as={Link}
                          href={`/properties/${property._id}`}
                          size="sm"
                          className="flex-1 font-semibold btn-gradient text-white text-xs"
                          startContent={<TbExternalLink className="w-3.5 h-3.5" />}
                        >
                          View Property
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="bordered"
                          color="danger"
                          isLoading={removingId === fav._id}
                          onPress={() =>
                            handleRemoveFavorite(property._id, fav._id)
                          }
                          className="border-red-200 dark:border-red-800"
                        >
                          <TbHeartOff className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                size="sm"
                variant="bordered"
                isDisabled={pagination.page <= 1}
                onPress={() => fetchFavorites(pagination.page - 1)}
                className="font-medium"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500 dark:text-gray-400 px-2">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                size="sm"
                variant="bordered"
                isDisabled={pagination.page >= pagination.pages}
                onPress={() => fetchFavorites(pagination.page + 1)}
                className="font-medium"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}