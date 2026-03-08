"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 } from "uuid";

type MakeAdminParams = {
  userId: string;
  password: string;
  accountEmail?: string;
};

export const makeAdmin = async ({ userId, password, accountEmail }: MakeAdminParams) => {
  if (!userId) throw new Error("userId is required");
  if (!password || password.length < 6) throw new Error("password is required and must be >= 6 chars");

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.update({ where: { id: userId }, data: { role: "ADMIN" } });
  const existing = await prisma.account.findFirst({ where: { userId, providerId: "credentials" } });

  if (existing) {
    await prisma.account.update({ where: { id: existing.id }, data: { password: hashed, updatedAt: new Date() } });
  } else {
    await prisma.account.create({
      data: {
        id: v4(),
        accountId: accountEmail || userId,
        providerId: "credentials",
        userId,
        password: hashed,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  return true;
};
