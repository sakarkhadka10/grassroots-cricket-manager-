import { redirect } from "next/navigation";

import { homePathForRole } from "@/lib/auth/routes";
import { requireUser } from "@/lib/auth/session";

export const instant = false;

export default async function AuthRedirectPage() {
  const user = await requireUser();
  redirect(homePathForRole(user.role));
}
