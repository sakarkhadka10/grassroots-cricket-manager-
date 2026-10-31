import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { playersTable } from "@/db/schema";
import { playerImpactScore, playerRoleLabels } from "@/lib/players/labels";

export const instant = false;

export default async function LeaderboardPage() {
  const players = await db.select().from(playersTable);
  const ranked = [...players].sort((a, b) => playerImpactScore(b) - playerImpactScore(a));

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader title="Leaderboard" description="Rank players by impact and consistency." />
      <Card>
        <CardHeader>
          <CardTitle>Impact rankings</CardTitle>
          <CardDescription>Score = (runs + 25× wickets) ÷ matches played.</CardDescription>
        </CardHeader>
        <CardContent>
          {ranked.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No players yet.{" "}
              <Link
                href="/dashboard/players"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Add players
              </Link>{" "}
              to populate the leaderboard.
            </p>
          ) : (
            <ol className="space-y-2">
              {ranked.map((player, index) => (
                <li key={player.id} className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground tabular-nums">#{index + 1}</span>
                    <div className="min-w-0">
                      <Link href={`/dashboard/players/${player.id}`} className="truncate font-medium hover:underline">
                        {player.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{playerRoleLabels[player.role]}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="tabular-nums">
                    {playerImpactScore(player)}
                  </Badge>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
