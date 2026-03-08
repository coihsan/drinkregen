import { COMPANY_NAME, ROLE } from "./enums";

export interface StaffDivision {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
} 

export interface StaffTypes {
    id: string;
    staffId: string;
    emailVerified?: boolean;
    name: string;
    email: string;
    phoneNumber: string;
    role: ROLE;
    position: string;
    division: StaffDivision;
    activeStatus: boolean;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    joinedAt: string;
    image: string;
    coverArea: string;
    password?: string;
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