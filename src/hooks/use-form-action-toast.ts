"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

type ActionFeedback = {
  success: boolean;
  message: string;
};

type UseFormActionToastOptions = {
  successMessage?: string;
};

/**
 * Toast after a server action completes. Requires `submitCount` to increment in the form's
 * onSubmit so cached action state from a prior visit does not re-trigger Sonner.
 */
export function useFormActionToast(
  state: ActionFeedback,
  pending: boolean,
  submitCount: number,
  options?: UseFormActionToastOptions,
) {
  const lastToastedSubmit = useRef(0);

  useEffect(() => {
    if (submitCount === 0 || pending || lastToastedSubmit.current >= submitCount) {
      return;
    }

    lastToastedSubmit.current = submitCount;

    if (state.success) {
      toast.success(options?.successMessage ?? (state.message || "Saved successfully."));
      return;
    }

    if (state.message) {
      toast.error(state.message);
    }
  }, [options?.successMessage, pending, state.message, state.success, submitCount]);
}
