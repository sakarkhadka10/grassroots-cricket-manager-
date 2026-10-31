import { desc } from "drizzle-orm";

import { AddPlayerForm } from "@/components/players/add-player-form";
import { PlayerRosterTable } from "@/components/players/player-roster-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { playersTable } from "@/db/schema";

export const instant = false;

export default async function PlayersPage() {
  const players = await db.select().from(playersTable).orderBy(desc(playersTable.createdAt));

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader title="Players" description="Manage player profiles, stats, and your squad roster." />

      <Card>
        <CardHeader>
          <CardTitle>Add player</CardTitle>
          <CardDescription>Enter player details below. All fields are validated before saving.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddPlayerForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="space-y-1.5">
            <CardTitle>Roster</CardTitle>
            <CardDescription>
              {players.length} player{players.length === 1 ? "" : "s"} · impact = (runs + 25× wickets) ÷ matches
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <PlayerRosterTable players={players} />
        </CardContent>
      </Card>
    </div>
  );
}
