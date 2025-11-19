import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingsClient from "./table-client";

export default async function BookingsPage() {
  const [halls, departments, bookings] = await Promise.all([
    prisma.hall.findMany({ orderBy: { name: "asc" } }),
    // @ts-ignore department exists after prisma generate
    (prisma as any).department?.findMany?.({ orderBy: { name: "asc" } }) ?? [],
    prisma.booking.findMany({ include: { hall: true, createdBy: true, /* @ts-ignore */ department: true }, orderBy: { startTime: "asc" } }),
  ]);
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          View, filter, and manage seminar hall bookings with a clean tabular overview.
        </p>
      </div>
      <Card className="p-0">
        <CardContent className="pt-6">
          <BookingsClient halls={halls} departments={departments} initialData={bookings} />
        </CardContent>
      </Card>
    </div>
  );
}
