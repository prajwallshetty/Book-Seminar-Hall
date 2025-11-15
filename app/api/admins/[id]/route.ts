import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPER_ADMIN") return new NextResponse("Forbidden", { status: 403 });
  await prisma.user.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
