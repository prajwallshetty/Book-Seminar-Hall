import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json();
  const { hallId, department, purpose, startTime, endTime } = body as any;
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (end <= start) return new NextResponse("End must be after start", { status: 400 });

  const overlap = await prisma.booking.findFirst({
    where: {
      hallId,
      id: { not: params.id },
      OR: [
        { startTime: { lt: end }, endTime: { gt: start } },
      ],
    },
  });
  if (overlap) return new NextResponse("Overlapping booking exists", { status: 409 });

  const updated = await prisma.booking.update({
    where: { id: params.id },
    data: { hallId, department, purpose, startTime: start, endTime: end },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });
  await prisma.booking.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
