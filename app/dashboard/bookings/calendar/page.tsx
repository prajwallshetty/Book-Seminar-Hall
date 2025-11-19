import { prisma } from "@/lib/prisma";
import CalendarClient from "./calendar-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CalendarPage() {
  const [halls, departments, bookings] = await Promise.all([
    prisma.hall.findMany({ orderBy: { name: "asc" } }),
    // @ts-ignore
    (prisma as any).department.findMany({ orderBy: { name: "asc" } }),
    prisma.booking.findMany({ include: { hall: true, /* @ts-ignore */ department: true } }),
  ]);
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          A timeline view of your bookings across halls. Quickly spot overlaps and free slots.
        </p>
      </div>
      <Card className="p-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Bookings calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <CalendarClient halls={halls} departments={departments} initialData={bookings} />
        </CardContent>
      </Card>
    </div>
  );
}
