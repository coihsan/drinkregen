import { Permission, UserPermission } from "@/generated/prisma/client"

interface UserWithPermissions {
  role: string
  permissions: UserPermission[]
}

export function hasPermission(
  user: UserWithPermissions,
  permission: Permission
): boolean {
  if (user.role === "superadmin") return true
  return user.permissions.some((p) => p.permission === permission)
}

export function hasAllPermissions(
  user: UserWithPermissions,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => hasPermission(user, p))
}
