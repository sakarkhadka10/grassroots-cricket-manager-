import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { EditPlayerForm } from "@/components/players/edit-player-form";
import { PlayerDeleteButton } from "@/components/players/player-delete-button";
import { PageHeader } from "@/components/dashboard/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { playersTable } from "@/db/schema";
import { formatBasePrice, playerImpactScore, playerRoleLabels } from "@/lib/players/labels";
import { cn } from "cn";

export const instant = false;

type PlayerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;

  const [player] = await db.select().from(playersTable).where(eq(playersTable.id, id)).limit(1);

  if (!player) {
    notFound();
  }

  const impact = playerImpactScore(player);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/dashboard/players" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          <ChevronLeft className="size-4" />
          Back to players
        </Link>
        <PlayerDeleteButton
          playerId={player.id}
          playerName={player.name}
          showLabel
          redirectOnSuccess="/dashboard/players"
        />
      </div>

      <PageHeader
        title={player.name}
        description={`${playerRoleLabels[player.role]} · joined ${player.createdAt.toLocaleDateString()} · impact score ${impact}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Base price", value: formatBasePrice(player.basePrice) },
          { label: "Matches", value: String(player.matchesPlayed) },
          { label: "Total runs", value: String(player.totalRuns) },
          { label: "Total wickets", value: String(player.totalWickets) },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit player</CardTitle>
          <CardDescription>Update profile and performance stats.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditPlayerForm player={player} />
        </CardContent>
      </Card>
    </div>
  );
}
