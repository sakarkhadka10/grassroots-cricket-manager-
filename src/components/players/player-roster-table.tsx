import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PlayerDeleteButton } from "@/components/players/player-delete-button";
import { Badge } from "@/components/ui/badge";
import type { Player } from "@/db/schema";
import { formatBasePrice, playerImpactScore, playerRoleLabels } from "@/lib/players/labels";

type PlayerRosterTableProps = {
  players: Player[];
};

export function PlayerRosterTable({ players }: PlayerRosterTableProps) {
  if (players.length === 0) {
    return (
      <div className="rounded-lg border border-dashed px-4 py-10 text-center">
        <p className="text-sm font-medium">No players yet</p>
        <p className="mt-2 text-sm text-muted-foreground">Add your first player using the form above.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Base price</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Matches</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Runs</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Wickets</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Impact</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id} className="border-b last:border-0">
              <td className="px-4 py-3">
                <Link
                  href={`/dashboard/players/${player.id}`}
                  className="group inline-flex items-center gap-1.5 font-medium hover:underline"
                >
                  {player.name}
                  <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </td>
              <td className="px-4 py-3">
                <Badge variant="secondary">{playerRoleLabels[player.role]}</Badge>
              </td>
              <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                {formatBasePrice(player.basePrice)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">{player.matchesPlayed}</td>
              <td className="px-4 py-3 text-right tabular-nums">{player.totalRuns}</td>
              <td className="px-4 py-3 text-right tabular-nums">{player.totalWickets}</td>
              <td className="px-4 py-3 text-right font-medium tabular-nums">{playerImpactScore(player)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <PlayerDeleteButton playerId={player.id} playerName={player.name} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
