import { Permission, UserPermission } from "@/generated/prisma"

interface UserWithPermissions {
  role: string
  permissions: UserPermission[]
}

/**
 * Cek apakah user memiliki permission tertentu.
 * Superadmin selalu dianggap memiliki semua permission.
 */
export function hasPermission(
  user: UserWithPermissions,
  permission: Permission
): boolean {
  if (user.role === "superadmin") return true
  return user.permissions.some((p) => p.permission === permission)
}

/**
 * Cek apakah user memiliki semua permission yang diberikan.
 */
export function hasAllPermissions(
  user: UserWithPermissions,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => hasPermission(user, p))
}
