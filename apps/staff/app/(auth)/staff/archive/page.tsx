"use client"

import { StaffTypes } from "@/types/staff.types"
import StaffList from "../_components/staff-list"
import { useState } from "react";

const StaffArchivePage = () => {
    const [staffList, setStaffList] = useState<StaffTypes[]>([]);

    const filterStaffByArchived = (staff: StaffTypes) => {
        return staff.isArchived;
    }

    return (
        <main className="p-4">
            <h1 className="text-xl text-green-500 font-bold">Staff Archive</h1>
            <p>List of archived staff members.</p>
            <StaffList staffList={staffList.filter(filterStaffByArchived)} />
        </main>
    )
}
export default StaffArchivePage