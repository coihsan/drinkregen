import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

async function main() {
  console.log("Prisma client constructor:", prisma.constructor.name);
  console.log("Prisma client keys:", Object.keys(prisma));
  console.log("Prisma client prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(prisma)).slice(0, 20));
  console.log("Has prisma.user?", typeof (prisma as any).user, (prisma as any).user);

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Password123!";

  // NOTE: In production, avoid logging plain passwords.
  console.log(`Seeding admin user: ${adminEmail} (password: ${adminPassword})`);

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await (prisma as any).user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      id: faker.string.uuid(),
      name: "Administrator",
      email: adminEmail,
      emailVerified: true,
      image: faker.image.avatar(),
      accounts: {
        create: {
          id: faker.string.uuid(),
          accountId: faker.string.alphanumeric(10),
          providerId: "credential",
          password: hashedPassword,
          accessToken: faker.string.alphanumeric(32),
          refreshToken: faker.string.alphanumeric(32),
          accessTokenExpiresAt: faker.date.future(),
        },
      },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
