// src/app/(auth)/register/page.jsx
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Register — RentEasy",
  description: "Create your free RentEasy account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}