import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { protectedAdminEmails } from "@/lib/admin-config";

export type ActorAccess = {
  id: string;
  email: string;
  role: string;
};

function normalizeRole(role?: string | null) {
  return (role ?? "").trim().replace(/[\s_]+/g, "").toLowerCase();
}

export function isAdminRole(role?: string | null) {
  return normalizeRole(role) === "admin";
}

export function isSuperAdminRole(role?: string | null) {
  return normalizeRole(role) === "superadmin";
}

export function isSuperAdminActor(actor: Pick<ActorAccess, "role" | "email">) {
  return (
    isSuperAdminRole(actor.role) ||
    protectedAdminEmails.has(actor.email.trim().toLowerCase())
  );
}

export async function getAuthenticatedActorAccess() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const actor = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, role: true },
  });

  if (!actor) {
    throw new Error("Unauthorized");
  }

  return {
    session,
    actor,
  };
}

export async function assertSuperAdminAccess() {
  const { session, actor } = await getAuthenticatedActorAccess();

  if (!isSuperAdminActor(actor)) {
    throw new Error("Only the SUPER ADMIN can manage admin accounts.");
  }

  return { session, actor };
}

export async function assertCanMutateStaffRecord(
  staffId: string,
  options?: {
    actionLabel?: string;
  },
) {
  const { session, actor } = await getAuthenticatedActorAccess();

  const staff = (
    await db.$queryRaw<
      Array<{
        id: string;
        name: string;
        email: string;
        userId: string | null;
        isArchived: boolean;
        activeStatus: boolean;
        isPublished: boolean;
        staffId: string;
        phoneNumber: string;
        position: string;
        coverArea: string | null;
        division: {
          id: string;
          name: string;
          createdAt: Date;
          updatedAt: Date;
        };
      }>
    >`
      SELECT
        s."id",
        s."name",
        s."email",
        s."userId",
        s."isArchived",
        s."activeStatus",
        s."isPublished",
        s."staffId",
        s."phoneNumber",
        s."position",
        s."coverArea",
        json_build_object(
          'id', d."id",
          'name', d."name",
          'createdAt', d."createdAt",
          'updatedAt', d."updatedAt"
        ) AS "division"
      FROM "staff" s
      INNER JOIN "division" d
        ON d."id" = s."divisionId"
      WHERE s."id" = ${staffId}
      LIMIT 1
    `
  )[0];

  if (!staff) {
    throw new Error("Not found");
  }

  const linkedUser = staff.userId
    ? await db.user.findUnique({
        where: { id: staff.userId },
        select: {
          id: true,
          email: true,
          role: true,
        },
      })
    : null;

  const isLinkedAdmin =
    !!staff.userId &&
    !!linkedUser &&
    (isAdminRole(linkedUser.role) || isSuperAdminRole(linkedUser.role));

  if (isLinkedAdmin && !isSuperAdminActor(actor)) {
    const actionLabel = options?.actionLabel ?? "mengubah";
    throw new Error(
      `Only the SUPER ADMIN can ${actionLabel} staff who already have an ADMIN account.`,
    );
  }

  return {
    session,
    actor,
    staff,
    linkedUser,
    isLinkedAdmin,
  };
}
