import { Division, Staff } from "@/generated/prisma";
import { COMPANY_NAME, ROLE } from "./enums";
import { UserTypes } from "./user.types";
import { User } from "better-auth";

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
    phoneNumber: string;
    position: string;
    avatarUrl?: string | null;
    image?: string;
    isArchived?: boolean;
    createdAt: Date | string;
    createdById?: string | null;
    createdBy?: UserTypes | null;
    updatedAt: Date | string;
    activeStatus: boolean;
    isPublished: boolean;
    joinedAt: Date | string;
    coverArea: string | null;
    divisionId?: string;
    division: StaffDivision;
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
    division: Division;
    createdBy?: UserTypes | null;
};