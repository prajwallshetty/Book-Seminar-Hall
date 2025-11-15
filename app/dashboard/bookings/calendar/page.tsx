import { prisma } from "@/lib/prisma";
import CalendarClient from "./calendar-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CalendarPage() {
  const [halls, departments, bookings] = await Promise.all([
    prisma.hall.findMany({ orderBy: { name: "asc" } }),
    // @ts-ignore
    (prisma as any).department.findMany({ orderBy: { name: "asc" } }),
    prisma.booking.findMany({ include: { hall: true, createdBy: true, /* @ts-ignore */ department: true } }),
  ]);
  return (
    <Card>
      <CardHeader><CardTitle>Bookings Calendar</CardTitle></CardHeader>
      <CardContent>
        <CalendarClient halls={halls} departments={departments} initialData={bookings} />
      </CardContent>
    </Card>
  );
}
