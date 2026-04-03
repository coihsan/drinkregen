
export const ROLE = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
} as const;

export type ROLE = (typeof ROLE)[keyof typeof ROLE];

export const Statuses = {
  Success: 'SUCCESS',
  Pending: 'PENDING',
  Failed: 'FAILED',
} as const;

export enum COMPANY_NAME {
    REGEN = "Regen",
}

export enum PermissionEnum {
    MANAGE_STAFF = "MANAGE_STAFF",
    VIEW_STAFF = "VIEW_STAFF",
    MANAGE_PERMISSIONS = "MANAGE_PERMISSIONS",
    VIEW_PERMISSIONS = "VIEW_PERMISSIONS",
}