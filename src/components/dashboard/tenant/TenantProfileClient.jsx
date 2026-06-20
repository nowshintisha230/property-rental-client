// src/components/dashboard/tenant/TenantProfileClient.jsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Divider } from "@heroui/react";
import {
  TbUser,
  TbMail,
  TbCalendar,
  TbShield,
  TbEdit,
  TbCamera,
  TbCheck,
  TbX,
  TbUpload,
} from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { formatDate, uploadImageToImgBB } from "@/lib/utils";
import toast from "react-hot-toast";

// ─── Get photo from user regardless of field name ──────────────────────────
const getUserPhoto = (user) => user?.photo || user?.photoURL || "";

// ─── Custom Avatar — uses <img> with referrerPolicy to load Google photos ──
function UserAvatar({ src, name, size = "w-24 h-24", textSize = "text-2xl" }) {
  const [imgError, setImgError] = useState(false);

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name || "User avatar"}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`${size} rounded-full object-cover ring-4 ring-white dark:ring-gray-900 shadow-lg border-2 border-blue-400`}
      />
    );
  }

  return (
    <div
      className={`${size} ${textSize} rounded-full ring-4 ring-white dark:ring-gray-900 shadow-lg border-2 border-blue-400 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold select-none`}
    >
      {initials}
    </div>
  );
}

export default function TenantProfileClient() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    photo: getUserPhoto(user),
  });

  const currentPhoto = isEditing ? formData.photo : getUserPhoto(user);

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5 MB");
      return;
    }
    setIsUploadingPhoto(true);
    try {
      const url = await uploadImageToImgBB(file);
      setFormData((p) => ({ ...p, photo: url }));
      toast.success("Photo uploaded!");
    } catch {
      toast.error("Failed to upload photo. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axiosInstance.patch("/users/profile", {
        name: formData.name.trim(),
        photo: formData.photo,
      });
      updateUser(res.data.data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || "", photo: getUserPhoto(user) });
    setIsEditing(false);
  };

  const roleChipColors = {
    admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    owner: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    tenant: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <div className="page-transition max-w-3xl">
      <div className="page-header mb-8">
        <h1 className="page-title">My Profile</h1>
        <p className="page-description">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="card-base overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 mb-6">
            <div className="relative inline-block">
              <UserAvatar src={currentPhoto} name={user?.name} />
              {isEditing && (
                <label
                  className="absolute bottom-0 right-0 p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full cursor-pointer shadow-md transition-colors"
                  title="Change photo"
                >
                  {isUploadingPhoto ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <TbCamera className="w-4 h-4" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                    disabled={isUploadingPhoto}
                  />
                </label>
              )}
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="bordered"
                    size="sm"
                    startContent={<TbX className="w-4 h-4" />}
                    onPress={handleCancel}
                    className="font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    isLoading={isLoading}
                    startContent={!isLoading && <TbCheck className="w-4 h-4" />}
                    onPress={handleSave}
                    className="font-semibold btn-gradient text-white"
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="bordered"
                  startContent={<TbEdit className="w-4 h-4" />}
                  onPress={() => {
                    setFormData({ name: user?.name || "", photo: getUserPhoto(user) });
                    setIsEditing(true);
                  }}
                  className="font-semibold"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Name + badges */}
          <div className="mb-6">
            {isEditing ? (
              <div className="max-w-sm">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  className="input-base"
                  placeholder="Your full name"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
                  {user?.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                      roleChipColors[user?.role] || roleChipColors.tenant
                    }`}
                  >
                    {user?.role}
                  </span>
                  {user?.isGoogleUser && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      <svg className="w-3 h-3" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Google Account
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <Divider className="my-5" />

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: TbMail, label: "Email Address", value: user?.email, color: "text-blue-500" },
              {
                icon: TbShield,
                label: "Account Role",
                value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "",
                color: "text-purple-500",
              },
              { icon: TbCalendar, label: "Member Since", value: formatDate(user?.createdAt), color: "text-green-500" },
              {
                icon: TbUser,
                label: "Account Type",
                value: user?.isGoogleUser ? "Google OAuth" : "Email & Password",
                color: "text-orange-500",
              },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="p-2 rounded-xl bg-white dark:bg-gray-700 shadow-sm flex-shrink-0">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Photo URL input while editing */}
          {isEditing && (
            <div className="mt-5 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-1.5">
                <TbUpload className="w-3.5 h-3.5" />
                Photo URL (optional)
              </p>
              <input
                type="url"
                placeholder="https://example.com/your-photo.jpg"
                value={formData.photo}
                onChange={(e) => setFormData((p) => ({ ...p, photo: e.target.value }))}
                className="input-base text-sm"
              />
              {formData.photo && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={formData.photo}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow"
                  />
                  <p className="text-xs text-blue-500 dark:text-blue-300">
                    Preview — or use the camera icon to upload a file.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Security card */}
      {!user?.isGoogleUser && (
        <div className="card-base p-6 mt-5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 font-heading">
            Account Security
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Your account is secured with email and password authentication.
          </p>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
            <TbShield className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-700 dark:text-green-400">
              Password authentication is active. To change your password, please contact support.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}