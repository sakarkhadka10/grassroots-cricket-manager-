import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Register | Criico Arena",
  description: "Create a Criico Arena account",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
