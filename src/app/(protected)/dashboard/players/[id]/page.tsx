import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth/session";

export default async function PlayerPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader title="Player detail" description="Individual player profile and stats." />
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Detailed player view coming soon.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          Performance charts and match history will be shown for each player.
        </CardContent>
      </Card>
    </div>
  );
}
