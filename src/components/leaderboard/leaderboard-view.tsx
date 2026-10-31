import Link from "next/link";
import { Medal, Trophy, TrendingUp, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatImpactScore } from "@/lib/cricket/impact-score";
import type { LeaderboardPlayer } from "@/lib/cricket/leaderboard";
import { playerRoleLabels } from "@/lib/players/labels";
import { cn } from "cn";

type LeaderboardViewProps = {
  entries: LeaderboardPlayer[];
};

function RankDisplay({ rank }: { rank: number }) {
  if (rank === 1) {
    return <Trophy className="size-5 shrink-0 text-amber-500" aria-hidden />;
  }
  if (rank === 2) {
    return <Medal className="size-5 shrink-0 text-slate-400" aria-hidden />;
  }
  if (rank === 3) {
    return <Medal className="size-5 shrink-0 text-amber-700" aria-hidden />;
  }
  return (
    <span className="flex size-5 shrink-0 items-center justify-center text-sm font-medium text-muted-foreground tabular-nums">
      {rank}
    </span>
  );
}

function PodiumCard({ player }: { player: LeaderboardPlayer }) {
  const isFirst = player.rank === 1;

  return (
    <Link
      href={`/dashboard/players/${player.id}`}
      className={cn(
        "flex flex-col rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40",
        isFirst && "border-amber-500/40 bg-amber-500/5 md:-mt-2 md:pb-6",
        player.rank === 2 && "md:mt-2",
        player.rank === 3 && "md:mt-4",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <RankDisplay rank={player.rank} />
        <Badge variant={isFirst ? "default" : "secondary"} className="tabular-nums">
          {formatImpactScore(player.impactScore)}
        </Badge>
      </div>
      <p className="truncate text-base font-semibold">{player.name}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{playerRoleLabels[player.role]}</p>
      <dl className="mt-4 grid grid-cols-3 gap-2 border-t pt-3 text-center text-xs">
        <div>
          <dt className="text-muted-foreground">M</dt>
          <dd className="font-medium tabular-nums">{player.matchesPlayed}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Runs</dt>
          <dd className="font-medium tabular-nums">{player.totalRuns}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Wkts</dt>
          <dd className="font-medium tabular-nums">{player.totalWickets}</dd>
        </div>
      </dl>
    </Link>
  );
}

export function LeaderboardView({ entries }: LeaderboardViewProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No rankings yet</CardTitle>
          <CardDescription>Add players with match stats to generate impact scores.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/dashboard/players"
            className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Go to Players
          </Link>
        </CardContent>
      </Card>
    );
  }

  const topScore = entries[0]?.impactScore ?? 0;
  const averageScore =
    Math.round((entries.reduce((sum, entry) => sum + entry.impactScore, 0) / entries.length) * 100) / 100;
  const podium = entries.slice(0, 3);
  const showPodium = entries.length >= 2;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Players ranked</CardDescription>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{entries.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Top impact</CardDescription>
            <Trophy className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{formatImpactScore(topScore)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Squad average</CardDescription>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{formatImpactScore(averageScore)}</p>
          </CardContent>
        </Card>
      </div>

      {showPodium ? (
        <div className="grid gap-3 md:grid-cols-3 md:items-end">
          {podium[1] ? <PodiumCard player={podium[1]} /> : <div className="hidden md:block" />}
          {podium[0] ? <PodiumCard player={podium[0]} /> : null}
          {podium[2] ? <PodiumCard player={podium[2]} /> : <div className="hidden md:block" />}
        </div>
      ) : (
        <PodiumCard player={entries[0]!} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Full standings</CardTitle>
          <CardDescription>
            Sorted by impact score, then runs, wickets, and name. Role multipliers and experience bonuses apply.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <caption className="sr-only">Player impact leaderboard</caption>
              <thead>
                <tr className="border-b bg-muted/50">
                  <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Rank
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Player
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Matches
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Runs
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Wickets
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Impact
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((player) => (
                  <tr key={player.id} className={cn("border-b last:border-0", player.rank <= 3 && "bg-muted/20")}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <RankDisplay rank={player.rank} />
                        <span className="sr-only">Rank {player.rank}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/players/${player.id}`} className="font-medium hover:underline">
                        {player.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{playerRoleLabels[player.role]}</p>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{player.matchesPlayed}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{player.totalRuns}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{player.totalWickets}</td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant={player.rank === 1 ? "default" : "secondary"} className="tabular-nums">
                        {formatImpactScore(player.impactScore)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
