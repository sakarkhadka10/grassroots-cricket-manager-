import { asc } from "drizzle-orm";

import { MatchList } from "@/components/matches/match-list";
import { RecordMatchForm } from "@/components/matches/record-match-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { playersTable, teamsTable } from "@/db/schema";
import { getMatchSummaries } from "@/lib/matches/queries";

export const instant = false;

export default async function MatchesPage() {
  const [matchSummaries, teams, players] = await Promise.all([
    getMatchSummaries(),
    db.select().from(teamsTable).orderBy(asc(teamsTable.name)),
    db.select().from(playersTable).orderBy(asc(playersTable.name)),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        title="Matches"
        description="Record fixtures and player performances. Stats feed the roster and leaderboard automatically."
      />

      <Card>
        <CardHeader>
          <CardTitle>Record match</CardTitle>
          <CardDescription>Winner is derived from team scores. Each player can appear once per match.</CardDescription>
        </CardHeader>
        <CardContent>
          <RecordMatchForm teams={teams} players={players} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Match log</CardTitle>
          <CardDescription>
            {matchSummaries.length} match{matchSummaries.length === 1 ? "" : "es"} recorded
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MatchList matches={matchSummaries} />
        </CardContent>
      </Card>
    </div>
  );
}
