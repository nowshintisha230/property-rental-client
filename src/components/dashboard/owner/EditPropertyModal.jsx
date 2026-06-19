// src/components/dashboard/owner/EditPropertyModal.jsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

const PROPERTY_TYPES = [
  "Apartment","House","Villa","Studio",
  "Condo","Townhouse","Office","Warehouse",
];
const RENT_TYPES = ["per month", "per week", "per day"];

export default function EditPropertyModal({ property, onClose, onUpdated }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        description: property.description,
        location: property.location,
        propertyType: property.propertyType,
        price: property.price,
        rentType: property.rentType,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        size: property.size,
        extraFeatures: property.extraFeatures || "",
      });
    }
  }, [property, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.put(`/properties/${property._id}`, {
        ...data,
        price: parseFloat(data.price),
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseInt(data.bathrooms),
        size: parseFloat(data.size),
      });
      onUpdated(res.data.data.property);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update property"
      );
    }
  };

  return (
    <Modal
      isOpen={!!property}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        backdrop: "backdrop-blur-sm",
        base: "card-base",
      }}
    >
      <ModalContent>
        <ModalHeader className="font-heading text-xl border-b border-gray-100 dark:border-gray-800 pb-4">
          Edit Property
        </ModalHeader>

        <ModalBody className="py-6">
          <form id="edit-property-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Title *
              </label>
              <input
                type="text"
                {...register("title", {
                  required: "Title is required",
                  minLength: { value: 10, message: "Min 10 characters" },
                })}
                className={`input-base ${errors.title ? "border-red-400" : ""}`}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Description *
              </label>
              <textarea
                rows={4}
                {...register("description", {
                  required: "Description is required",
                  minLength: { value: 30, message: "Min 30 characters" },
                })}
                className={`input-base resize-none ${
                  errors.description ? "border-red-400" : ""
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Location *
              </label>
              <input
                type="text"
                {...register("location", { required: "Location is required" })}
                className={`input-base ${errors.location ? "border-red-400" : ""}`}
              />
              {errors.location && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Type + Rent Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Property Type *
                </label>
                <select
                  {...register("propertyType", { required: "Required" })}
                  className="input-base cursor-pointer"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Rent Type *
                </label>
                <select
                  {...register("rentType", { required: "Required" })}
                  className="input-base cursor-pointer"
                >
                  {RENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price + Size */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Price ($) *
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("price", { required: "Required", min: 0 })}
                  className="input-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  {...register("bedrooms", { required: "Required" })}
                  className="input-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  {...register("bathrooms", { required: "Required" })}
                  className="input-base"
                />
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Size (sqft) *
              </label>
              <input
                type="number"
                min="1"
                {...register("size", { required: "Required", min: 1 })}
                className="input-base"
              />
            </div>

            {/* Extra Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Extra Features
              </label>
              <textarea
                rows={2}
                {...register("extraFeatures")}
                className="input-base resize-none"
                placeholder="Any additional features or notes..."
              />
            </div>
          </form>
        </ModalBody>

        <ModalFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
          <Button
            variant="bordered"
            onPress={onClose}
            className="font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-property-form"
            isLoading={isSubmitting}
            className="font-semibold btn-gradient text-white"
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}