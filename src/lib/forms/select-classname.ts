import { cn } from "cn";

export function selectClassName(invalid?: boolean) {
  return cn(
    "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base dark:bg-input/30",
    invalid && "border-destructive ring-3 ring-destructive/20",
  );
}
