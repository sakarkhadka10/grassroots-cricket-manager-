import Link from "next/link";

import { teamsTable } from "@/db/schema";

type Team = typeof teamsTable.$inferSelect;

type TeamListProps = {
  teams: Team[];
};

export function TeamList({ teams }: TeamListProps) {
  if (teams.length === 0) {
    return (
      <div className="rounded-lg border border-dashed px-4 py-10 text-center">
        <p className="text-sm font-medium">No teams yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Create at least two teams before{" "}
          <Link href="/dashboard/matches" className="font-medium text-foreground underline-offset-4 hover:underline">
            recording a match
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y rounded-lg border">
      {teams.map((team) => (
        <li key={team.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
          <span className="font-medium">{team.name}</span>
          <span className="text-xs text-muted-foreground">{team.createdAt.toLocaleDateString()}</span>
        </li>
      ))}
    </ul>
  );
}
