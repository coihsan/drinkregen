"use client"
 
import { ColumnDef } from "@tanstack/react-table"

interface Column {
    staffId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    division: string;
    activeStatus: boolean;
}

export const columns: ColumnDef<Column>[] = [
    { accessorKey: "staffId",header: "Staff ID"},
    { accessorKey: "fullName", header: "Full Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phoneNumber", header: "Phone Number" },
    { accessorKey: "division", header: "Division" },
    { accessorKey: "activeStatus", header: "Active Status" },
]