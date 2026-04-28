"use client";

import { Button } from "@workspace/ui/components/button";
import { Archive, LayoutGrid, List, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo, ViewTransition } from "react";
import { Loading } from "@workspace/ui/components/loading";
import { useStaff } from "@/hooks/use-staff";
import StaffCard from "./_components/staff-card";
import { useSession } from "@/lib/auth-client";
import SearchBar from "@/components/search-bar";
import BlankPage from "@/components/primitive/blank-page";
import { greetingBasedOnTime } from "@/lib/helpers";
import { Badge } from "@workspace/ui/components/badge";
import SubHeader from "@/components/primitive/sub-header";
import useLocalStorage from "@/hooks/use-localstorage";
import { DataTable } from "@/components/primitive/data-table";
import { staffColumns } from "@/components/primitive/table-configs";

const StaffManagementPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [viewMode, setViewMode] = useLocalStorage<"grid" | "table">("staffViewMode", "grid");

  const { staffs, isLoading, fetchStaffArchived } = useStaff();
  const [query, setQuery] = useState("");

  const filteredStaffs = useMemo(() => {
    const q = query.toLowerCase();
    return (staffs || []).filter((staff) => {
      return (
        staff.name.toLowerCase().includes(q) ||
        staff.email.toLowerCase().includes(q)
      );
    });
  }, [staffs, query]);

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "table" : "grid");
  };

  const totalIndexStaffSearch = () => {
    return filteredStaffs.length;
  };

  const totalArchived = useMemo(() => {
    return (fetchStaffArchived || []).filter((s) => s.isArchived === true)
      .length;
  }, [fetchStaffArchived]);

  const user = session;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading className="h-32 w-32" />
      </div>
    );
  }

  return (
    <ViewTransition default={"none"} enter="slide-up" exit="slide-down">
      <div className="relative overflow-x-scroll bg-background p-6 rounded-xl">
        <SubHeader
          title={`${greetingBasedOnTime()}, ${user?.user.name || "User"}!`}
        >
          <Button
            onClick={toggleViewMode}
            variant={"outline"}
            title={`Switch to ${viewMode === "grid" ? "Table" : "Grid"} View`}
          >
            {viewMode === "grid" ? (
              <List className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </Button>
          <SearchBar
            className="max-w-xs"
            totalIndex={totalIndexStaffSearch()}
            searchQuery={(value) => {
              setQuery(value);
            }}
          />
          <Button onClick={() => router.push("/staff/new-staff")}>
            <Plus />
            New
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => router.push("/staff/archive")}
          >
            <Archive />
            Archive
            <Badge variant={"default"}>{totalArchived}</Badge>
          </Button>
        </SubHeader>
        {filteredStaffs.length === 0 ? (
          <BlankPage
            title="Not found"
            description="No staff members match your search criteria."
          />
        ) : viewMode === "table" ? (
          <DataTable data={filteredStaffs} columns={staffColumns} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredStaffs.map((staff, index) => (
              <StaffCard key={index} staff={staff} />
            ))}
          </div>
        )}
      </div>
    </ViewTransition>
  );
};
export default StaffManagementPage;
