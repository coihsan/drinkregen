"use server";

import prisma from "@/lib/prisma";
import { newStaffSchema } from "@/lib/schema/staff";
import { v4 } from "uuid";
import z from "zod";

export const createNewStaff = async (
  params: z.infer<typeof newStaffSchema>,
) => {
  const validatedData = newStaffSchema.parse(params);

    const userData : any = {
        id: validatedData.id,
        staffId: validatedData.staffId,
        name: validatedData.name,
        email: validatedData.email,
        emailVerified: validatedData.emailVerified,
        phoneNumber: validatedData.phoneNumber,
        role: validatedData.role,
        position: validatedData.position,
        activeStatus: validatedData.activeStatus,
        isPublished: validatedData.isPublished,
        createdAt: validatedData.createdAt,
        updatedAt: validatedData.updatedAt,
        joinedAt: validatedData.joinedAt,
        image: validatedData.image,
        coverArea: validatedData.coverArea,
    };
    const divisionName = validatedData.division?.name?.trim() || "Unassigned";
    userData.division = {
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

    await prisma.user.create({ data: userData });
};

export const getAllStaffAndDivisions = async () => {
    const staff = await prisma.user.findMany({
        where: { role: { in: ["STAFF", "ADMIN"] } },
        include: { division: true }
    });
    const divisions = await prisma.division.findMany();
    return { staff, divisions };
}