import { Badge } from "@/components/ui/badge";
import type { MatchSummary } from "@/lib/matches/queries";

type MatchListProps = {
  matches: MatchSummary[];
};

export function MatchList({ matches }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="rounded-lg border border-dashed px-4 py-10 text-center">
        <p className="text-sm font-medium">No matches recorded</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Log a fixture below to update player stats and the leaderboard.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fixture</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Result</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.id} className="border-b last:border-0">
              <td className="px-4 py-3 text-muted-foreground">{match.playedAt.toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <span className="font-medium">{match.teamAName}</span>
                <span className="mx-2 text-muted-foreground">vs</span>
                <span className="font-medium">{match.teamBName}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="tabular-nums">
                    {match.teamAScore} – {match.teamBScore}
                  </span>
                  {match.winnerName ? (
                    <Badge variant="secondary">{match.winnerName} won</Badge>
                  ) : (
                    <Badge variant="outline">Draw</Badge>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
