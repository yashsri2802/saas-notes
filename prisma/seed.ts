import { PrismaClient, Plan, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = "password";
  const passwordHash = await bcrypt.hash(password, 10);

  const acme = await prisma.tenant.upsert({
    where: { slug: "acme" },
    update: {},
    create: { name: "Acme", slug: "acme", plan: Plan.FREE },
  });

  const globex = await prisma.tenant.upsert({
    where: { slug: "globex" },
    update: {},
    create: { name: "Globex", slug: "globex", plan: Plan.FREE },
  });

  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: acme.id, email: "admin@acme.test" } },
    update: {},
    create: {
      email: "admin@acme.test",
      passwordHash,
      role: Role.ADMIN,
      tenantId: acme.id,
    },
  });

  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: acme.id, email: "user@acme.test" } },
    update: {},
    create: {
      email: "user@acme.test",
      passwordHash,
      role: Role.MEMBER,
      tenantId: acme.id,
    },
  });

  await prisma.user.upsert({
    where: {
      tenantId_email: { tenantId: globex.id, email: "admin@globex.test" },
    },
    update: {},
    create: {
      email: "admin@globex.test",
      passwordHash,
      role: Role.ADMIN,
      tenantId: globex.id,
    },
  });

  await prisma.user.upsert({
    where: {
      tenantId_email: { tenantId: globex.id, email: "user@globex.test" },
    },
    update: {},
    create: {
      email: "user@globex.test",
      passwordHash,
      role: Role.MEMBER,
      tenantId: globex.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
