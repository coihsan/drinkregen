"use client";

import { Loading } from "@workspace/ui/components/loading";
import { useStaff } from "@/hooks/use-staff";
import BlankPage from "@/components/primitive/blank-page";
import { useMemo, useState } from "react";
import SearchBar from "@/components/search-bar";
import SubHeader from "@/components/primitive/sub-header";
import StaffCard from "../_components/staff-card";

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
      <BlankPage
        title="No Archived Staff"
        description="There are no archived staff members to display."
      />
    );
  }
  const totalArchivedStaff = () => {
    return fetchStaffArchived.length
  }
  return (
    <main>
      <SubHeader title="Staff Archive">
        <SearchBar totalIndex={totalArchivedStaff()} searchQuery={setQuery} />
      </SubHeader>
      {filteredStaffs.length === 0 ? (
        <BlankPage
          title="Not found"
          description="No staff members match your search criteria."
          isButton
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredStaffs.map((staff, index) => (
            <StaffCard key={index} staff={staff} />
          ))}
        </div>
      )}
    </main>
  );
};
export default StaffArchivePage;
