import type { ReactNode } from "react";
import { Trophy } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type UserShellProps = {
  name: string;
  email: string;
  children: ReactNode;
};

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserShell({ name, email, children }: UserShellProps) {
  const initials = initialsFromName(name);

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex items-center justify-between gap-4 border-b px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Trophy className="size-4" />
          </div>
          <span className="font-semibold tracking-tight">Criico</span>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>
          <LogoutButton variant="outline" />
        </div>
      </header>
      {children}
    </div>
  );
}
