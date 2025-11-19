import { prisma } from "@/lib/prisma";
import AdminsClient from "./table-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminsPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPER_ADMIN") redirect("/dashboard");
  const rawAdmins = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, role: true, createdAt: true } });
  const admins = rawAdmins.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }));
  return (
    <Card>
      <CardHeader><CardTitle>Admins</CardTitle></CardHeader>
      <CardContent>
        <AdminsClient initialData={admins} />
      </CardContent>
    </Card>
  );
}
