import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DepartmentsClient from "./table-client";

export default async function DepartmentsPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPER_ADMIN") redirect("/dashboard");
  const departments = await prisma.department.findMany({ orderBy: { name: "asc" } } as any);
  return (
    <Card>
      <CardHeader><CardTitle>Departments</CardTitle></CardHeader>
      <CardContent>
        <DepartmentsClient initialData={departments} />
      </CardContent>
    </Card>
  );
}
