"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  type PaginationState,
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { getAdminStaffListAction } from "@/action/admin.action";
import { getAdminColumns } from "./admin-columns";
import AdminTable from "./admin-table";
import SearchBar from "@/components/search-bar";

const AdminList = () => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "staffName", desc: false },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["admin", "staff-list"],
    queryFn: () => getAdminStaffListAction(),
    staleTime: 1000 * 60 * 5,
  });

  const filteredAdmins = useMemo(() => {
    return data.filter((admin) => {
      return (
        statusFilter === "all" ||
        (statusFilter === "active" && admin.activeStatus) ||
        (statusFilter === "inactive" && !admin.activeStatus)
      );
    });
  }, [data, statusFilter]);
  const hasManageableRows = useMemo(
    () =>
      filteredAdmins.some(
        (admin) => admin.canEditLogin || admin.canResetPassword || admin.canDemote,
      ),
    [filteredAdmins],
  );
  const columns = useMemo(
    () => getAdminColumns(hasManageableRows),
    [hasManageableRows],
  );

  const table = useReactTable({
    data: filteredAdmins,
    columns,
    state: {
      sorting,
      globalFilter: query,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const normalizedQuery = String(filterValue).trim().toLowerCase();
      if (!normalizedQuery) return true;

      return [
        row.original.staffName,
        row.original.staffCode,
        row.original.staffEmail,
        row.original.adminEmail,
        row.original.adminRole,
        row.original.position,
        row.original.divisionName,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    },
  });

  const totalAdmin = () => {
    return filteredAdmins.length
  }

  return (
    <>
      <section className="space-y-4 rounded-2xl border bg-background p-6 overflow-x-auto sm:overflow-x-hidden">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Admin Staff</h2>
            <p className="text-sm text-muted-foreground">
              List of all staff members who are now admins.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 w-full sm:max-w-md gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "all" | "active" | "inactive")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <SearchBar totalIndex={totalAdmin()} className="w-full" searchQuery={(value) => setQuery(value)} placeHolder="Cari nama, email, staff ID, division" />
          </div>
        </div>

        <AdminTable table={table} isLoading={isLoading} isError={isError} />
      </section>
    </>
  );
};

export default AdminList;
