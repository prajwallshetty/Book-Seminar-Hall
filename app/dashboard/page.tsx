import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const [hallsCount, bookingsCount] = await Promise.all([
    prisma.hall.count(),
    prisma.booking.count(),
  ]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader><CardTitle>Halls</CardTitle></CardHeader>
        <CardContent><div className="text-3xl font-bold">{hallsCount}</div></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Total Bookings</CardTitle></CardHeader>
        <CardContent><div className="text-3xl font-bold">{bookingsCount}</div></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Use the Bookings page to filter by department and hall.</p>
        </CardContent>
      </Card>
    </div>
  );
}
