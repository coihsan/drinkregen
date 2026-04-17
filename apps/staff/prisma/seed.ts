import db from "../lib/db";
import { generateId } from "better-auth";
import { hashPassword } from "better-auth/crypto";

const SUPER_ADMIN_EMAIL = "superadmin@webkantor.com";
const SUPER_ADMIN_PASSWORD = "GantiPasswordIni123!";
const SUPER_ADMIN_NAME = "Super Admin";
const SUPER_ADMIN_STAFF_CODE = "SA-0001";
const DEFAULT_DIVISION_NAME = "Management";

async function ensureDivision() {
  return db.division.upsert({
    where: { name: DEFAULT_DIVISION_NAME },
    update: {},
    create: {
      id: generateId(),
      name: DEFAULT_DIVISION_NAME,
    },
  });
}

async function ensureSuperAdminUser() {
  const existingUser = await db.user.findUnique({
    where: { email: SUPER_ADMIN_EMAIL },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      accounts: {
        select: {
          id: true,
        },
      },
    },
  });

  if (existingUser) {
    const user = await db.user.update({
      where: { id: existingUser.id },
      data: {
        name: SUPER_ADMIN_NAME,
        role: "superadmin",
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (existingUser.accounts.length === 0) {
      await db.account.create({
        data: {
          id: generateId(),
          accountId: existingUser.id,
          providerId: "credential",
          userId: existingUser.id,
          password: await hashPassword(SUPER_ADMIN_PASSWORD),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return {
      ...user,
      wasCreated: false,
    };
  }

  const passwordHash = await hashPassword(SUPER_ADMIN_PASSWORD);
  const now = new Date();
  const userId = generateId();

  await db.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        id: userId,
        name: SUPER_ADMIN_NAME,
        email: SUPER_ADMIN_EMAIL,
        emailVerified: false,
        role: "superadmin",
        createdAt: now,
        updatedAt: now,
      },
    });

    await tx.account.create({
      data: {
        id: generateId(),
        accountId: userId,
        providerId: "credential",
        userId,
        password: passwordHash,
        createdAt: now,
        updatedAt: now,
      },
    });
  });

  return {
    id: userId,
    email: SUPER_ADMIN_EMAIL,
    name: SUPER_ADMIN_NAME,
    wasCreated: true,
  };
}

async function ensureSuperAdminStaff(userId: string, divisionId: string) {
  const existingStaff = (
    await db.$queryRaw<Array<{ id: string; staffId: string }>>`
      SELECT "id", "staffId"
      FROM "staff"
      WHERE "userId" = ${userId}
         OR "email" = ${SUPER_ADMIN_EMAIL}
      LIMIT 1
    `
  )[0];

  if (existingStaff) {
    await db.$executeRaw`
      UPDATE "staff"
      SET
        "name" = ${SUPER_ADMIN_NAME},
        "email" = ${SUPER_ADMIN_EMAIL},
        "staffId" = ${SUPER_ADMIN_STAFF_CODE},
        "phoneNumber" = ${"-"},
        "position" = ${"Super Admin"},
        "userId" = ${userId},
        "divisionId" = ${divisionId},
        "activeStatus" = ${true},
        "isArchived" = ${false},
        "isPublished" = ${true},
        "updatedAt" = ${new Date()}
      WHERE "id" = ${existingStaff.id}
    `;

    return {
      id: existingStaff.id,
      staffId: SUPER_ADMIN_STAFF_CODE,
    };
  }

  const createdStaff = (
    await db.$queryRaw<Array<{ id: string; staffId: string }>>`
      INSERT INTO "staff" (
        "id",
        "name",
        "staffId",
        "email",
        "userId",
        "phoneNumber",
        "position",
        "isArchived",
        "activeStatus",
        "isPublished",
        "joinedAt",
        "divisionId",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${generateId()},
        ${SUPER_ADMIN_NAME},
        ${SUPER_ADMIN_STAFF_CODE},
        ${SUPER_ADMIN_EMAIL},
        ${userId},
        ${"-"},
        ${"Super Admin"},
        ${false},
        ${true},
        ${true},
        ${new Date()},
        ${divisionId},
        ${new Date()},
        ${new Date()}
      )
      RETURNING "id", "staffId"
    `
  )[0];

  return createdStaff;
}

async function main() {
  const division = await ensureDivision();
  const superAdminUser = await ensureSuperAdminUser();
  const staff = await ensureSuperAdminStaff(superAdminUser.id, division.id);

  console.log(
    superAdminUser.wasCreated
      ? "Superadmin account created."
      : "Superadmin account already existed and was synchronized.",
  );
  console.log(`Email    : ${SUPER_ADMIN_EMAIL}`);
  console.log(`Password : ${SUPER_ADMIN_PASSWORD}`);
  console.log(`Staff ID : ${staff.staffId}`);
  console.log(`Division : ${division.name}`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
