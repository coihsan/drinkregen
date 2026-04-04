"use client";

import StaffList from "../_components/staff-list";
import { Loading } from "@workspace/ui/components/loading";
import { useStaff } from "@/hooks/use-staff";
import BlankPage from "@/components/primitive/blank-page";
import { useMemo, useState } from "react";
import SearchBar from "@/components/search-bar";
import SubHeader from "@/components/primitive/sub-header";

const StaffArchivePage = () => {
  const { fetchStaffArchived, isLoading } = useStaff();
  const [query, setQuery] = useState("");

  const filteredStaffs = useMemo(() => {
      const q = query.toLowerCase();
      return (fetchStaffArchived || []).filter((staff) => {
        return (
          staff.name.toLowerCase().includes(q) ||
          staff.email.toLowerCase().includes(q)
        );
      });
    }, [fetchStaffArchived, query]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading className="h-32 w-32" />
      </div>
    );
  }

  if (!fetchStaffArchived || fetchStaffArchived.length === 0) {
    return (
      <BlankPage title="No Archived Staff" description="There are no archived staff members to display." />
    );
  }
    return (
      <main>
        <SubHeader title="Staff Archive">
          <SearchBar searchQuery={setQuery} />
        </SubHeader>
        <StaffList staffList={filteredStaffs} />
      </main>
    );
};
export default StaffArchivePage;
