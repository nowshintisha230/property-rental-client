// src/app/(auth)/login/page.jsx
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login — RentEasy",
  description: "Sign in to your RentEasy account",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}