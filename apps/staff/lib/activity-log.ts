import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { isAdminRole, isSuperAdminActor, isSuperAdminRole } from "@/lib/role-access";

export type ActivityLogParams = {
  actorUserId: string;
  actorEmail: string;
  action: string;
  targetStaffId?: string | null;
  targetUserId?: string | null;
  targetEmail?: string | null;
  details?: Record<string, unknown> | null;
};

export async function assertCanAccessActivityLogs() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const actor = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, email: true },
  });

  const canAccess =
    !!actor &&
    (isAdminRole(actor.role) ||
      isSuperAdminRole(actor.role) ||
      isSuperAdminActor(actor));

  if (!canAccess) {
    throw new Error("You do not have access to the activity log page.");
  }

  return session;
}

export async function insertActivityLog(params: ActivityLogParams) {
  const detailsJson = params.details ? JSON.stringify(params.details) : null;

  await db.$executeRaw`
    INSERT INTO "admin_audit_logs" (
      "id",
      "actorUserId",
      "actorEmail",
      "action",
      "targetStaffId",
      "targetUserId",
      "targetEmail",
      "details",
      "createdAt"
    )
    VALUES (
      ${crypto.randomUUID()},
      ${params.actorUserId},
      ${params.actorEmail},
      ${params.action},
      ${params.targetStaffId ?? null},
      ${params.targetUserId ?? null},
      ${params.targetEmail ?? null},
      ${detailsJson ? detailsJson : null}::jsonb,
      NOW()
    )
  `;
}
