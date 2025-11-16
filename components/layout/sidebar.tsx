"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Table as TableIcon,
  Layers,
  Users,
  LogOut,
  Menu,
} from "lucide-react";

interface SidebarProps {
  userEmail?: string;
  role?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Bookings", href: "/dashboard/bookings", icon: TableIcon },
  {
    label: "Calendar",
    href: "/dashboard/bookings/calendar",
    icon: CalendarDays,
  },
  { label: "Halls", href: "/dashboard/halls", icon: Layers },
  {
    label: "Departments",
    href: "/dashboard/departments",
    icon: Layers,
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "Admins",
    href: "/dashboard/admins",
    icon: Users,
    roles: ["SUPER_ADMIN"],
  },
];

export function Sidebar({ userEmail, role }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  const filteredItems = navItems.filter((item) => {
    if (!item.roles) return true;
    if (!role) return false;
    return item.roles.includes(role);
  });

  return (
    <aside
      className={`group relative m-3 flex h-[calc(100vh-1.5rem)] flex-col rounded-2xl bg-card/95 shadow-lg backdrop-blur-md transition-all duration-300 ease-out ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
      onMouseEnter={() => setCollapsed(false)}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-background text-xs font-semibold shadow-sm">
            SH
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                Seminar Hall
              </span>
              <span className="text-[11px] text-muted-foreground">
                Admin Console
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:shadow-md"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group/nav relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm"
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 h-7 -translate-y-1/2 rounded-r-full bg-accent-foreground transition-all duration-200 ${
                  active
                    ? "w-[3px] opacity-100"
                    : "w-0 opacity-0 group-hover/nav:w-[3px] group-hover/nav:opacity-40"
                }`}
              />
              <Icon
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                  active ? "scale-110" : "group-hover/nav:scale-110"
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 pt-2">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-[11px] font-semibold shadow-sm">
            {userEmail?.[0]?.toUpperCase() ?? "U"}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-xs font-medium">
                {userEmail ?? "Signed in"}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {role ?? "Admin"}
              </div>
            </div>
          )}
        </div>
        <form
          action="/api/auth/signout"
          method="post"
          className={collapsed ? "flex justify-center" : undefined}
        >
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-background px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:bg-accent hover:text-accent-foreground hover:shadow-md active:translate-y-0"
          >
            <LogOut className="h-3.5 w-3.5" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
