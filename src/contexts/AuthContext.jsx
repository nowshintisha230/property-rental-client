// src/contexts/AuthContext.jsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

// ─── Normalize user object ─────────────────────────────────────────────────
// Backend may return photo as "photo" or "photoURL" — we normalize to always
// have BOTH so components can use either without breaking.
const normalizeUser = (userData) => {
  if (!userData) return null;
  const photo = userData.photo || userData.photoURL || "";
  return {
    ...userData,
    photo,
    photoURL: photo,
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Persist user session from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
          const parsed = normalizeUser(JSON.parse(savedUser));
          setToken(savedToken);
          setUser(parsed);

          // Verify token is still valid with backend
          try {
            const res = await axiosInstance.get("/auth/me");
            const normalized = normalizeUser(res.data.data.user);
            setUser(normalized);
            localStorage.setItem("user", JSON.stringify(normalized));
          } catch {
            // Token invalid — clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setToken(null);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const saveSession = useCallback((userData, userToken) => {
    const normalized = normalizeUser(userData);
    setUser(normalized);
    setToken(userToken);
    if (userToken) localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(normalized));
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  // Email/password register
  const register = useCallback(
    async ({ name, email, password, photo, photoURL }) => {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
        photo: photo || photoURL || "",
      });
      const { user: userData, token: userToken } = res.data.data;
      saveSession(userData, userToken);
      return normalizeUser(userData);
    },
    [saveSession]
  );

  // Email/password login
  const login = useCallback(
    async ({ email, password }) => {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      const { user: userData, token: userToken } = res.data.data;
      saveSession(userData, userToken);
      return normalizeUser(userData);
    },
    [saveSession]
  );

  // Google OAuth login
  const googleLogin = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    const idToken = await firebaseUser.getIdToken();

    const res = await axiosInstance.post("/auth/google", { idToken });
    const { user: userData, token: userToken } = res.data.data;

    // If backend didn't save the photo, fall back to Firebase's photoURL
    if (!userData.photo && !userData.photoURL && firebaseUser.photoURL) {
      userData.photo = firebaseUser.photoURL;
      userData.photoURL = firebaseUser.photoURL;
    }

    saveSession(userData, userToken);
    return normalizeUser(userData);
  }, [saveSession]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // Continue logout even if API call fails
    }
    try {
      await firebaseSignOut(auth);
    } catch {
      // Continue logout even if Firebase sign out fails
    }
    clearSession();
    toast.success("Logged out successfully");
  }, [clearSession]);

  // Update user in context (after profile update)
  const updateUser = useCallback((updatedUser) => {
    const normalized = normalizeUser(updatedUser);
    setUser(normalized);
    localStorage.setItem("user", JSON.stringify(normalized));
  }, []);

  const value = {
    user,
    token,
    loading,
    register,
    login,
    googleLogin,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isOwner: user?.role === "owner",
    isTenant: user?.role === "tenant",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;