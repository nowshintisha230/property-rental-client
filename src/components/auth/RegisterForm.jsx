// src/components/auth/RegisterForm.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, Divider } from "@heroui/react";
import { motion } from "framer-motion";
import {
  TbUserCircle,
  TbMail,
  TbLock,
  TbEye,
  TbEyeOff,
  TbCheck,
  TbX,
  TbArrowRight,
} from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

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

export default function RegisterForm() {
  const { register: registerUser, googleLogin } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const user = await registerUser({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
      });
      toast.success(`Welcome to RentEasy, ${user.name}!`);
      router.push("/tenant");
    } catch (err) {
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
      const user = await googleLogin();
      toast.success(`Welcome to RentEasy, ${user.name}!`);
      router.push("/tenant");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Google sign-up failed. Please try again."
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // ─── Shared input style ───────────────────────────────────────────────────
  // Key fix: use pl-10 (40px) on mobile and pl-11 (44px) on sm+ so the icon
  // at left-3 / left-3.5 (12–14 px) + its width (16–20 px) never bleeds into
  // the placeholder text.  Password fields also get pr-10/pr-11 for the eye button.
  const inputBase =
    "w-full rounded-xl border border-gray-200 dark:border-gray-700 " +
    "bg-white dark:bg-gray-900 text-gray-900 dark:text-white " +
    "placeholder:text-gray-400 dark:placeholder:text-gray-500 " +
    "text-sm sm:text-base h-11 sm:h-12 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent " +
    "transition-colors";

  const inputError = "border-red-400 focus:ring-red-400";

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm sm:max-w-md"
      >
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-heading mb-1.5 sm:mb-2">
            Create account
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Join thousands finding their perfect home
          </p>
        </div>

        {/* Google Signup */}
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
          className="h-11 sm:h-12 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 mb-5 sm:mb-6"
        >
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          <Divider className="flex-1" />
          <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">
            or register with email
          </span>
          <Divider className="flex-1" />
        </div>

        {/* Register Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4 sm:space-y-5"
        >
          {/* ── Full Name ─────────────────────────────────────────────────── */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
              Full Name
            </label>
            <div className="relative">
              {/* Icon: left-3 = 12px, w-5 = 20px → total ~32px; pl-10 = 40px gives 8px gap ✓ */}
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

          {/* ── Email ─────────────────────────────────────────────────────── */}
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

          {/* ── Password ──────────────────────────────────────────────────── */}
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
                // pl-10 for left icon, pr-10 for right eye-toggle button
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

            {/* Password requirements checklist */}
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

          {/* ── Confirm Password ──────────────────────────────────────────── */}
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

          {/* Terms */}
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-blue-500 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-500 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            endContent={!isLoading && <TbArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="h-11 sm:h-12 text-sm sm:text-base font-semibold btn-gradient text-white"
          >
            Create Account
          </Button>
        </form>

        {/* Login link */}
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