import { Division, Staff } from "@/generated/prisma";
import { COMPANY_NAME, ROLE } from "./enums";
import { UserTypes } from "./user.types";

export interface StaffDivision {
    id: string;
    name: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    description?: string;
    staff?: StaffTypes[];
} 

export interface StaffTypes {
    id: string;
    name: string;
    staffId: string;
    email: string;
    userId?: string | null;
    phoneNumber: string;
    position: string;
    avatarUrl?: string | null;
    image?: string;
    isArchived?: boolean;
    createdAt: Date | string;
    createdById?: string | null;
    updatedById?: string | null;
    createdBy?: UserTypes | null;
    updatedAt: Date | string;
    activeStatus: boolean;
    isPublished: boolean;
    joinedAt: Date | string;
    coverArea: string | null;
    divisionId?: string;
    division: StaffDivision;
    user?: UserTypes | null;
}

export interface EditStaffPageProps {
    id: string;
    staffId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: ROLE;
    position: string;
    activeStatus: boolean;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    joinedAt: string;
    photoUrl: string;
    staffDivisionId: StaffDivision;
}

export interface vCardStaff {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    position: string;
    divisionName: string;
    companyName: COMPANY_NAME.REGEN;
}

export type StaffWithRelations = Staff & {
    userId?: string | null;
    division: Division;
    createdBy?: UserTypes | null;
    user?: UserTypes | null;
};
