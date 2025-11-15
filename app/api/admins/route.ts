import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
  const admins = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
  return NextResponse.json(admins);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPER_ADMIN") return new NextResponse("Forbidden", { status: 403 });
  const { name, email, password, role } = await req.json();
  if (!email || !password) return new NextResponse("Bad Request", { status: 400 });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash, role: role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN" } });
  return NextResponse.json({ id: user.id, email: user.email, role: user.role }, { status: 201 });
}
