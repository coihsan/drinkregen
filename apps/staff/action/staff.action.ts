"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { StaffWithRelations } from "@/types/staff.types";
import { Prisma, Staff } from "@/generated/prisma";
import { newStaffSchema } from "@/lib/schema/staff.schema";
import { z } from "zod";
import { v4 } from "uuid";

export async function getStaffAction() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return await db.staff.findMany({
    where: { isArchived: false },
    include: { division: true },
  }) as StaffWithRelations[];
}

export async function createStaffAction(data: any) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return await db.staff.create({ ...data, createdBy: session.user.id }) as Staff;
}

export const createNewStaff = async (
  params: z.infer<typeof newStaffSchema>,
) => {
  const validatedData = newStaffSchema.parse(params);

  const divisionName = validatedData.division?.name?.trim() || "Unassigned";

  const divisionConnectOrCreate: Prisma.DivisionCreateNestedOneWithoutStaffInput =
    {
      connectOrCreate: {
        where: { name: divisionName },
        create: {
          id: validatedData.division?.id || v4(),
          name: divisionName,
          createdAt: validatedData.division?.createdAt || new Date(),
          updatedAt: validatedData.division?.updatedAt || new Date(),
        },
      },
    };
  const staffData: Prisma.StaffCreateInput = {
    id: validatedData.id,
    staffId: validatedData.staffId,
    name: validatedData.name,
    email: validatedData.email,
    phoneNumber: validatedData.phoneNumber,
    position: validatedData.position,
    activeStatus: validatedData.activeStatus,
    isPublished: validatedData.isPublished,
    createdAt: validatedData.createdAt,
    updatedAt: validatedData.updatedAt,
    joinedAt: validatedData.joinedAt,
    avatarUrl: validatedData.avatarUrl,
    coverArea: validatedData.coverArea,
    isArchived: validatedData.isArchived,
    division: divisionConnectOrCreate,
  };
  await db.staff.create({ data: staffData });
};

export const getAllStaffAndDivisions = async () => {
  const staff = await db.staff.findMany({ include: { division: true } });
  const divisions = await db.division.findMany();
  return { staff, divisions };
};

export async function archiveStaff(id: string) {
  if (!id) throw new Error("Missing id");
  const staff = await db.staff.findUnique({ where: { id } });
  if (!staff) throw new Error("Not found");
  return db.staff.update({ where: { id }, data: { isArchived: true } });
}

export async function togglePublishStaff(id: string) {
  if (!id) throw new Error("Missing id");
  const staff = await db.staff.findUnique({
    where: { id },
    select: { isPublished: true },
  });
  if (!staff) throw new Error("Not found");
  return db.staff.update({
    where: { id },
    data: { isPublished: !staff.isPublished },
  });
}

export async function unpublishStaff(id: string) {
  if (!id) throw new Error("Missing id");
  const staff = await db.staff.findUnique({ where: { id } });
  if (!staff) throw new Error("Not found");
  return db.staff.update({ where: { id }, data: { isPublished: false } });
}