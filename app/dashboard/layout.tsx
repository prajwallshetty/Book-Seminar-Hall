import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role as string | undefined;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userEmail={(session?.user as any)?.email} role={role} />
      <main className="flex-1 space-y-6 bg-white px-8 py-8 text-foreground">
        {children}
      </main>
    </div>
  );
}
