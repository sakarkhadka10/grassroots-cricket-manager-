import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth/session";

export default async function PlayersPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader title="Players" description="Manage player profiles and performance history." />
      <Card>
        <CardHeader>
          <CardTitle>Player roster</CardTitle>
          <CardDescription>Player CRUD and stats will live here soon.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          Add players, edit details, and review match-by-match contributions.
        </CardContent>
      </Card>
    </div>
  );
}
