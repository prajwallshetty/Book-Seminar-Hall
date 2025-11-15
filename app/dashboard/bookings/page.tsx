import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingsClient from "./table-client";

export default async function BookingsPage() {
  const [halls, bookings] = await Promise.all([
    prisma.hall.findMany({ orderBy: { name: "asc" } }),
    prisma.booking.findMany({ include: { hall: true, createdBy: true }, orderBy: { startTime: "asc" } }),
  ]);
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Bookings</CardTitle></CardHeader>
        <CardContent>
          <BookingsClient halls={halls} initialData={bookings} />
        </CardContent>
      </Card>
    </div>
  );
}
