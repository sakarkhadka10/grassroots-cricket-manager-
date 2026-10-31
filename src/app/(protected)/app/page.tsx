import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth/session";
import { userRoleLabels } from "@/lib/auth/validation";

export default async function UserAppPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <Badge variant="secondary" className="mb-4">
        Coming soon
      </Badge>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Hi, {user.name.split(" ")[0]}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{userRoleLabels.USER} account</p>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        You don&apos;t have permission to access the admin dashboard yet. We&apos;re building your experience — check
        back soon.
      </p>
      <p className="mt-8 text-sm text-muted-foreground">
        Signed in as <span className="font-medium text-foreground">{user.email}</span>
      </p>
    </main>
  );
}
