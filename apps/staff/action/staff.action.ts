"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { StaffWithRelations } from "@/types/staff.types";
import { Prisma, Staff } from "@/generated/prisma";
import { newStaffSchema, updateStaffSchema } from "@/lib/schema/staff.schema";
import { z } from "zod";
import { v4 } from "uuid";
import { insertActivityLog } from "@/lib/activity-log";
import { assertCanMutateStaffRecord, getAuthenticatedActorAccess } from "@/lib/role-access";

type StaffSnapshot = {
  staffId: string;
  name: string;
  email: string;
  phoneNumber: string;
  position: string;
  activeStatus: boolean;
  isPublished: boolean;
  isArchived: boolean;
  coverArea: string | null;
  divisionName: string;
};

function buildStaffChangeDetails(before: StaffSnapshot, after: StaffSnapshot) {
  const fields: Array<[label: string, from: unknown, to: unknown]> = [
    ["Staff ID", before.staffId, after.staffId],
    ["Name", before.name, after.name],
    ["Email", before.email, after.email],
    ["Phone Number", before.phoneNumber, after.phoneNumber],
    ["Position", before.position, after.position],
    ["Active Status", before.activeStatus, after.activeStatus],
    ["Published", before.isPublished, after.isPublished],
    ["Archived", before.isArchived, after.isArchived],
    ["Cover Area", before.coverArea, after.coverArea],
    ["Division", before.divisionName, after.divisionName],
  ];

  const changes = fields
    .filter(([, from, to]) => from !== to)
    .map(([field, from, to]) => ({ field, from, to }));

  return changes.length > 0 ? { changes } : null;
}

export async function getStaffAction() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const staffs = (await db.staff.findMany({
    where: { isArchived: false },
    include: { division: true, createdBy: true },
  })) as StaffWithRelations[];

  const linkedUsers = await db.$queryRaw<
    Array<{ id: string; userId: string | null }>
  >`
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

export async function createStaffAction(data: Prisma.StaffCreateInput) {
  const { session } = await getAuthenticatedActorAccess();

  const createdStaff = (await db.staff.create({
    data: {
      ...data,
      createdBy: {
        connect: { id: session.user.id },
      },
    },
    include: { division: true },
  })) as Staff & { division: { name: string } };

  await insertActivityLog({
    actorUserId: session.user.id,
    actorEmail: session.user.email,
    action: "CREATE_STAFF",
    targetStaffId: createdStaff.id,
    targetEmail: createdStaff.email,
    details: {
      staffId: createdStaff.staffId,
      position: createdStaff.position,
      division: createdStaff.division.name,
    },
  });

  return createdStaff;
}

export const createNewStaff = async (
  params: z.infer<typeof newStaffSchema>,
) => {
  const { session } = await getAuthenticatedActorAccess();

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
  const createdStaff = await db.staff.create({
    data: staffData,
    include: { division: true },
  });

  await insertActivityLog({
    actorUserId: session.user.id,
    actorEmail: session.user.email,
    action: "CREATE_STAFF",
    targetStaffId: createdStaff.id,
    targetEmail: createdStaff.email,
    details: {
      staffId: createdStaff.staffId,
      position: createdStaff.position,
      division: createdStaff.division.name,
    },
  });
};

export const getAllStaffAndDivisions = async () => {
  const staff = await db.staff.findMany({
    include: { division: true, createdBy: true },
  });
  const divisions = await db.division.findMany();
  return { staff, divisions };
};

export async function archiveStaff(id: string) {
  if (!id) throw new Error("Missing id");
  const { session, staff } = await assertCanMutateStaffRecord(id, {
    actionLabel: "mengarsipkan",
  });

  const updatedStaff = await db.staff.update({
    where: { id },
    data: { isArchived: true, isPublished: false, activeStatus: false },
  });

  await insertActivityLog({
    actorUserId: session.user.id,
    actorEmail: session.user.email,
    action: "ARCHIVE_STAFF",
    targetStaffId: updatedStaff.id,
    targetEmail: updatedStaff.email,
    details: {
      previousArchived: staff.isArchived,
      nextArchived: updatedStaff.isArchived,
    },
  });

  return updatedStaff;
}

export const unArchiveStaff = async (id: string) => {
  if (!id) throw new Error("Missing id");
  const { session, staff } = await assertCanMutateStaffRecord(id, {
    actionLabel: "memulihkan",
  });

  const updatedStaff = await db.staff.update({
    where: { id },
    data: { isArchived: false, isPublished: true, activeStatus: true },
  });

  await insertActivityLog({
    actorUserId: session.user.id,
    actorEmail: session.user.email,
    action: "UNARCHIVE_STAFF",
    targetStaffId: updatedStaff.id,
    targetEmail: updatedStaff.email,
    details: {
      previousArchived: staff.isArchived,
      nextArchived: updatedStaff.isArchived,
    },
  });

  return updatedStaff;
};

export async function togglePublishStaff(id: string) {
  if (!id) throw new Error("Missing id");
  const { session, staff } = await assertCanMutateStaffRecord(id, {
    actionLabel: "mengubah publish status",
  });

  const updatedStaff = await db.staff.update({
    where: { id },
    data: { isPublished: !staff.isPublished },
  });

  await insertActivityLog({
    actorUserId: session.user.id,
    actorEmail: session.user.email,
    action: updatedStaff.isPublished ? "PUBLISH_STAFF" : "UNPUBLISH_STAFF",
    targetStaffId: updatedStaff.id,
    targetEmail: updatedStaff.email,
    details: {
      previousPublished: staff.isPublished,
      nextPublished: updatedStaff.isPublished,
    },
  });

  return updatedStaff;
}

export async function toggleUnpublishStaff(id: string) {
  if (!id) throw new Error("Missing id");
  const { session, staff } = await assertCanMutateStaffRecord(id, {
    actionLabel: "mengubah publish status",
  });

  const updatedStaff = await db.staff.update({
    where: { id },
    data: { isPublished: false },
  });

  await insertActivityLog({
    actorUserId: session.user.id,
    actorEmail: session.user.email,
    action: "UNPUBLISH_STAFF",
    targetStaffId: updatedStaff.id,
    targetEmail: updatedStaff.email,
    details: {
      previousPublished: staff.isPublished,
      nextPublished: updatedStaff.isPublished,
    },
  });

  return updatedStaff;
}

export async function deleteStaff(id: string) {
  if (!id) throw new Error("Missing id");
  const { session } = await assertCanMutateStaffRecord(id, {
    actionLabel: "menghapus",
  });

  const deletedStaff = await db.staff.delete({ where: { id } });

  await insertActivityLog({
    actorUserId: session.user.id,
    actorEmail: session.user.email,
    action: "DELETE_STAFF",
    targetStaffId: deletedStaff.id,
    targetEmail: deletedStaff.email,
    details: {
      staffId: deletedStaff.staffId,
      name: deletedStaff.name,
    },
  });

  return deletedStaff;
}

export async function restoreStaff(id: string) {
  if (!id) throw new Error("Missing id");
  const { session, staff } = await assertCanMutateStaffRecord(id, {
    actionLabel: "merestore",
  });

  const restoredStaff = await db.staff.update({
    where: { id },
    data: { isArchived: false },
  });

  await insertActivityLog({
    actorUserId: session.user.id,
    actorEmail: session.user.email,
    action: "RESTORE_STAFF",
    targetStaffId: restoredStaff.id,
    targetEmail: restoredStaff.email,
    details: {
      previousArchived: staff.isArchived,
      nextArchived: restoredStaff.isArchived,
    },
  });

  return restoredStaff;
}

export const toggleInActiveStaff = async (id: string, data: boolean) => {
  const { session, staff: staffId } = await assertCanMutateStaffRecord(id, {
    actionLabel: "mengubah status aktif",
  });

  const updatedStaff = await db.staff.update({
    where: { id },
    data: { activeStatus: data },
  });

  await insertActivityLog({
    actorUserId: session.user.id,
    actorEmail: session.user.email,
    action: data ? "SET_STAFF_ACTIVE" : "SET_STAFF_INACTIVE",
    targetStaffId: updatedStaff.id,
    targetEmail: updatedStaff.email,
    details: {
      previousActiveStatus: staffId.activeStatus,
      nextActiveStatus: updatedStaff.activeStatus,
    },
  });

  return updatedStaff;
};

export const getStaffDataArchived = async () => {
  const archivedStaff = (await db.staff.findMany({
    where: {
      isArchived: true,
    },
    include: { division: true, createdBy: true },
  })) as StaffWithRelations[];

  const linkedUsers = await db.$queryRaw<
    Array<{ id: string; userId: string | null }>
  >`
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
};

export const getDivision = async () => {
  return await db.division.findMany({
    orderBy: { createdAt: "asc" },
  });
};

export const updateStaff = async (
  id: string,
  data: z.infer<typeof updateStaffSchema>,
) => {
  const { session } = await assertCanMutateStaffRecord(id, {
    actionLabel: "memperbarui",
  });
  const validatedData = updateStaffSchema.parse({ ...data, id });
  const existingStaff = await db.staff.findUnique({
    where: { id },
    include: { division: true },
  });

  if (!existingStaff) {
    throw new Error("Not found");
  }

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
  const updatedStaff = await db.staff.update({
    where: { id },
    data: staffData,
    include: { division: true },
  });

  await insertActivityLog({
    actorUserId: session.user.id,
    actorEmail: session.user.email,
    action: "UPDATE_STAFF",
    targetStaffId: updatedStaff.id,
    targetEmail: updatedStaff.email,
    details: buildStaffChangeDetails(
      {
        staffId: existingStaff.staffId,
        name: existingStaff.name,
        email: existingStaff.email,
        phoneNumber: existingStaff.phoneNumber,
        position: existingStaff.position,
        activeStatus: existingStaff.activeStatus,
        isPublished: existingStaff.isPublished,
        isArchived: existingStaff.isArchived,
        coverArea: existingStaff.coverArea,
        divisionName: existingStaff.division.name,
      },
      {
        staffId: updatedStaff.staffId,
        name: updatedStaff.name,
        email: updatedStaff.email,
        phoneNumber: updatedStaff.phoneNumber,
        position: updatedStaff.position,
        activeStatus: updatedStaff.activeStatus,
        isPublished: updatedStaff.isPublished,
        isArchived: updatedStaff.isArchived,
        coverArea: updatedStaff.coverArea,
        divisionName: updatedStaff.division.name,
      },
    ),
  });

  return updatedStaff;
};
