"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { createAdminSchema } from "@/lib/schema/admin.schema";
import { hashPassword } from "better-auth/crypto";
import { protectedAdminEmails } from "@/lib/admin-config";
import { assertCanAccessActivityLogs, insertActivityLog } from "@/lib/activity-log";
import { assertSuperAdminAccess, getAuthenticatedActorAccess, isSuperAdminActor } from "@/lib/role-access";

export type AdminStaffItem = {
  staffId: string;
  staffCode: string;
  staffName: string;
  staffEmail: string;
  adminEmail: string;
  position: string;
  divisionName: string;
  activeStatus: boolean;
  isProtected: boolean;
};

type CreateAdminInput = {
  staffId: string;
  email: string;
  password: string;
};

type UpdateAdminLoginInput = {
  staffId: string;
  email: string;
};

type DemoteAdminInput = {
  staffId: string;
};

type ResetAdminPasswordInput = {
  staffId: string;
  password: string;
};

async function assertCanAccessAdminPanel() {
  return assertCanAccessActivityLogs();
}

export async function getAdminManagementScopeAction() {
  const { actor } = await getAuthenticatedActorAccess();

  return {
    canManageAdmins: isSuperAdminActor(actor),
  };
}

export async function getAdminStaffListAction(): Promise<AdminStaffItem[]> {
  await assertCanAccessAdminPanel();

  const admins = await db.$queryRaw<
    Array<Omit<AdminStaffItem, "isProtected">>
  >`
    SELECT
      s."id"           AS "staffId",
      s."staffId"      AS "staffCode",
      s."name"         AS "staffName",
      s."email"        AS "staffEmail",
      u."email"        AS "adminEmail",
      s."position"     AS "position",
      d."name"         AS "divisionName",
      s."activeStatus" AS "activeStatus"
    FROM "staff" s
    INNER JOIN "users" u
      ON u."id" = s."userId"
    INNER JOIN "division" d
      ON d."id" = s."divisionId"
    WHERE s."userId" IS NOT NULL
      AND LOWER(u."role") = 'admin'
    ORDER BY s."name" ASC
  `;

  return admins.map((admin) => ({
    ...admin,
    isProtected: protectedAdminEmails.has(admin.adminEmail.toLowerCase()),
  }));
}

export async function updateAdminLoginEmailAction(input: UpdateAdminLoginInput) {
  const { session } = await assertSuperAdminAccess();

  const normalizedEmail = input.email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Email login wajib diisi.");
  }

  const staff = (
    await db.$queryRaw<
      Array<{
        staffId: string;
        userId: string | null;
      }>
    >`
      SELECT "id" AS "staffId", "userId"
      FROM "staff"
      WHERE "id" = ${input.staffId}
      LIMIT 1
    `
  )[0];

  if (!staff?.userId) {
    throw new Error("Staff ini belum memiliki akun admin.");
  }

  const currentUser = await db.user.findUnique({
    where: { id: staff.userId },
    select: { email: true },
  });

  if (!currentUser) {
    throw new Error("Akun admin tidak ditemukan.");
  }

  if (protectedAdminEmails.has(currentUser.email.toLowerCase())) {
    throw new Error("Akun super admin inti tidak dapat diubah dari halaman ini.");
  }

  const existingUser = await db.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  if (existingUser && existingUser.id !== staff.userId) {
    throw new Error("Email login sudah digunakan user lain.");
  }

  await db.user.update({
    where: { id: staff.userId },
    data: {
      email: normalizedEmail,
      updatedAt: new Date(),
    },
  });

  await insertActivityLog({
    actorUserId: session.user.id,
    actorEmail: session.user.email,
    action: "UPDATE_ADMIN_LOGIN_EMAIL",
    targetStaffId: input.staffId,
    targetUserId: staff.userId,
    targetEmail: normalizedEmail,
    details: {
      previousEmail: currentUser.email,
      nextEmail: normalizedEmail,
    },
  });

  return { staffId: input.staffId, email: normalizedEmail };
}

export async function resetAdminPasswordAction(input: ResetAdminPasswordInput) {
  const { session } = await assertSuperAdminAccess();

  if (!input.password || input.password.length < 8) {
    throw new Error("Password minimal 8 karakter.");
  }

  const staff = (
    await db.$queryRaw<
      Array<{
        id: string;
        userId: string | null;
      }>
    >`
      SELECT "id", "userId"
      FROM "staff"
      WHERE "id" = ${input.staffId}
      LIMIT 1
    `
  )[0];

  if (!staff?.userId) {
    throw new Error("Staff ini belum memiliki akun admin.");
  }

  const currentUser = await db.user.findUnique({
    where: { id: staff.userId },
    select: { email: true },
  });

  if (!currentUser) {
    throw new Error("Akun admin tidak ditemukan.");
  }

  if (protectedAdminEmails.has(currentUser.email.toLowerCase())) {
    throw new Error("Password super admin inti tidak dapat direset dari halaman ini.");
  }

  const hashedPassword = await hashPassword(input.password);
  const existingAccount = await db.account.findFirst({
    where: { userId: staff.userId },
    select: { id: true },
  });

  if (existingAccount) {
    await db.account.update({
      where: { id: existingAccount.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });
  } else {
    await db.account.create({
      data: {
        id: crypto.randomUUID(),
        accountId: staff.userId,
        providerId: "credential",
        userId: staff.userId,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  await db.session.deleteMany({
    where: { userId: staff.userId },
  });

  await insertActivityLog({
    actorUserId: session.user.id,
    actorEmail: session.user.email,
    action: "RESET_ADMIN_PASSWORD",
    targetStaffId: input.staffId,
    targetUserId: staff.userId,
    targetEmail: currentUser.email,
    details: {
      sessionsRevoked: true,
    },
  });

  return { staffId: input.staffId };
}

export async function demoteAdminToStaffAction(input: DemoteAdminInput) {
  const { session } = await assertSuperAdminAccess();

  const staff = (
    await db.$queryRaw<
      Array<{
        id: string;
        userId: string | null;
      }>
    >`
      SELECT "id", "userId"
      FROM "staff"
      WHERE "id" = ${input.staffId}
      LIMIT 1
    `
  )[0];

  if (!staff?.userId) {
    throw new Error("Staff ini belum memiliki akun admin.");
  }

  const currentUser = await db.user.findUnique({
    where: { id: staff.userId },
    select: { email: true },
  });

  if (!currentUser) {
    throw new Error("Akun admin tidak ditemukan.");
  }

  if (protectedAdminEmails.has(currentUser.email.toLowerCase())) {
    throw new Error("Akun super admin inti tidak dapat didemote.");
  }

  await db.$transaction(async (tx) => {
    await tx.session.deleteMany({
      where: { userId: staff.userId! },
    });

    await tx.account.deleteMany({
      where: { userId: staff.userId! },
    });

    await tx.user.update({
      where: { id: staff.userId! },
      data: {
        role: "staff",
        updatedAt: new Date(),
      },
    });

    await tx.$executeRaw`
      UPDATE "staff"
      SET "userId" = NULL
      WHERE "id" = ${staff.id}
    `;
  });

  await insertActivityLog({
    actorUserId: session.user.id,
    actorEmail: session.user.email,
    action: "DEMOTE_ADMIN_TO_STAFF",
    targetStaffId: input.staffId,
    targetUserId: staff.userId,
    targetEmail: currentUser.email,
    details: {
      sessionsDeleted: true,
      credentialsDeleted: true,
    },
  });

  return { staffId: input.staffId };
}

export async function createAdminFromStaffAction(input: CreateAdminInput) {
  const { session } = await assertSuperAdminAccess();

  const validatedInput = createAdminSchema.parse(input);

  const staff = (
    await db.$queryRaw<
      Array<{
        id: string;
        name: string;
        email: string;
        isArchived: boolean;
        userId: string | null;
      }>
    >`
      SELECT "id", "name", "email", "isArchived", "userId"
      FROM "staff"
      WHERE "id" = ${validatedInput.staffId}
      LIMIT 1
    `
  )[0];

  if (!staff || staff.isArchived) {
    throw new Error("Staff yang dipilih tidak ditemukan.");
  }

  if (staff.userId) {
    throw new Error("Staff yang dipilih sudah memiliki akun admin.");
  }

  const existingUser = await db.user.findUnique({
    where: { email: validatedInput.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new Error("Email login sudah digunakan.");
  }

  await auth.api.createUser({
    body: {
      name: staff.name,
      email: validatedInput.email,
      password: validatedInput.password,
      role: "admin",
    },
  });

  const createdUser = await db.user.findUnique({
    where: { email: validatedInput.email },
    select: { id: true },
  });

  if (!createdUser) {
    throw new Error("Akun admin berhasil dibuat, tetapi relasi staff gagal ditemukan.");
  }

  await db.$executeRaw`
    UPDATE "staff"
    SET "userId" = ${createdUser.id}
    WHERE "id" = ${staff.id}
      AND "userId" IS NULL
  `;

  await insertActivityLog({
    actorUserId: session.user.id,
    actorEmail: session.user.email,
    action: "CREATE_ADMIN_FROM_STAFF",
    targetStaffId: staff.id,
    targetUserId: createdUser.id,
    targetEmail: validatedInput.email,
    details: {
      staffEmail: staff.email,
      loginEmail: validatedInput.email,
    },
  });

  return {
    staffId: staff.id,
    staffName: staff.name,
    defaultStaffEmail: staff.email,
  };
}
