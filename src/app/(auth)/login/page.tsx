import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Login | Criico Arena",
  description: "Sign in to your Criico Arena account",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
