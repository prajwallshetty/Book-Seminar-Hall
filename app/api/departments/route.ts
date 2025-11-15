import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const departments = await prisma.department.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(departments);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });
  const role = (session.user as any).role;
  if (role !== "SUPER_ADMIN") return new NextResponse("Forbidden", { status: 403 });
  const { name } = await req.json();
  if (!name) return new NextResponse("Bad Request", { status: 400 });
  const created = await prisma.department.create({ data: { name } });
  return NextResponse.json(created, { status: 201 });
}
