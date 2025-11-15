import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HallsPage() {
  const halls = await prisma.hall.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {halls.map((h) => (
        <Card key={h.id}>
          <CardHeader>
            <CardTitle>{h.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Predefined seminar hall.</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
