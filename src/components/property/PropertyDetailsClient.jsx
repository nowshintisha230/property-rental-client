// src/components/property/PropertyDetailsClient.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button, Avatar, Chip, Divider } from "@heroui/react";
import {
  TbMapPin, TbBed, TbBath, TbRuler, TbStar,
  TbHeart, TbHeartFilled, TbShare, TbCalendar,
  TbUser, TbPhone, TbChevronLeft, TbChevronRight,
  TbCheck, TbArrowLeft,
} from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";
import BookingModal from "./BookingModal";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import ShareProperty from "@/components/ui/ShareProperty";
import toast from "react-hot-toast";
import Link from "next/link";

export default function PropertyDetailsClient({ id }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [hasBooking, setHasBooking] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosInstance
      .get(`/properties/${id}`)
      .then((res) => setProperty(res.data.data.property))
      .catch(() => router.push("/not-found"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    axiosInstance
      .get(`/reviews/${id}`)
      .then((res) => {
        setReviews(res.data.data.reviews || []);
      })
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || !id || user?.role !== "tenant") return;

    // Check favorite status
    axiosInstance
      .get(`/favorites/check/${id}`)
      .then((res) => setIsFavorite(res.data.data.isFavorite))
      .catch(() => {});

    // Check if tenant has approved booking
    axiosInstance
      .get("/bookings/tenant")
      .then((res) => {
        const bookings = res.data.data.bookings || [];
        const approved = bookings.find(
          (b) =>
            b.propertyId?._id === id && b.status === "approved"
        );
        setHasBooking(!!approved);
      })
      .catch(() => {});
  }, [isAuthenticated, id, user]);

  useEffect(() => {
    if (reviews.length > 0 && user) {
      const alreadyReviewed = reviews.some(
        (r) =>
          r.tenantId?._id === user._id ||
          r.tenantId === user._id
      );
      setHasReviewed(alreadyReviewed);
    }
  }, [reviews, user]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/properties/${id}`);
      return;
    }
    if (user?.role !== "tenant") {
      toast.error("Only tenants can save favorites");
      return;
    }
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await axiosInstance.delete(`/favorites/${id}`);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await axiosInstance.post("/favorites", { propertyId: id });
        setIsFavorite(true);
        toast.success("Added to favorites!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/properties/${id}`);
      return;
    }
    if (user?.role !== "tenant") {
      toast.error("Only tenants can book properties");
      return;
    }
    setIsBookingOpen(true);
  };

  const handleReviewSubmitted = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
    setHasReviewed(true);
    // Refresh property to get updated rating
    axiosInstance.get(`/properties/${id}`).then((res) => {
      setProperty(res.data.data.property);
    });
  };

  const prevImage = () =>
    setCurrentImage((p) =>
      p === 0 ? (property?.images?.length || 1) - 1 : p - 1
    );
  const nextImage = () =>
    setCurrentImage((p) =>
      p === (property?.images?.length || 1) - 1 ? 0 : p + 1
    );

  if (loading) {
    return (
      <div className="section-container py-12">
        <div className="animate-pulse space-y-6">
          <div className="skeleton h-96 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="skeleton h-8 w-3/4 rounded-xl" />
              <div className="skeleton h-4 w-1/2 rounded-xl" />
              <div className="skeleton h-32 rounded-xl" />
            </div>
            <div className="skeleton h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const images = property.images || [];
  const isOwner = user?._id === property.ownerId?._id;

  return (
    <div className="section-container py-8">
      {/* Back button */}
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6 group"
      >
        <TbArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Properties
      </Link>

      {/* Image Gallery */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gray-100 dark:bg-gray-800">
        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
          {images.length > 0 ? (
            <Image
              src={images[currentImage]}
              alt={`${property.title} - image ${currentImage + 1}`}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-400">No images available</p>
            </div>
          )}

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all"
              >
                <TbChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all"
              >
                <TbChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentImage
                        ? "bg-white w-6"
                        : "bg-white/50 w-1.5"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Status badge */}
          <div className="absolute top-4 left-4">
            <span className={getStatusBadgeClass(property.status)}>
              {property.status}
            </span>
          </div>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg">
              {currentImage + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`relative flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  i === currentImage
                    ? "border-blue-500 shadow-glow"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`thumbnail ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title + actions */}
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Chip color="primary" variant="flat" size="sm">
                    {property.propertyType}
                  </Chip>
                  <Chip color="default" variant="flat" size="sm">
                    {property.rentType}
                  </Chip>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-heading">
                  {property.title}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <ShareProperty
                  propertyId={id}
                  propertyTitle={property.title}
                />
                {!isOwner && (
                  <Button
                    isIconOnly
                    variant="bordered"
                    size="sm"
                    isLoading={favoriteLoading}
                    onPress={handleFavoriteToggle}
                    className={
                      isFavorite ? "text-red-500 border-red-200" : ""
                    }
                  >
                    {isFavorite ? (
                      <TbHeartFilled className="w-5 h-5 text-red-500" />
                    ) : (
                      <TbHeart className="w-5 h-5" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Location + Rating */}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <TbMapPin className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{property.location}</span>
              </div>
              {property.averageRating > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TbStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(property.averageRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {property.averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-400">
                    ({property.totalReviews} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Key specs */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: TbBed, label: "Bedrooms", value: property.bedrooms },
              { icon: TbBath, label: "Bathrooms", value: property.bathrooms },
              {
                icon: TbRuler,
                label: "Size",
                value: `${property.size} sqft`,
              },
            ].map((spec) => (
              <div
                key={spec.label}
                className="card-base p-4 text-center"
              >
                <spec.icon className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                  {spec.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {spec.label}
                </p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-heading mb-3">
              About This Property
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm whitespace-pre-line">
              {property.description}
            </p>
            {property.extraFeatures && (
              <>
                <Divider className="my-4" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Extra Features
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {property.extraFeatures}
                </p>
              </>
            )}
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-heading mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20"
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <TbCheck className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews section */}
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-heading mb-6">
              Reviews
              {property.totalReviews > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({property.totalReviews})
                </span>
              )}
            </h2>

            {/* Review form — only for tenants with approved booking */}
            {isAuthenticated &&
              user?.role === "tenant" &&
              hasBooking &&
              !hasReviewed && (
                <div className="mb-6">
                  <ReviewForm
                    propertyId={id}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                  <Divider className="mt-6" />
                </div>
              )}

            {hasReviewed && (
              <div className="mb-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                  ✓ You have already reviewed this property.
                </p>
              </div>
            )}

            <ReviewList
              reviews={reviews}
              loading={reviewsLoading}
              averageRating={property.averageRating}
            />
          </div>
        </div>

        {/* Right: Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Price card */}
            <div className="card-base p-6">
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white font-heading">
                  {formatCurrency(property.price)}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  / {property.rentType}
                </span>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Property Type
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {property.propertyType}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Rent Period
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {property.rentType}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Bedrooms
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {property.bedrooms}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Listed
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(property.createdAt)}
                  </span>
                </div>
              </div>

              {!isOwner && property.status === "approved" && (
                <Button
                  fullWidth
                  size="lg"
                  onPress={handleBookNow}
                  startContent={<TbCalendar className="w-5 h-5" />}
                  className="font-bold btn-gradient text-white"
                >
                  Book Now
                </Button>
              )}
              {isOwner && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    This is your property
                  </p>
                </div>
              )}
              {property.status !== "approved" && !isOwner && (
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This property is not available for booking
                  </p>
                </div>
              )}
            </div>

            {/* Owner info card */}
            <div className="card-base p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Property Owner
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <Avatar
                  src={property.ownerId?.photo}
                  name={
                    property.ownerInfo?.name || property.ownerId?.name
                  }
                  size="md"
                  isBordered
                  color="primary"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {property.ownerInfo?.name || property.ownerId?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Property Owner
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {property.ownerInfo?.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <TbUser className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="truncate">
                      {property.ownerInfo.email}
                    </span>
                  </div>
                )}
                {property.ownerInfo?.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <TbPhone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span>{property.ownerInfo.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        property={property}
      />
    </div>
  );
}