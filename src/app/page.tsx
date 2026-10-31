import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { homePathForRole } from "@/lib/auth/routes";
import { getCurrentUser } from "@/lib/auth/session";
import { cn } from "cn";

export const metadata: Metadata = {
  title: "Criico",
  description: "Welcome to Criico — cricket management platform",
};

export const instant = false;

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect(homePathForRole(user.role));
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Welcome to Criico</h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          Manage teams, players, and matches in one place.
        </p>
        <div className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Link href="/login" className={cn(buttonVariants(), "w-full sm:w-auto")}>
            Login
          </Link>
          <Link href="/register" className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}>
            Register
          </Link>
        </div>
      </main>
    </div>
  );
}
