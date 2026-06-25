// src/components/auth/RegisterForm.jsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, Divider } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbUserCircle,
  TbMail,
  TbLock,
  TbEye,
  TbEyeOff,
  TbCheck,
  TbX,
  TbArrowRight,
  TbPhoto,
  TbUpload,
  TbTrash,
  TbLink,
  TbHome,
  TbBuildingEstate,
} from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY; // add to your .env.local

const PasswordRequirement = ({ met, label }) => (
  <div className="flex items-center gap-1.5">
    {met ? (
      <TbCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
    ) : (
      <TbX className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
    )}
    <span
      className={`text-xs ${
        met
          ? "text-green-600 dark:text-green-400"
          : "text-gray-400 dark:text-gray-500"
      }`}
    >
      {label}
    </span>
  </div>
);


const RoleOption = ({ value, selected, onSelect, icon, title, desc }) => (
  <button
    type="button"
    onClick={() => onSelect(value)}
    aria-pressed={selected}
    className={`relative flex-1 flex flex-col items-start gap-1 p-3 sm:p-4 rounded-xl border-2 text-left transition-colors ${
      selected
        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600"
    }`}
  >
    <div className="flex items-center justify-between w-full">
      <span
        className={`flex items-center justify-center w-8 h-8 rounded-lg ${
          selected
            ? "bg-blue-500 text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
        }`}
      >
        {icon}
      </span>
   
      <span
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
          selected
            ? "border-blue-500"
            : "border-gray-300 dark:border-gray-600"
        }`}
      >
        {selected && <span className="w-2 h-2 rounded-full bg-blue-500" />}
      </span>
    </div>
    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
      {title}
    </p>
    <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
  </button>
);

export default function RegisterForm() {
  const { register: registerUser, googleLogin } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [selectedRole, setSelectedRole] = useState("tenant"); 

  
  const [photoMode, setPhotoMode] = useState("upload"); 
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoUrlPreview, setPhotoUrlPreview] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(""); // 
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password", "");

  const passwordChecks = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
  };

  

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setUploadedPhotoUrl("");
  };

  const handleRemoveFile = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setUploadedPhotoUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    if (!data.success) throw new Error("imgbb upload failed");
    return data.data.url;
  };

  const handlePhotoUrlChange = (e) => {
    const val = e.target.value.trim();
    setPhotoUrl(val);
    setPhotoUrlPreview(val);
  };

  

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let finalPhotoUrl = "";

      if (photoMode === "upload" && photoFile) {
        setIsUploadingPhoto(true);
        finalPhotoUrl = await uploadToImgbb(photoFile);
        setUploadedPhotoUrl(finalPhotoUrl);
        setIsUploadingPhoto(false);
      } else if (photoMode === "url" && photoUrl) {
        finalPhotoUrl = photoUrl;
      }

      const user = await registerUser({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        photoURL: finalPhotoUrl || undefined,
        role: selectedRole,
      });

      toast.success(`Welcome to RentEasy, ${user.name}!`);
    
      router.push(selectedRole === "owner" ? "/owner" : "/tenant");
    } catch (err) {
      setIsUploadingPhoto(false);
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
  setIsGoogleLoading(true);
  try {
    const user = await googleLogin({ role: "tenant" });
    toast.success(`Welcome to RentEasy, ${user.name}!`);
    router.push("/tenant");
  } catch (err) {
    console.error("Google login error →", {
      code: err.code,
      message: err.message,
      backendMessage: err.response?.data?.message,
      full: err,
    });
    toast.error(
      err.response?.data?.message ||
        err.message ||
        "Google sign-up failed. Please try again."
    );
  } finally {
    setIsGoogleLoading(false);
  }
};
  
  const inputBase =
    "w-full rounded-xl border border-gray-200 dark:border-gray-700 " +
    "bg-white dark:bg-gray-900 text-gray-900 dark:text-white " +
    "placeholder:text-gray-400 dark:placeholder:text-gray-500 " +
    "text-sm sm:text-base h-11 sm:h-12 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent " +
    "transition-colors";

  const inputError = "border-red-400 focus:ring-red-400";

  
  const activePreview = photoMode === "upload" ? photoPreview : photoUrlPreview;

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm sm:max-w-md"
      >
      
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-heading mb-1.5 sm:mb-2">
            Create an Account
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            {selectedRole === "owner"
              ? "List your properties and start earning today"
              : "Find and book your next place to stay"}
          </p>
        </div>

     
        <Button
          fullWidth
          variant="bordered"
          onPress={handleGoogleLogin}
          isLoading={isGoogleLoading}
          startContent={
            !isGoogleLoading && (
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )
          }
          className="h-11 sm:h-12 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 mb-2"
        >
          Continue with Google
        </Button>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-5 sm:mb-6">
          Google sign-up always creates a <strong>Tenant</strong> account
        </p>

        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          <Divider className="flex-1" />
          <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">
            or register with email
          </span>
          <Divider className="flex-1" />
        </div>

       
        <div className="mb-5 sm:mb-6">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            I want to register as
          </label>
          <div className="flex gap-3">
            <RoleOption
              value="tenant"
              selected={selectedRole === "tenant"}
              onSelect={setSelectedRole}
              icon={<TbHome className="w-4 h-4" />}
              title="Tenant"
              desc="Find & book rentals"
            />
            <RoleOption
              value="owner"
              selected={selectedRole === "owner"}
              onSelect={setSelectedRole}
              icon={<TbBuildingEstate className="w-4 h-4" />}
              title="Owner"
              desc="List your properties"
            />
          </div>
        </div>

    
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4 sm:space-y-5"
        >
        
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <TbUserCircle className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                {...register("name", {
                  required: "Full name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                  maxLength: { value: 60, message: "Name cannot exceed 60 characters" },
                })}
                className={`${inputBase} pl-10 ${errors.name ? inputError : ""}`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

        
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <TbMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Please enter a valid email",
                  },
                })}
                className={`${inputBase} pl-10 ${errors.email ? inputError : ""}`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

      
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
              Profile Photo{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>

    
            <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-3">
              <button
                type="button"
                onClick={() => setPhotoMode("upload")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm font-medium transition-colors ${
                  photoMode === "upload"
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <TbUpload className="w-4 h-4" />
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setPhotoMode("url")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm font-medium transition-colors ${
                  photoMode === "url"
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <TbLink className="w-4 h-4" />
                Image URL
              </button>
            </div>

            <AnimatePresence mode="wait">
          
              {photoMode === "upload" && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  {!photoPreview ? (
              
                    <label
                      htmlFor="photo-upload"
                      className="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                    >
                      <TbPhoto className="w-7 h-7 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors" />
                      <div className="text-center">
                        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                          Click to upload photo
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          PNG, JPG, WEBP up to 5 MB
                        </p>
                      </div>
                      <input
                        id="photo-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  ) : (
            
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-white dark:border-gray-700 shadow"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                          {photoFile?.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {photoFile ? (photoFile.size / 1024).toFixed(0) + " KB" : ""}
                        </p>
                        {uploadedPhotoUrl && (
                          <p className="text-xs text-green-500 mt-0.5 flex items-center gap-1">
                            <TbCheck className="w-3 h-3" /> Uploaded to imgbb
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                        aria-label="Remove photo"
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

           
              {photoMode === "url" && (
                <motion.div
                  key="url"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-2"
                >
                  <div className="relative">
                    <TbLink className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={photoUrl}
                      onChange={handlePhotoUrlChange}
                      className={`${inputBase} pl-10`}
                    />
                  </div>
            
                  <AnimatePresence>
                    {photoUrlPreview && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                      >
                        <img
                          src={photoUrlPreview}
                          alt="Profile preview"
                          onError={() => setPhotoUrlPreview("")}
                          className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-white dark:border-gray-700 shadow"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 break-all line-clamp-2">
                          {photoUrlPreview}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
              Password
            </label>
            <div className="relative">
              <TbLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                  validate: {
                    hasUppercase: (v) =>
                      /[A-Z]/.test(v) || "Must contain at least one uppercase letter",
                    hasLowercase: (v) =>
                      /[a-z]/.test(v) || "Must contain at least one lowercase letter",
                  },
                })}
                className={`${inputBase} pl-10 pr-10 ${errors.password ? inputError : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
              >
                {showPassword ? (
                  <TbEyeOff className="w-5 h-5" />
                ) : (
                  <TbEye className="w-5 h-5" />
                )}
              </button>
            </div>

            {password.length > 0 && (
              <div className="mt-2 p-2.5 sm:p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-1.5">
                <PasswordRequirement met={passwordChecks.length}    label="At least 6 characters" />
                <PasswordRequirement met={passwordChecks.uppercase} label="One uppercase letter" />
                <PasswordRequirement met={passwordChecks.lowercase} label="One lowercase letter" />
              </div>
            )}

            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

       
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <TbLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                className={`${inputBase} pl-10 pr-10 ${errors.confirmPassword ? inputError : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
              >
                {showConfirm ? (
                  <TbEyeOff className="w-5 h-5" />
                ) : (
                  <TbEye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

       
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link href="/terms" prefetch={false} className="text-blue-500 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" prefetch={false} className="text-blue-500 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

       
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading || isUploadingPhoto}
            endContent={
              !isLoading && !isUploadingPhoto && (
                <TbArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              )
            }
            className="h-11 sm:h-12 text-sm sm:text-base font-semibold btn-gradient text-white"
          >
            {isUploadingPhoto
              ? "Uploading photo…"
              : selectedRole === "owner"
              ? "Create Owner Account"
              : "Create Tenant Account"}
          </Button>
        </form>

       
        <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-5 sm:mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-600 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}