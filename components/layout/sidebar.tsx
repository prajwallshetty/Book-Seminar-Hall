"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  Table as TableIcon,
  Layers,
  Users,
  LogOut,
  Menu,
  Building2,
  ChartColumn,
  BookmarkCheck,
  Blend,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
  { label: "Dashboard", href: "/dashboard", icon: ChartColumn },
  { label: "Bookings", href: "/dashboard/bookings", icon: BookmarkCheck },
  {
    label: "Calendar",
    href: "/dashboard/calendar",
    icon: CalendarDays,
  },
  { label: "Halls", href: "/dashboard/halls", icon: Building2 },
  {
    label: "Departments",
    href: "/dashboard/departments",
    icon: Blend,
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
      className={`group relative m-3 flex h-[calc(100vh-1.5rem)] flex-col rounded-2xl bg-white shadow-lg transition-all duration-300 ease-out ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
      onMouseEnter={() => setCollapsed(false)}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
            <img
              src="/ajiet.jpg"
              alt="AJIET logo"
              className="h-full w-full object-contain"
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                Seminar Hall
              </span>
              <span className="text-[11px] text-neutral-500">
                Admin Console
              </span>
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 w-8 rounded-full p-0 bg-white text-neutral-600 hover:bg-black hover:text-white"
          onClick={() => setCollapsed((v) => !v)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="bg-black/10" />

      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group/nav relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out ${
                  active
                    ? "bg-black text-white shadow-sm"
                    : "text-neutral-600 hover:bg-black hover:text-white hover:shadow-sm"
                }`}
              >
                <span
                  className={`absolute left-0 top-1/2 h-7 -translate-y-1/2 rounded-r-full bg-black transition-all duration-200 ${
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
      </ScrollArea>

      <Separator className="bg-black/10" />

      <div className="px-3 pb-4 pt-3">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[11px] font-semibold shadow-sm border border-black/10">
            {userEmail?.[0]?.toUpperCase() ?? "U"}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-xs font-medium">
                {userEmail ?? "Signed in"}
              </div>
              <div className="text-[11px] text-neutral-500">
                {role ?? "Admin"}
              </div>
            </div>
          )}
        </div>
        <div className={collapsed ? "flex justify-center" : undefined}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-center gap-2 bg-white text-neutral-600 hover:bg-black hover:text-white"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-3.5 w-3.5" />
            {!collapsed && <span>Sign out</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}
