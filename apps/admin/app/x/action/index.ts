import prisma from "@/lib/prisma"
import { StaffTypes } from "@/types/staff"

export const getStaffDetails = async (staffId: string | undefined): Promise<StaffTypes | null> => {
    if (!staffId) return null

    const user = await prisma.user.findUnique({
        where: { staffId },
        include: { division: true },
    })

    if (!user) return null

    const staff: StaffTypes = {
        id: user.id,
        staffId: user.staffId,
        emailVerified: user.emailVerified,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        position: user.position,
        division: {
            id: user.division.id,
            name: user.division.name,
            description: "",
            createdAt: user.division.createdAt.toISOString(),
            updatedAt: user.division.updatedAt.toISOString(),
        },
        activeStatus: user.activeStatus,
        isPublished: user.isPublished,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        joinedAt: user.joinedAt.toISOString(),
        image: user.image ?? "",
        coverArea: user.coverArea ?? "",
    }

    return staff
}