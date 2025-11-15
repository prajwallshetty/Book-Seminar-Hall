import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const halls = ["Hall A", "Hall B", "Hall C"];
  for (const name of halls) {
    await prisma.hall.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const departments = ["Computer Science", "Electronics", "Mechanical", "Civil"];
  for (const name of departments) {
    // @ts-ignore - department model added in Mongo schema
    await (prisma as any).department?.upsert?.({
      where: { name },
      update: {},
      create: { name },
    }).catch(() => Promise.resolve());
  }

  const name = process.env.SUPER_ADMIN_NAME || "Super Admin";
  const email = process.env.SUPER_ADMIN_EMAIL || "super@example.com";
  const password = process.env.SUPER_ADMIN_PASSWORD || "password123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { name, role: "SUPER_ADMIN" },
    create: { name, email, passwordHash, role: "SUPER_ADMIN" },
  });

  console.log("Seeded halls and super admin:", { email });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
