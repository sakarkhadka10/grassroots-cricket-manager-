import { redirect } from "next/navigation";

import { AdminShell } from "@/components/dashboard/admin-shell";
import { homePathForRole } from "@/lib/auth/routes";
import { requireUser } from "@/lib/auth/session";

export const instant = false;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect(homePathForRole(user.role));
  }

  return (
    <AdminShell name={user.name} email={user.email} role={user.role}>
      {children}
    </AdminShell>
  );
}
