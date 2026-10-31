import { count } from "drizzle-orm";
import { Activity, ArrowUpRight, Trophy, Users, UsersRound } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/db";
import { playersTable, teamsTable } from "@/db/schema";
import { getMatchCount } from "@/lib/matches/queries";
import { requireAdmin } from "@/lib/auth/session";
import { userRoleLabels } from "@/lib/auth/validation";
import { cn } from "cn";

export const instant = false;

export default async function DashboardPage() {
  const user = await requireAdmin();
  const firstName = user.name.split(" ")[0];

  const [{ value: playerCount }] = await db.select({ value: count() }).from(playersTable);
  const [{ value: teamCount }] = await db.select({ value: count() }).from(teamsTable);
  const matchCount = await getMatchCount();

  const stats = [
    {
      label: "Teams",
      value: String(teamCount),
      hint: "Set up squads",
      icon: UsersRound,
      href: "/dashboard/teams",
    },
    {
      label: "Players",
      value: String(playerCount),
      hint: "Roster & stats",
      icon: Users,
      href: "/dashboard/players",
    },
    {
      label: "Matches",
      value: String(matchCount),
      hint: "Fixtures & results",
      icon: Activity,
      href: "/dashboard/matches",
    },
    { label: "Top impact", value: "Live", hint: "Leaderboard", icon: Trophy, href: "/dashboard/leaderboard" },
  ];

  const quickLinks = [
    {
      title: "Players",
      description: "Add players and manage stats.",
      href: "/dashboard/players",
    },
    {
      title: "Teams",
      description: "Create teams and assign players.",
      href: "/dashboard/teams",
    },
    {
      title: "Matches",
      description: "Log scores and individual contributions.",
      href: "/dashboard/matches",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <PageHeader
          title={`Welcome back, ${firstName}`}
          description="Everything you need to run your cricket program from one place."
        />
        <Badge variant="outline" className="w-fit">
          {userRoleLabels.ADMIN}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link key={stat.label} href={stat.href} className="group block">
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardDescription>{stat.label}</CardDescription>
                    <CardTitle className="text-3xl font-semibold tabular-nums">{stat.value}</CardTitle>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <Icon className="size-4" />
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{stat.hint}</span>
                  <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick start</CardTitle>
            <CardDescription>Jump into the areas you&apos;ll use most often.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-auto flex-col items-start gap-2 p-4 text-left whitespace-normal",
                )}
              >
                <span className="font-semibold">{link.title}</span>
                <span className="text-xs leading-relaxed font-normal text-muted-foreground">{link.description}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your account</CardTitle>
            <CardDescription>Signed in as administrator</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Role</p>
              <Badge variant="secondary">{user.role}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
