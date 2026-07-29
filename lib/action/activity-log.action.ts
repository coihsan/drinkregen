"use server";

import db from "@/lib/db";
import { assertCanAccessActivityLogs } from "@/lib/activity-log";

export type ActivityLogItem = {
  id: string;
  actorEmail: string;
  action: string;
  targetStaffName: string | null;
  targetEmail: string | null;
  createdAt: Date;
  details: string | null;
};

export async function getActivityLogsAction(): Promise<ActivityLogItem[]> {
  await assertCanAccessActivityLogs();

  return db.$queryRaw<ActivityLogItem[]>`
    SELECT
      l."id" AS "id",
      l."actorEmail" AS "actorEmail",
      l."action" AS "action",
      s."name" AS "targetStaffName",
      l."targetEmail" AS "targetEmail",
      l."createdAt" AS "createdAt",
      CASE
        WHEN l."details" IS NULL THEN NULL
        ELSE l."details"::text
      END AS "details"
    FROM "admin_audit_logs" l
    LEFT JOIN "staff" s
      ON s."id" = l."targetStaffId"
    ORDER BY l."createdAt" DESC
    LIMIT 100
  `;
}
