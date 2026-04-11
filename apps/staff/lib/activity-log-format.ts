export const ACTIVITY_ACTION_LABELS: Record<string, string> = {
  CREATE_ADMIN_FROM_STAFF: "Create admin",
  UPDATE_ADMIN_LOGIN_EMAIL: "Update admin login email",
  RESET_ADMIN_PASSWORD: "Reset admin password",
  DEMOTE_ADMIN_TO_STAFF: "Demote admin to staff",
  CREATE_STAFF: "Create staff",
  UPDATE_STAFF: "Update staff",
  ARCHIVE_STAFF: "Archive staff",
  UNARCHIVE_STAFF: "Unarchive staff",
  PUBLISH_STAFF: "Publish staff",
  UNPUBLISH_STAFF: "Unpublish staff",
  SET_STAFF_ACTIVE: "Set staff active",
  SET_STAFF_INACTIVE: "Set staff inactive",
  DELETE_STAFF: "Delete staff",
  RESTORE_STAFF: "Restore staff",
};

export function formatActivityAction(action: string) {
  return ACTIVITY_ACTION_LABELS[action] ?? action;
}

function formatScalar(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return JSON.stringify(value);
}

export function formatActivityDetails(details: string | null) {
  if (!details) {
    return "-";
  }

  try {
    const parsed = JSON.parse(details) as Record<string, unknown>;

    if (Array.isArray(parsed.changes)) {
      return parsed.changes
        .map((change) => {
          if (!change || typeof change !== "object") return null;

          const item = change as Record<string, unknown>;
          const field = typeof item.field === "string" ? item.field : "Field";

          return `${field}: ${formatScalar(item.from)} -> ${formatScalar(item.to)}`;
        })
        .filter(Boolean)
        .join(" | ");
    }

    return Object.entries(parsed)
      .map(([key, value]) => {
        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (char) => char.toUpperCase());

        return `${label}: ${formatScalar(value)}`;
      })
      .join(" | ");
  } catch {
    return details;
  }
}
