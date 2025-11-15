import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });
  const role = (session.user as any).role;
  if (role !== "SUPER_ADMIN") return new NextResponse("Forbidden", { status: 403 });
  await prisma.department.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
