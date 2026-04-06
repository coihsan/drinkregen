import { PermissionEnum } from "./enums";
import { StaffTypes } from "./staff.types";

export interface UserTypes {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    role: string;
    banned?: boolean;
    twoFactorEnabled?: boolean;
    banReason?: string;
    banExpires?: string;
    createdAt: string;
    updatedAt: string;
    accounts?: AccountTypes[];
    permissions?: UserPermissionTypes[];
    sessions?: SessionTypes[];
    createdStaff?: StaffTypes;
    staffProfile?: StaffTypes | null;
}

export interface AccountTypes {
    id: string;
    userId: string;
    accountId: string;
    providerId: string;
    password?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresAt?: string;
    createdAt: string;
    updatedAt: string;
    user?: UserTypes;
}

export interface SessionTypes {
    id: string;
    userId: string;
    token: string;
    expiresAt: string; 
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
    updatedAt: string;
    user?: UserTypes;
}

export interface UserPermissionTypes {
    id: string;
    userId: string;
    permission: PermissionEnum;
    createdAt: string;
    updatedAt: string;
}
