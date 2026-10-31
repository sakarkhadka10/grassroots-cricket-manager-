import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth/session";

export default async function LeaderboardPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader title="Leaderboard" description="Rank players by impact and consistency." />
      <Card>
        <CardHeader>
          <CardTitle>Impact rankings</CardTitle>
          <CardDescription>Leaderboard scoring will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          Compare players using your custom impact formula across the season.
        </CardContent>
      </Card>
    </div>
  );
}
