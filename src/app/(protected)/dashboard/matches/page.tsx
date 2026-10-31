import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const instant = false;

export default async function MatchesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader title="Matches" description="Record fixtures, results, and individual performances." />
      <Card>
        <CardHeader>
          <CardTitle>Match log</CardTitle>
          <CardDescription>Match tracking is on the roadmap.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          Log innings, scores, and player stats after each game.
        </CardContent>
      </Card>
    </div>
  );
}
