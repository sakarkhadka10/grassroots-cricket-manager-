"use client";

import { useActionState, useState } from "react";
import { LoaderCircle } from "lucide-react";

import { createTeamAction, type TeamActionState } from "@/actions/team.actions";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFormActionToast } from "@/hooks/use-form-action-toast";

const initialState: TeamActionState = {
  success: false,
  message: "",
};

export function AddTeamForm() {
  const [state, formAction, pending] = useActionState(createTeamAction, initialState);
  const [submitCount, setSubmitCount] = useState(0);

  useFormActionToast(state, pending, submitCount, {
    successMessage: "Team created successfully.",
  });

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 sm:flex-row sm:items-end"
      noValidate
      onSubmit={() => setSubmitCount((count) => count + 1)}
    >
      <FieldGroup className="flex-1 gap-4">
        <Field>
          <FieldLabel htmlFor="team-name">Team name</FieldLabel>
          <Input id="team-name" name="name" placeholder="e.g. Mumbai Strikers" maxLength={100} required />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Adding…
          </>
        ) : (
          "Add team"
        )}
      </Button>
    </form>
  );
}
