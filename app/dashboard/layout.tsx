import { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role as string | undefined;

  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr]">
      <aside className="border-r bg-muted/30 p-4">
        <div className="mb-6 font-semibold">Seminar Hall Admin</div>
        <nav className="space-y-2">
          <Link className="block rounded px-2 py-1 hover:bg-accent" href="/dashboard">Dashboard</Link>
          <Link className="block rounded px-2 py-1 hover:bg-accent" href="/dashboard/bookings">Bookings</Link>
          <Link className="block rounded px-2 py-1 hover:bg-accent" href="/dashboard/halls">Halls</Link>
          {role === "SUPER_ADMIN" && (
            <Link className="block rounded px-2 py-1 hover:bg-accent" href="/dashboard/admins">Admins</Link>
          )}
        </nav>
        <form action="/api/auth/signout" method="post" className="mt-6">
          <Button className="w-full" formAction="/api/auth/signout">Sign out</Button>
        </form>
      </aside>
      <main className="p-6 space-y-6">{children}</main>
    </div>
  );
}
