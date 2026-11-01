import { LeaderboardView } from "@/components/leaderboard/leaderboard-view";
import { PageHeader } from "@/components/dashboard/page-header";
import { getLeaderboard } from "@/lib/cricket/leaderboard";

export const instant = false;

export default async function LeaderboardPage() {
  const entries = await getLeaderboard();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        title="Impact leaderboard"
        description="Live rankings from player statistics using the Criico Arena impact score formula."
      />
      <LeaderboardView entries={entries} />
    </div>
  );
}
