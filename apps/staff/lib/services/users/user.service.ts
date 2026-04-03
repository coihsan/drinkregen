/**
 * user.service.ts
 *
 * Handles semua logika manajemen user:
 * 1. createUser    — buat user baru; jika OWNER/ADMIN → otomatis buat Account
 * 2. promoteToAdmin — ubah STAFF menjadi ADMIN + buat Account untuk mereka
 * 3. demoteToStaff  — turunkan ADMIN kembali ke STAFF + hapus Account mereka
 */

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateId } from "better-auth";
import { hashPassword } from "better-auth/crypto";
import { ROLE } from "@/types/enums";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type CreateUserInput = {
  name: string;
  email: string;
  phoneNumber: string;
  staffId: string;
  position: string;
  divisionId: string;
  role?: string;       // default: STAFF
  coverArea?: string;
  image?: string;
  joinedAt?: Date;
  isPublished?: boolean;
  activeStatus?: boolean;
  password?: string;
};

export type PromoteInput = {
  /** userId target yang akan dipromosikan */
  targetUserId: string;
  /** userId yang melakukan promosi (harus OWNER atau ADMIN) */
  promotedByUserId: string;
  /** Password awal untuk akun baru sang ADMIN */
  initialPassword: string;
};

export type DemoteInput = {
  targetUserId: string;
  demotedByUserId: string;
};

// ─────────────────────────────────────────────
// Guard helper
// ─────────────────────────────────────────────

async function assertCanManage(actorId: string) {
  const actor = await db.user.findUniqueOrThrow({
    where: { id: actorId },
    select: { role: true, name: true },
  });

  if (actor.role !== "OWNER" && actor.role !== "ADMIN") {
    throw new Error(
      `User "${actor.name}" (${actor.role}) tidak memiliki izin untuk melakukan aksi ini.`
    );
  }

  return actor;
}

// ─────────────────────────────────────────────
// 1. Create User
// ─────────────────────────────────────────────

export async function createUser(
  input: CreateUserInput,
  createdByUserId: string
) {
  // Validasi: yang membuat harus OWNER atau ADMIN
  await assertCanManage(createdByUserId);

  const accessLevel = input.role ?? ROLE.STAFF;

  if ((accessLevel === ROLE.ADMIN || accessLevel === ROLE.ADMIN || accessLevel === ROLE.ADMIN) && !input.password) {
    throw new Error("Password wajib diisi untuk user dengan accessLevel OWNER atau ADMIN.");
  }

  if (accessLevel === ROLE.STAFF && input.password) {
    throw new Error("STAFF tidak boleh memiliki password / akun login.");
  }

  // Cek email & staffId unik
  const existing = await db.staff.findFirst({
    where: { OR: [{ email: input.email }, { staffId: input.staffId }] },
  });
  if (existing) {
    throw new Error("Email atau Staff ID sudah terdaftar.");
  }

  const userId  = generateId();
  const now     = new Date();

  return db.$transaction(async (tx) => {
    // Buat User
    const user = await tx.user.create({
      data: {
        id:            userId,
        name:          input.name,
        email:         input.email,
        emailVerified: false,
        image:         input.image,
        createdAt:     now,
        updatedAt:     now,
      },
    });

    // Buat Account hanya untuk OWNER / ADMIN
    if (accessLevel !== ROLE.STAFF && input.password) {
      const hashed = await hashPassword(input.password);

      await tx.account.create({
        data: {
          id:         generateId(),
          accountId:  userId,
          providerId: "credential",
          userId:     userId,
          password:   hashed,
          createdAt:  now,
          updatedAt:  now,
        },
      });
    }

    return user;
  });
}

// ─────────────────────────────────────────────
// 2. Promote STAFF → ADMIN
// ─────────────────────────────────────────────

/**
 * Promosikan STAFF menjadi ADMIN.
 * - Ubah role → ADMIN
 * - Buat Account dengan password awal
 *
 * Hanya bisa dilakukan oleh OWNER atau ADMIN.
 */
export async function promoteToAdmin(input: PromoteInput) {
  await assertCanManage(input.promotedByUserId);

  const target = await db.user.findUniqueOrThrow({
    where: { id: input.targetUserId },
    include: { accounts: true },
  });

  if (target.role !== ROLE.STAFF) {
    throw new Error(
      `User "${target.name}" sudah memiliki role ${target.role}, bukan STAFF.`
    );
  }

  if (target.accounts.length > 0) {
    throw new Error(`User "${target.name}" sudah memiliki akun login.`);
  }

  const now    = new Date();
  const hashed = await hashPassword(input.initialPassword);

  return db.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: input.targetUserId },
      data:  { role: ROLE.ADMIN, updatedAt: now },
    });

    await tx.account.create({
      data: {
        id:         generateId(),
        accountId:  input.targetUserId,
        providerId: "credential",
        userId:     input.targetUserId,
        password:   hashed,
        createdAt:  now,
        updatedAt:  now,
      },
    });

    return updated;
  });
}

// ─────────────────────────────────────────────
// 3. Demote ADMIN → STAFF
// ─────────────────────────────────────────────

/**
 * Turunkan ADMIN kembali menjadi STAFF.
 * - Ubah role → STAFF
 * - Hapus semua Account & Session milik user tersebut
 *
 * Hanya OWNER yang boleh menurunkan user.
 * ADMIN tidak bisa menurunkan ADMIN lain (hanya OWNER).
 */
export async function demoteToStaff(input: DemoteInput) {
  const actor = await db.user.findUniqueOrThrow({
    where: { id: input.demotedByUserId },
    select: { role: true, name: true },
  });

  if (actor.role !== ROLE.ADMIN) {
    throw new Error("Hanya OWNER yang dapat menurunkan role ADMIN ke STAFF.");
  }

  const target = await db.user.findUniqueOrThrow({
    where: { id: input.targetUserId },
    select: { role: true, name: true },
  });

  if (target.role !== ROLE.ADMIN) {
    throw new Error(`User "${target.name}" bukan ADMIN.`);
  }

  const now = new Date();

  return db.$transaction(async (tx) => {
    // Hapus semua session aktif
    await tx.session.deleteMany({ where: { userId: input.targetUserId } });

    // Hapus semua account (credential)
    await tx.account.deleteMany({ where: { userId: input.targetUserId } });

    // Turunkan role
    return tx.user.update({
      where: { id: input.targetUserId },
      data:  { role: ROLE.STAFF, updatedAt: now },
    });
  });
}

// ─────────────────────────────────────────────
// 4. Get current session user (Server Component helper)
// ─────────────────────────────────────────────

/**
 * Gunakan di Server Component atau Server Action untuk
 * mendapatkan user yang sedang login beserta rolenya.
 *
 * @example
 * const { user } = await getAuthenticatedUser();
 * if (user.role !== "OWNER") throw new Error("Forbidden");
 */
export async function getAuthenticatedUser() {
  // Better Auth menyediakan `auth.api.getSession` untuk server-side
  const { headers } = await import("next/headers");
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthenticated");
  }

  // Pastikan ambil role paling akurat dari database — session user mungkin
  // tidak menyertakan `accessLevel` di tipenya dari better-auth.
  const dbUser = await db.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { role: true, name: true },
  });

  if (dbUser.role === ROLE.STAFF) {
    throw new Error("STAFF tidak memiliki akses ke panel admin.");
  }

  return session;
}
