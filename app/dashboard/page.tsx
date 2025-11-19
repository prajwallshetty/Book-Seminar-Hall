import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingsChart } from "@/components/dashboard/bookings-chart";

export default async function DashboardPage() {
  const [hallsCount, bookingsCount, recentBookings] = await Promise.all([
    prisma.hall.count(),
    prisma.booking.count(),
    prisma.booking.findMany({
      where: {
        startTime: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      select: { startTime: true },
    }),
  ]);

  const countsMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    countsMap.set(key, 0);
  }

  for (const b of recentBookings) {
    const d = new Date(b.startTime);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().slice(0, 10);
    if (countsMap.has(key)) {
      countsMap.set(key, (countsMap.get(key) || 0) + 1);
    }
  }

  const bookingsSeries = Array.from(countsMap.entries()).map(([date, count]) => ({
    date: date.slice(5),
    count,
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="mt-1 h-12 w-12 overflow-hidden rounded-md bg-white flex items-center justify-center">
              <img
                src="/ajiet.jpg"
                alt="AJIET logo"
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              AJ Institute of Engineering and Technology
            </h1>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Halls
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-semibold tracking-tight">{hallsCount}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Active seminar halls configured in the system.
            </p>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-semibold tracking-tight">{bookingsCount}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              All-time bookings recorded across halls.
            </p>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Next steps
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1.5 text-sm text-muted-foreground">
            <p>
              Use <span className="font-medium text-foreground">Bookings</span> to manage reservations.
            </p>
            <p>
              Switch to <span className="font-medium text-foreground">Calendar</span> for a timeline view.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Bookings over last 30 days
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <BookingsChart data={bookingsSeries} />
        </CardContent>
      </Card>
    </div>
  );
}
