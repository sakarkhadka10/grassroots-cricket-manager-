import { asc } from "drizzle-orm";

import { AddTeamForm } from "@/components/teams/add-team-form";
import { TeamList } from "@/components/teams/team-list";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { teamsTable } from "@/db/schema";

export const instant = false;

export default async function TeamsPage() {
  const teams = await db.select().from(teamsTable).orderBy(asc(teamsTable.name));

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader title="Teams" description="Create squads used in fixtures and match results." />

      <Card>
        <CardHeader>
          <CardTitle>Add team</CardTitle>
          <CardDescription>Team names must be unique across your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddTeamForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Squads</CardTitle>
          <CardDescription>
            {teams.length} team{teams.length === 1 ? "" : "s"} registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeamList teams={teams} />
        </CardContent>
      </Card>
    </div>
  );
}
