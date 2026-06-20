// src/app/(auth)/register/page.jsx
import { Suspense } from "react";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Register — RentEasy",
  description: "Create your RentEasy account",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}