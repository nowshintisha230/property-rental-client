// src/components/auth/ProtectedRoute.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/app/loading";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo = "/login",
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (
      allowedRoles.length > 0 &&
      !allowedRoles.includes(user?.role)
    ) {
      router.replace("/unauthorized");
    }
  }, [loading, isAuthenticated, user, allowedRoles, router, redirectTo]);

  if (loading) return <Loading />;

  if (!isAuthenticated) return null;

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user?.role)
  ) {
    return null;
  }

  return <>{children}</>;
}