import type { ReactNode } from "react";

import { redirectIfAuthenticated } from "@/lib/auth/session";

export const instant = false;

export default async function AuthLayout({ children }: { children: ReactNode }) {
  await redirectIfAuthenticated();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 sm:px-6">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
