import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Parser } from "@json2csv/plainjs";

export async function GET() {
  const bookings = await prisma.booking.findMany({ include: { hall: true, department: true } });
  const rows = bookings.map((b) => ({
    id: b.id,
    hall: b.hall.name,
    department: b.department?.name ?? "",
    purpose: b.purpose,
    startTime: b.startTime.toISOString(),
    endTime: b.endTime.toISOString(),
    createdAt: b.createdAt.toISOString(),
  }));
  const parser = new Parser();
  const csv = parser.parse(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="bookings.csv"',
    },
  });
}
