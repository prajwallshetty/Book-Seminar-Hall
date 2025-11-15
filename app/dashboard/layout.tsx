import { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { CalendarDays, LayoutGrid, Table as TableIcon, Users } from "lucide-react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role as string | undefined;

  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr]">
      <aside className="border-r bg-card/50">
        <div className="px-4 py-5 border-b">
          <div className="text-lg font-semibold">Seminar Hall Admin</div>
          <div className="text-xs text-muted-foreground">Welcome {(session?.user as any)?.email}</div>
        </div>
        <nav className="p-2">
          <Link className="flex items-center gap-2 rounded px-3 py-2 hover:bg-accent" href="/dashboard"><LayoutGrid size={16}/> Dashboard</Link>
          <Link className="flex items-center gap-2 rounded px-3 py-2 hover:bg-accent" href="/dashboard/bookings"><TableIcon size={16}/> Bookings</Link>
          <Link className="flex items-center gap-2 rounded px-3 py-2 hover:bg-accent" href="/dashboard/bookings/calendar"><CalendarDays size={16}/> Calendar</Link>
          <Link className="flex items-center gap-2 rounded px-3 py-2 hover:bg-accent" href="/dashboard/halls"><LayoutGrid size={16}/> Halls</Link>
          {role === "SUPER_ADMIN" && (
            <>
              <Link className="flex items-center gap-2 rounded px-3 py-2 hover:bg-accent" href="/dashboard/departments"><LayoutGrid size={16}/> Departments</Link>
              <Link className="flex items-center gap-2 rounded px-3 py-2 hover:bg-accent" href="/dashboard/admins"><Users size={16}/> Admins</Link>
            </>
          )}
        </nav>
        <form action="/api/auth/signout" method="post" className="p-3 mt-2 border-t">
          <Button className="w-full" formAction="/api/auth/signout">Sign out</Button>
        </form>
      </aside>
      <main className="p-6 space-y-6">{children}</main>
    </div>
  );
}
