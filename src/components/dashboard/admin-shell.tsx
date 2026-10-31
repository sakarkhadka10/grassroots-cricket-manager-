"use client";

import type { ReactNode } from "react";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { UserRole } from "@/lib/auth/validation";

type AdminShellProps = {
  name: string;
  email: string;
  role: UserRole;
  children: ReactNode;
};

export function AdminShell({ name, email, role, children }: AdminShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar name={name} email={email} role={role} />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 md:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 hidden h-4 md:block" />
            <p className="text-sm text-muted-foreground">Admin workspace</p>
          </header>
          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
