import prisma from "@/lib/db"
import { StaffTypes } from "@/types/staff.types"

export const getStaffDetails = async (staffId: string | undefined): Promise<StaffTypes | null> => {
    if (!staffId) return null

    const user = await prisma.staff.findUnique({
        where: { staffId },
        include: { division: true },
    })

    if (!user) return null

    const staff: StaffTypes = {
        id: user.id,
        staffId: user.staffId,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
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
        image: user.avatarUrl ?? "",
        coverArea: user.coverArea ?? "",
    }

    return staff
}