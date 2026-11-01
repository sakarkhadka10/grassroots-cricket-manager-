"use client";

import { useActionState, useState } from "react";
import { LoaderCircle } from "lucide-react";

import { createPlayerAction, type PlayerActionState } from "@/actions/player.actions";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { selectClassName } from "@/lib/forms/select-classname";
import { playerRoleLabels } from "@/lib/players/labels";
import { playerRoles } from "@/lib/validations/player";
import { useFormActionToast } from "@/hooks/use-form-action-toast";

const initialState: PlayerActionState = {
  success: false,
  message: "",
};

export function AddPlayerForm() {
  const [state, formAction, pending] = useActionState(createPlayerAction, initialState);
  const [submitCount, setSubmitCount] = useState(0);

  useFormActionToast(state, pending, submitCount, {
    successMessage: "Player added successfully.",
  });

  return (
    <form action={formAction} className="space-y-5" noValidate onSubmit={() => setSubmitCount((count) => count + 1)}>
      <FieldGroup className="gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" name="name" placeholder="Player full name" maxLength={100} required />
          </Field>

          <Field>
            <FieldLabel htmlFor="role">Role</FieldLabel>
            <select id="role" name="role" defaultValue="BATSMAN" required className={selectClassName()}>
              {playerRoles.map((role) => (
                <option key={role} value={role}>
                  {playerRoleLabels[role]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field>
            <FieldLabel htmlFor="basePrice">Auction base (NPR)</FieldLabel>
            <Input
              id="basePrice"
              name="basePrice"
              type="number"
              min={0}
              step="0.01"
              placeholder="1500000"
              required
              className="tabular-nums"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="matchesPlayed">Matches played</FieldLabel>
            <Input
              id="matchesPlayed"
              name="matchesPlayed"
              type="number"
              min={0}
              step={1}
              defaultValue={0}
              required
              className="tabular-nums"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="totalRuns">Total runs</FieldLabel>
            <Input
              id="totalRuns"
              name="totalRuns"
              type="number"
              min={0}
              step={1}
              defaultValue={0}
              required
              className="tabular-nums"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="totalWickets">Total wickets</FieldLabel>
            <Input
              id="totalWickets"
              name="totalWickets"
              type="number"
              min={0}
              step={1}
              defaultValue={0}
              required
              className="tabular-nums"
            />
          </Field>
        </div>

        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Adding player…
            </>
          ) : (
            "Add player"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
