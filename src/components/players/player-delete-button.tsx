"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deletePlayerAction } from "@/actions/player.actions";
import { Button } from "@/components/ui/button";

type PlayerDeleteButtonProps = {
  playerId: string;
  playerName: string;
  showLabel?: boolean;
  redirectOnSuccess?: string;
};

export function PlayerDeleteButton({
  playerId,
  playerName,
  showLabel = false,
  redirectOnSuccess,
}: PlayerDeleteButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(`Remove ${playerName} from the roster? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result = await deletePlayerAction(playerId);
      if (result.success) {
        toast.success(result.message);
        if (redirectOnSuccess) {
          router.push(redirectOnSuccess);
          router.refresh();
        }
        return;
      }
      toast.error(result.message);
    });
  }

  return (
    <Button
      type="button"
      variant={showLabel ? "destructive" : "ghost"}
      size={showLabel ? "sm" : "icon-sm"}
      disabled={pending}
      aria-label={`Delete ${playerName}`}
      className={showLabel ? undefined : "text-destructive hover:bg-destructive/10 hover:text-destructive"}
      onClick={handleDelete}
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      {showLabel ? "Delete player" : null}
    </Button>
  );
}
