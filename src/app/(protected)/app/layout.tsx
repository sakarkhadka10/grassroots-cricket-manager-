import { redirect } from "next/navigation";

import { UserShell } from "@/components/dashboard/user-shell";
import { homePathForRole } from "@/lib/auth/routes";
import { requireUser } from "@/lib/auth/session";

export const instant = false;

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  if (user.role === "ADMIN") {
    redirect(homePathForRole("ADMIN"));
  }

  return (
    <UserShell name={user.name} email={user.email}>
      {children}
    </UserShell>
  );
}
