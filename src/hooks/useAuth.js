// src/hooks/useAuth.js
"use client";

import { useAuth as useAuthContext } from "@/contexts/AuthContext";

// Re-export with convenience helpers
export function useAuth() {
  const auth = useAuthContext();
  return auth;
}

export default useAuth;