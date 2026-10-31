import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const instant = false;

export default async function TeamsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader title="Teams" description="Create squads and organize your roster." />
      <Card>
        <CardHeader>
          <CardTitle>No teams yet</CardTitle>
          <CardDescription>Team management is coming in the next phase.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          You&apos;ll be able to add teams, assign players, and track fixtures from here.
        </CardContent>
      </Card>
    </div>
  );
}
