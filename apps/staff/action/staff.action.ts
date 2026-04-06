"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { StaffWithRelations } from "@/types/staff.types";
import { Prisma, Staff } from "@/generated/prisma";
import { newStaffSchema, updateStaffSchema } from "@/lib/schema/staff.schema";
import { z } from "zod";
import { v4 } from "uuid";

export async function getStaffAction() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const staffs = await db.staff.findMany({
    where: { isArchived: false },
    include: { division: true, createdBy: true },
  }) as StaffWithRelations[];

  const linkedUsers = await db.$queryRaw<Array<{ id: string; userId: string | null }>>`
    SELECT "id", "userId"
    FROM "staff"
    WHERE "isArchived" = false
  `;

  const linkedUserMap = new Map(
    linkedUsers.map((staff) => [staff.id, staff.userId]),
  );

  return staffs.map((staff) => ({
    ...staff,
    userId: linkedUserMap.get(staff.id) ?? null,
  })) as StaffWithRelations[];
}

export async function createStaffAction(data: any) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return await db.staff.create({
    data: {
      ...data,
      createdBy: {
        connect: { id: session.user.id },
      },
    },
  }) as Staff;
}

export const createNewStaff = async (
  params: z.infer<typeof newStaffSchema>,
) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

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
    createdBy: {
      connect: { id: session.user.id },
    },
    division: divisionConnectOrCreate,
  };
  await db.staff.create({ data: staffData });
};

export const getAllStaffAndDivisions = async () => {
  const staff = await db.staff.findMany({ include: { division: true, createdBy: true } });
  const divisions = await db.division.findMany();
  return { staff, divisions };
};

export async function archiveStaff(id: string) {
  if (!id) throw new Error("Missing id");
  const staff = await db.staff.findUnique({ where: { id } });
  if (!staff) throw new Error("Not found");
  return db.staff.update({ where: { id }, data: { isArchived: true, isPublished: false, activeStatus: false } });
}

export const unArchiveStaff = async (id: string) => {
  if (!id) throw new Error("Missing id");
  const staff = await db.staff.findUnique({ where: { id } });
  if (!staff) throw new Error("Not found");
  return db.staff.update({ where: { id }, data: { isArchived: false, isPublished: true, activeStatus: true } });
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

export async function toggleUnpublishStaff(id: string) {
  if (!id) throw new Error("Missing id");
  const staff = await db.staff.findUnique({ where: { id } });
  if (!staff) throw new Error("Not found");
  return db.staff.update({ where: { id }, data: { isPublished: false } });
}

export async function deleteStaff(id: string) {
  if (!id) throw new Error("Missing id");
  const staff = await db.staff.findUnique({ where: { id } });
  if (!staff) throw new Error("Not found");
  return db.staff.delete({ where: { id } });
}

export async function restoreStaff(id: string) {
  if (!id) throw new Error("Missing id");
  const staff = await db.staff.findUnique({ where: { id } });
  if (!staff) throw new Error("Not found");
  return db.staff.update({ where: { id }, data: { isArchived: false } });
}

export const getStaffDataArchived = async () => {
  const archivedStaff = await db.staff.findMany({
    where: { 
      isArchived: true,
     },
    include: { division: true, createdBy: true },
  }) as StaffWithRelations[];

  const linkedUsers = await db.$queryRaw<Array<{ id: string; userId: string | null }>>`
    SELECT "id", "userId"
    FROM "staff"
    WHERE "isArchived" = true
  `;

  const linkedUserMap = new Map(
    linkedUsers.map((staff) => [staff.id, staff.userId]),
  );

  return archivedStaff.map((staff) => ({
    ...staff,
    userId: linkedUserMap.get(staff.id) ?? null,
  })) as StaffWithRelations[];
}

export const getDivision = async () => {
  return await db.division.findMany({
    orderBy: { createdAt: "asc" },
  });
};

export const updateStaff = async (id: string, data: z.infer<typeof updateStaffSchema>) => {
  const validatedData = updateStaffSchema.parse({ ...data, id });
  const divisionName = validatedData.division?.name?.trim() || "Unassigned";
  const divisionConnectOrCreate: Prisma.DivisionCreateNestedOneWithoutStaffInput = {
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
  const staffData: Prisma.StaffUpdateInput = {
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
  return db.staff.update({ where: { id }, data: staffData });
};

// export const searchStaff = async (query: string) => {
//   return await db.staff.findMany({
//     where: {
//       OR: [
//         { name: { contains: query, mode: "insensitive" } },
//         { email: { contains: query, mode: "insensitive" } },
//         { phoneNumber: { contains: query, mode: "insensitive" } },
//         { position: { contains: query, mode: "insensitive" } },
//         { division: { name: { contains: query, mode: "insensitive" } } },
//       ],
//       isArchived: false,
//     },
//     include: { division: true },
//   }) as StaffWithRelations[];
// }
