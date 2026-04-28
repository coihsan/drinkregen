"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Ellipsis, EllipsisVertical } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { AdminStaffItem } from "@/action/admin.action";
import AdminActionDialogs from "./admin-action-dialogs";

const roleLabelMap: Record<AdminStaffItem["adminRole"], string> = {
  admin: "Admin",
  superadmin: "Super Admin",
};

const SortButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <Button variant="ghost" className="px-2 py-1" onClick={onClick}>
    {label}
    <ArrowUpDown className="h-4 w-4" />
  </Button>
);

export const getAdminColumns = (
  canManageAdmins: boolean,
): ColumnDef<AdminStaffItem>[] => {
  const columns: ColumnDef<AdminStaffItem>[] = [
    {
    accessorKey: "staffName",
    header: ({ column }) => (
      <SortButton
        label="Staff"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.staffName}</div>
        <div className="text-muted-foreground text-xs">
          RGN-{row.original.staffCode}
        </div>
      </div>
    ),
  },
    {
    accessorKey: "staffEmail",
    header: ({ column }) => (
      <SortButton
        label="Staff Email"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
  },
    {
    accessorKey: "adminEmail",
    header: ({ column }) => (
      <SortButton
        label="Admin Login"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
  },
    {
    accessorKey: "adminRole",
    header: ({ column }) => (
      <SortButton
        label="Role"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.adminRole === "superadmin" ? "secondary" : "outline"}>
        {roleLabelMap[row.original.adminRole]}
      </Badge>
    ),
  },
    {
    accessorKey: "position",
    header: ({ column }) => (
      <SortButton
        label="Position"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
  },
    {
    accessorKey: "divisionName",
    header: ({ column }) => (
      <SortButton
        label="Division"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
  },
    {
    accessorKey: "activeStatus",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-2">
        <Badge variant={row.original.activeStatus ? "active" : "inactive"}>
          {row.original.activeStatus ? "Active" : "Inactive"}
        </Badge>
        {/* {row.original.isProtected ? (
          <Badge variant="secondary">🔒</Badge>
        ) : null} */}
      </div>
    ),
  },
  ];

  if (canManageAdmins) {
    columns.push({
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) =>
        row.original.canEditLogin ||
        row.original.canResetPassword ||
        row.original.canDemote ? (
          <AdminActionDialogs admin={row.original} />
        ) : (<Button className="disabled:pointer-events-none enabled:hover:bg-blue-600 cursor-not-allowed" disabled aria-disabled variant="outline"><Ellipsis /></Button>),
    });
  }

  return columns;
};
