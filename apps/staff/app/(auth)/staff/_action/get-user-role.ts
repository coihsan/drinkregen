"use server";

import db from "@/lib/db";

export const getUserRole = async (userId: string) => {
  const user = await db.user.findUnique({ where: { id: userId }, select: { role: true } });
  return user?.role ?? "Unknown";
};
