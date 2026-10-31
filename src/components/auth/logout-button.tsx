"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LoaderCircle, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type LogoutButtonProps = {
  variant?: "default" | "outline" | "ghost";
  className?: string;
};

export function LogoutButton({ variant = "outline", className }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await signOut({ redirect: false });

      toast.success("You have been signed out.");

      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Unable to sign out. Please try again.");
      setIsLoggingOut(false);
    }
  }

  return (
    <Button type="button" variant={variant} className={className} disabled={isLoggingOut} onClick={handleLogout}>
      {isLoggingOut ? <LoaderCircle className="size-4 animate-spin" /> : <LogOut className="size-4" />}

      {isLoggingOut ? "Signing out..." : "Sign out"}
    </Button>
  );
}
