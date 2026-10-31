"use client";

import { useActionState, useState, type FormEvent } from "react";
import { LoaderCircle, Plus, Trash2 } from "lucide-react";

import { createMatchAction, type MatchActionState } from "@/actions/match.actions";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Player } from "@/db/schema";
import { teamsTable } from "@/db/schema";
import { selectClassName } from "@/lib/forms/select-classname";
import { useFormActionToast } from "@/hooks/use-form-action-toast";

type Team = typeof teamsTable.$inferSelect;

type PerformanceRow = {
  key: string;
  playerId: string;
  teamId: string;
  runs: string;
  wickets: string;
};

const initialState: MatchActionState = {
  success: false,
  message: "",
};

type RecordMatchFormProps = {
  teams: Team[];
  players: Player[];
};

function emptyRow(): PerformanceRow {
  return {
    key: crypto.randomUUID(),
    playerId: "",
    teamId: "",
    runs: "0",
    wickets: "0",
  };
}

function resolveWinner(teamAId: string, teamBId: string, teamAScore: number, teamBScore: number) {
  if (teamAScore > teamBScore) {
    return teamAId;
  }
  if (teamBScore > teamAScore) {
    return teamBId;
  }
  return null;
}

export function RecordMatchForm({ teams, players }: RecordMatchFormProps) {
  const [state, formAction, pending] = useActionState(createMatchAction, initialState);
  const [submitCount, setSubmitCount] = useState(0);
  const [teamAId, setTeamAId] = useState("");
  const [teamBId, setTeamBId] = useState("");
  const [teamAScore, setTeamAScore] = useState("0");
  const [teamBScore, setTeamBScore] = useState("0");
  const [rows, setRows] = useState<PerformanceRow[]>([emptyRow()]);

  useFormActionToast(state, pending, submitCount, {
    successMessage: "Match recorded successfully.",
  });

  const canSubmit = teams.length >= 2 && players.length > 0;

  function buildPayload() {
    const scoreA = Number(teamAScore);
    const scoreB = Number(teamBScore);

    return {
      requestId: crypto.randomUUID(),
      teamAId,
      teamBId,
      teamAScore: scoreA,
      teamBScore: scoreB,
      winnerId: teamAId && teamBId ? resolveWinner(teamAId, teamBId, scoreA, scoreB) : null,
      performances: rows
        .filter((row) => row.playerId && row.teamId)
        .map((row) => ({
          playerId: row.playerId,
          teamId: row.teamId,
          runs: Number(row.runs),
          wickets: Number(row.wickets),
        })),
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData();
    formData.set("payload", JSON.stringify(buildPayload()));
    setSubmitCount((count) => count + 1);
    await formAction(formData);
  }

  if (!canSubmit) {
    return (
      <p className="text-sm text-muted-foreground">Add at least two teams and one player before recording a match.</p>
    );
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <FieldGroup className="gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="team-a">Team A</FieldLabel>
            <select
              id="team-a"
              value={teamAId}
              onChange={(event) => setTeamAId(event.target.value)}
              required
              className={selectClassName()}
            >
              <option value="">Select team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id} disabled={team.id === teamBId}>
                  {team.name}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <FieldLabel htmlFor="team-b">Team B</FieldLabel>
            <select
              id="team-b"
              value={teamBId}
              onChange={(event) => setTeamBId(event.target.value)}
              required
              className={selectClassName()}
            >
              <option value="">Select team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id} disabled={team.id === teamAId}>
                  {team.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="team-a-score">Team A score</FieldLabel>
            <Input
              id="team-a-score"
              type="number"
              min={0}
              value={teamAScore}
              onChange={(event) => setTeamAScore(event.target.value)}
              required
              className="tabular-nums"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="team-b-score">Team B score</FieldLabel>
            <Input
              id="team-b-score"
              type="number"
              min={0}
              value={teamBScore}
              onChange={(event) => setTeamBScore(event.target.value)}
              required
              className="tabular-nums"
            />
          </Field>
        </div>
      </FieldGroup>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">Player performances</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setRows((current) => [...current, emptyRow()])}
          >
            <Plus className="size-4" />
            Add row
          </Button>
        </div>

        <div className="space-y-3">
          {rows.map((row, index) => (
            <div key={row.key} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-2 lg:grid-cols-5">
              <Field>
                <FieldLabel>Player</FieldLabel>
                <select
                  value={row.playerId}
                  onChange={(event) =>
                    setRows((current) =>
                      current.map((item) => (item.key === row.key ? { ...item, playerId: event.target.value } : item)),
                    )
                  }
                  className={selectClassName()}
                  required={index === 0}
                >
                  <option value="">Select player</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <FieldLabel>Team</FieldLabel>
                <select
                  value={row.teamId}
                  onChange={(event) =>
                    setRows((current) =>
                      current.map((item) => (item.key === row.key ? { ...item, teamId: event.target.value } : item)),
                    )
                  }
                  className={selectClassName()}
                  required={index === 0}
                >
                  <option value="">Select team</option>
                  {[teamAId, teamBId]
                    .filter(Boolean)
                    .map((id) => teams.find((team) => team.id === id))
                    .filter((team): team is Team => Boolean(team))
                    .map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                </select>
              </Field>
              <Field>
                <FieldLabel>Runs</FieldLabel>
                <Input
                  type="number"
                  min={0}
                  value={row.runs}
                  onChange={(event) =>
                    setRows((current) =>
                      current.map((item) => (item.key === row.key ? { ...item, runs: event.target.value } : item)),
                    )
                  }
                  className="tabular-nums"
                />
              </Field>
              <Field>
                <FieldLabel>Wickets</FieldLabel>
                <Input
                  type="number"
                  min={0}
                  value={row.wickets}
                  onChange={(event) =>
                    setRows((current) =>
                      current.map((item) => (item.key === row.key ? { ...item, wickets: event.target.value } : item)),
                    )
                  }
                  className="tabular-nums"
                />
              </Field>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={rows.length === 1}
                  aria-label="Remove performance row"
                  onClick={() => setRows((current) => current.filter((item) => item.key !== row.key))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={pending || !teamAId || !teamBId} className="w-full sm:w-auto">
        {pending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Saving match…
          </>
        ) : (
          "Record match"
        )}
      </Button>
    </form>
  );
}
