// src/components/dashboard/owner/AddPropertyClient.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button, Chip } from "@heroui/react";
import {
  TbHome,
  TbMapPin,
  TbCurrencyDollar,
  TbBed,
  TbBath,
  TbRuler,
  TbPhoto,
  TbTrash,
  TbUpload,
  TbCheck,
  TbPlus,
  TbUser,
  TbMail,
  TbPhone,
  TbAlertCircle,
} from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { uploadImageToImgBB } from "@/lib/utils";
import toast from "react-hot-toast";

const PROPERTY_TYPES = [
  "Apartment","House","Villa","Studio",
  "Condo","Townhouse","Office","Warehouse",
];

const RENT_TYPES = ["per month", "per week", "per day"];

const ALL_AMENITIES = [
  "WiFi","Air Conditioning","Heating","Parking",
  "Swimming Pool","Gym","Laundry","Dishwasher",
  "Pet Friendly","Balcony","Garden","Security",
  "Elevator","Furnished","TV Cable",
];

// Reusable icon wrapper — guarantees no overlap regardless of global input styles
function InputIcon({ icon: Icon }) {
  return (
    <span className="absolute left-0 top-0 h-full flex items-center pl-3.5 pointer-events-none z-10">
      <Icon className="w-5 h-5 text-gray-400" />
    </span>
  );
}

const iconInputStyle = { paddingLeft: "2.75rem" };

function StepIndicator({ step, currentStep, label }) {
  const done = currentStep > step;
  const active = currentStep === step;
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
          done
            ? "bg-green-500 text-white"
            : active
            ? "bg-blue-500 text-white shadow-glow"
            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
        }`}
      >
        {done ? <TbCheck className="w-4 h-4" /> : step}
      </div>
      <span
        className={`text-sm font-medium hidden sm:block ${
          active
            ? "text-blue-600 dark:text-blue-400"
            : done
            ? "text-green-600 dark:text-green-400"
            : "text-gray-400 dark:text-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default function AddPropertyClient() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]); // { file, url, uploading }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      propertyType: "",
      price: "",
      rentType: "per month",
      bedrooms: "",
      bathrooms: "",
      size: "",
      extraFeatures: "",
      ownerName: user?.name || "",
      ownerEmail: user?.email || "",
      ownerPhone: "",
    },
  });

  // Step validation fields
  const stepFields = {
    1: ["title", "description", "location", "propertyType"],
    2: ["price", "rentType", "bedrooms", "bathrooms", "size"],
    3: [], // amenities + images — validated manually
    4: ["ownerName", "ownerEmail"],
  };

  const handleNextStep = async () => {
    const fields = stepFields[step];
    const valid = await trigger(fields);
    if (!valid) return;

    if (step === 3 && images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    setStep((s) => s + 1);
  };

  const toggleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = 10 - images.length;
    const toUpload = files.slice(0, remaining);

    if (files.length > remaining) {
      toast.error(`Maximum 10 images allowed. Adding first ${remaining}.`);
    }

    // Add placeholders
    const placeholders = toUpload.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
      uploading: true,
      uploaded: false,
    }));
    setImages((prev) => [...prev, ...placeholders]);

    // Upload each
    for (const placeholder of placeholders) {
      try {
        const url = await uploadImageToImgBB(placeholder.file);
        setImages((prev) =>
          prev.map((img) =>
            img.id === placeholder.id
              ? { ...img, url, uploading: false, uploaded: true }
              : img
          )
        );
      } catch {
        setImages((prev) =>
          prev.map((img) =>
            img.id === placeholder.id
              ? { ...img, uploading: false, error: true }
              : img
          )
        );
        toast.error(`Failed to upload ${placeholder.file.name}`);
      }
    }
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const onSubmit = async (data) => {
    if (step !== 4) return;
    const uploadedImages = images.filter((img) => img.uploaded);
    if (uploadedImages.length === 0) {
      toast.error("Please wait for images to finish uploading");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: data.title.trim(),
        description: data.description.trim(),
        location: data.location.trim(),
        propertyType: data.propertyType,
        price: parseFloat(data.price),
        rentType: data.rentType,
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseInt(data.bathrooms),
        size: parseFloat(data.size),
        amenities,
        images: uploadedImages.map((img) => img.url),
        extraFeatures: data.extraFeatures?.trim() || "",
        ownerInfo: {
          name: data.ownerName.trim(),
          email: data.ownerEmail.trim(),
          phone: data.ownerPhone?.trim() || "",
        },
      };

      await axiosInstance.post("/properties", payload);
      toast.success(
        "Property submitted! It will be reviewed by our admin team."
      );
      router.push("/owner/my-properties");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to submit property"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { label: "Basic Info" },
    { label: "Details" },
    { label: "Photos" },
    { label: "Owner Info" },
  ];

  return (
    <div className="page-transition max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title">Add New Property</h1>
        <p className="page-description">
          Fill in the details below to list your property. It will be
          reviewed before going live.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 sm:gap-4 mb-8 p-4 card-base">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 sm:gap-4 flex-1">
            <StepIndicator
              step={i + 1}
              currentStep={step}
              label={s.label}
            />
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 transition-colors hidden sm:block ${
                  step > i + 1
                    ? "bg-green-400"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-base p-6 space-y-5"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-heading">
              Basic Information
            </h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Property Title *
              </label>
              <div className="relative">
                <InputIcon icon={TbHome} />
                <input
                  type="text"
                  placeholder="e.g. Modern Downtown Apartment with City View"
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 10,
                      message: "Title must be at least 10 characters",
                    },
                    maxLength: {
                      value: 120,
                      message: "Title cannot exceed 120 characters",
                    },
                  })}
                  style={iconInputStyle}
                  className={`input-base w-full ${
                    errors.title ? "border-red-400" : ""
                  }`}
                />
              </div>
              {errors.title && (
                <p className="mt-1.5 text-xs text-red-500">
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
                rows={5}
                placeholder="Describe your property in detail — layout, neighborhood, nearby amenities..."
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 30,
                    message: "Description must be at least 30 characters",
                  },
                  maxLength: {
                    value: 2000,
                    message: "Description cannot exceed 2000 characters",
                  },
                })}
                className={`input-base resize-none ${
                  errors.description ? "border-red-400" : ""
                }`}
              />
              <div className="flex justify-between mt-1">
                {errors.description ? (
                  <p className="text-xs text-red-500">
                    {errors.description.message}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-gray-400">
                  {watch("description")?.length || 0}/2000
                </span>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Location *
              </label>
              <div className="relative">
                <InputIcon icon={TbMapPin} />
                <input
                  type="text"
                  placeholder="e.g. Manhattan, New York, NY"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  style={iconInputStyle}
                  className={`input-base w-full ${
                    errors.location ? "border-red-400" : ""
                  }`}
                />
              </div>
              {errors.location && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Property Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PROPERTY_TYPES.map((type) => {
                  const selected = watch("propertyType") === type;
                  return (
                    <label
                      key={type}
                      className={`flex items-center justify-center px-3 py-2.5 rounded-xl border-2 cursor-pointer text-sm font-medium transition-all ${
                        selected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <input
                        type="radio"
                        value={type}
                        className="sr-only"
                        {...register("propertyType", {
                          required: "Property type is required",
                        })}
                      />
                      {type}
                    </label>
                  );
                })}
              </div>
              {errors.propertyType && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.propertyType.message}
                </p>
              )}
            </div>

            {/* Extra features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Extra Features{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Any extra details, house rules, special features..."
                {...register("extraFeatures", {
                  maxLength: {
                    value: 500,
                    message: "Cannot exceed 500 characters",
                  },
                })}
                className="input-base resize-none"
              />
            </div>
          </motion.div>
        )}

        {/* STEP 2: Property Details */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-base p-6 space-y-5"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-heading">
              Property Details
            </h2>

            {/* Price + Rent Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Rent Price *
                </label>
                <div className="relative">
                  <InputIcon icon={TbCurrencyDollar} />
                  <input
                    type="number"
                    min="0"
                    placeholder="0.00"
                    {...register("price", {
                      required: "Price is required",
                      min: {
                        value: 0,
                        message: "Price must be positive",
                      },
                    })}
                    style={iconInputStyle}
                    className={`input-base w-full ${
                      errors.price ? "border-red-400" : ""
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Rent Type *
                </label>
                <select
                  {...register("rentType", {
                    required: "Rent type is required",
                  })}
                  className="input-base cursor-pointer w-full"
                >
                  {RENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bedrooms, Bathrooms, Size */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Bedrooms *
                </label>
                <div className="relative">
                  <InputIcon icon={TbBed} />
                  <input
                    type="number"
                    min="0"
                    max="50"
                    placeholder="0"
                    {...register("bedrooms", {
                      required: "Required",
                      min: { value: 0, message: "Min 0" },
                      max: { value: 50, message: "Max 50" },
                    })}
                    style={iconInputStyle}
                    className={`input-base w-full ${
                      errors.bedrooms ? "border-red-400" : ""
                    }`}
                  />
                </div>
                {errors.bedrooms && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.bedrooms.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Bathrooms *
                </label>
                <div className="relative">
                  <InputIcon icon={TbBath} />
                  <input
                    type="number"
                    min="0"
                    max="50"
                    placeholder="0"
                    {...register("bathrooms", {
                      required: "Required",
                      min: { value: 0, message: "Min 0" },
                      max: { value: 50, message: "Max 50" },
                    })}
                    style={iconInputStyle}
                    className={`input-base w-full ${
                      errors.bathrooms ? "border-red-400" : ""
                    }`}
                  />
                </div>
                {errors.bathrooms && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.bathrooms.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Size (sqft) *
                </label>
                <div className="relative">
                  <InputIcon icon={TbRuler} />
                  <input
                    type="number"
                    min="1"
                    placeholder="0"
                    {...register("size", {
                      required: "Required",
                      min: { value: 1, message: "Min 1 sqft" },
                    })}
                    style={iconInputStyle}
                    className={`input-base w-full ${
                      errors.size ? "border-red-400" : ""
                    }`}
                  />
                </div>
                {errors.size && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.size.message}
                  </p>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amenities{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_AMENITIES.map((amenity) => {
                  const selected = amenities.includes(amenity);
                  return (
                    <button 
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border-2 transition-all ${
                        selected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                      }`}
                    >
                      {selected && (
                        <TbCheck className="inline w-3 h-3 mr-1" />
                      )}
                      {amenity}
                    </button>
                  );
                })}
              </div>
              {amenities.length > 0 && (
                <p className="text-xs text-blue-500 mt-2">
                  {amenities.length} amenit
                  {amenities.length !== 1 ? "ies" : "y"} selected
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 3: Images */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-base p-6 space-y-5"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-heading">
                Property Images
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upload 1–10 high-quality images. Images are uploaded directly
                to ImgBB.
              </p>
            </div>

            {/* Upload zone */}
            <label
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all ${
                images.length >= 10
                  ? "border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed"
                  : "border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
              }`}
            >
              <TbUpload className="w-10 h-10 text-blue-400 mb-3" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {images.length >= 10
                  ? "Maximum images reached"
                  : "Click to upload images"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, WEBP up to 5MB each · Max 10 images
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={images.length >= 10}
                onChange={handleImageUpload}
              />
            </label>

            {/* Image previews */}
            {images.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Uploaded Images ({images.length}/10)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <div
                      key={img.id}
                      className="relative group aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700"
                    >
                      <img
                        src={img.url}
                        alt={`Preview ${i + 1}`}
                        className={`w-full h-full object-cover ${
                          img.uploading ? "opacity-50" : ""
                        }`}
                      />

                      {/* Uploading spinner */}
                      {img.uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}

                      {/* Error */}
                      {img.error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-500/40">
                          <TbAlertCircle className="w-6 h-6 text-white" />
                        </div>
                      )}

                      {/* Uploaded check */}
                      {img.uploaded && (
                        <div className="absolute top-1.5 left-1.5 bg-green-500 rounded-full p-0.5">
                          <TbCheck className="w-3 h-3 text-white" />
                        </div>
                      )}

                      {/* Primary badge */}
                      {i === 0 && img.uploaded && (
                        <div className="absolute bottom-1.5 left-1.5 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-lg font-semibold">
                          Cover
                        </div>
                      )}

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TbTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {images.length === 0 && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800">
                <TbAlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  At least one image is required to submit your property.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 4: Owner Information */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-base p-6 space-y-5"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-heading">
                Owner Information
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This information will be shown to potential tenants.
              </p>
            </div>

            {/* Owner name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Your Name *
              </label>
              <div className="relative">
                <InputIcon icon={TbUser} />
                <input
                  type="text"
                  placeholder="Your full name"
                  {...register("ownerName", {
                    required: "Owner name is required",
                  })}
                  style={iconInputStyle}
                  className={`input-base w-full ${
                    errors.ownerName ? "border-red-400" : ""
                  }`}
                />
              </div>
              {errors.ownerName && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.ownerName.message}
                </p>
              )}
            </div>

            {/* Owner email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Contact Email *
              </label>
              <div className="relative">
                <InputIcon icon={TbMail} />
                <input
                  type="email"
                  placeholder="your@email.com"
                  {...register("ownerEmail", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: "Please enter a valid email",
                    },
                  })}
                  style={iconInputStyle}
                  className={`input-base w-full ${
                    errors.ownerEmail ? "border-red-400" : ""
                  }`}
                />
              </div>
              {errors.ownerEmail && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.ownerEmail.message}
                </p>
              )}
            </div>

            {/* Owner phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Phone Number{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <InputIcon icon={TbPhone} />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  {...register("ownerPhone")}
                  style={iconInputStyle}
                  className="input-base w-full"
                />
              </div>
            </div>

            {/* Submission notice */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                Before you submit
              </h3>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                <li>
                  • Your property will have{" "}
                  <strong>Pending</strong> status after submission.
                </li>
                <li>
                  • Our admin team will review and approve it within
                  24–48 hours.
                </li>
                <li>
                  • You will be notified once it is live on the platform.
                </li>
              </ul>
            </div>

            {/* Summary preview */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Property Summary
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                <div>
                  <span className="text-gray-400">Type: </span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {watch("propertyType") || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Price: </span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    ${watch("price") || "—"} {watch("rentType")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Beds: </span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {watch("bedrooms") || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Baths: </span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {watch("bathrooms") || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Images: </span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {images.filter((i) => i.uploaded).length} uploaded
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Amenities: </span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {amenities.length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="bordered"
            onPress={() => setStep((s) => Math.max(1, s - 1))}
            isDisabled={step === 1}
            className="font-semibold"
          >
            Previous
          </Button>

          {step < 4 ? (
            <Button
              type="button"
              onPress={handleNextStep}
              className="font-semibold btn-gradient text-white"
            >
              Next Step
            </Button>
          ) : (
            <Button
              type="button"
              onPress={handleSubmit(onSubmit)}
              
              isLoading={isSubmitting}
              isDisabled={
                images.filter((i) => i.uploaded).length === 0 ||
                isSubmitting
              }
              className="font-semibold btn-gradient text-white"
            >
              Submit Property
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}