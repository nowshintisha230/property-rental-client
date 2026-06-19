// src/components/property/PropertyCard.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Chip } from "@heroui/react";
import {
  TbMapPin,
  TbBed,
  TbBath,
  TbRuler,
  TbStar,
  TbHeart,
  TbArrowRight,
  TbEye,
} from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency, truncateText } from "@/lib/utils";

export default function PropertyCard({ property }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleViewDetails = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/properties/${property._id}`);
      return;
    }
    router.push(`/properties/${property._id}`);
  };

  const primaryImage =
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card-base overflow-hidden group h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={primaryImage}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Chip
            size="sm"
            className="bg-blue-600 text-white text-xs font-semibold shadow-sm"
          >
            {property.propertyType}
          </Chip>
        </div>

        {/* Rating badge */}
        {property.averageRating > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
            <TbStar className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-semibold">
              {property.averageRating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Price overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-white font-bold text-lg font-heading">
            {formatCurrency(property.price)}
            <span className="text-gray-300 text-sm font-normal ml-1">
              {property.rentType}
            </span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1.5 font-heading line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mb-3">
          <TbMapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 flex-1">
          {truncateText(property.description, 90)}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-4 py-3 border-t border-gray-100 dark:border-gray-800 mb-4">
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-xs">
            <TbBed className="w-4 h-4 text-blue-500" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-xs">
            <TbBath className="w-4 h-4 text-blue-500" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-xs">
            <TbRuler className="w-4 h-4 text-blue-500" />
            <span>{property.size} sqft</span>
          </div>
        </div>

        {/* CTA */}
        <Button
          fullWidth
          size="sm"
          endContent={<TbArrowRight className="w-4 h-4" />}
          onPress={handleViewDetails}
          className="font-semibold btn-gradient text-white"
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
}