import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const hallId = searchParams.get("hallId") || undefined;
  const department = searchParams.get("department") || undefined;
  const date = searchParams.get("date") || undefined; // YYYY-MM-DD

  const where: any = {};
  if (hallId) where.hallId = hallId;
  if (department) where.department = department;
  if (date) {
    const start = new Date(date + "T00:00:00.000Z");
    const end = new Date(date + "T23:59:59.999Z");
    where.startTime = { gte: start };
    where.endTime = { lte: end };
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: { hall: true, createdBy: true },
    orderBy: { startTime: "asc" },
  });
  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json();
  const { hallId, department, purpose, startTime, endTime } = body as {
    hallId: string; department: string; purpose: string; startTime: string; endTime: string;
  };
  if (!hallId || !department || !purpose || !startTime || !endTime) return new NextResponse("Bad Request", { status: 400 });
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (end <= start) return new NextResponse("End must be after start", { status: 400 });

  const overlap = await prisma.booking.findFirst({
    where: {
      hallId,
      OR: [
        { startTime: { lt: end }, endTime: { gt: start } }, // overlapping windows
      ],
    },
  });
  if (overlap) return new NextResponse("Overlapping booking exists", { status: 409 });

  const created = await prisma.booking.create({
    data: {
      hallId,
      department,
      purpose,
      startTime: start,
      endTime: end,
      createdById: (session.user as any).id,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
