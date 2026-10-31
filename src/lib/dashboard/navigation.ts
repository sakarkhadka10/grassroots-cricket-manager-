import type { LucideIcon } from "lucide-react";
import { Activity, LayoutDashboard, Medal, Users, UsersRound } from "lucide-react";

export type DashboardNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
};

export const adminNavItems: DashboardNavItem[] = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { title: "Teams", href: "/dashboard/teams", icon: UsersRound },
  { title: "Players", href: "/dashboard/players", icon: Users },
  { title: "Matches", href: "/dashboard/matches", icon: Activity },
  { title: "Leaderboard", href: "/dashboard/leaderboard", icon: Medal },
];

export function isNavItemActive(pathname: string, item: DashboardNavItem) {
  if (item.exact) {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
