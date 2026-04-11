"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Eye, EyeIcon, SquareArrowOutUpRight } from "lucide-react";
import { ColumnDef } from "./data-table";
import StaffOptions from "@/app/(auth)/staff/_components/staff-options";
import Link from "next/link";
import { StaffTypes } from "@/types/staff.types";

const getInitials = (name: string) =>
  name
    .match(/(\b\S)?/g)
    ?.join("")
    .toUpperCase()
    .slice(0, 2) || "?";

export const staffColumns: ColumnDef<StaffTypes>[] = [
    { header: "ID", cell: (row) => (
        <span className="text-xs text-muted-foreground">RGN-{row.staffId}</span>
    ) },
  {
    header: "Name",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={row.avatarUrl || "https://github.com/shadcn.png"} alt={row.name} />
          <AvatarFallback>{getInitials(row.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{row.name}</span>
        </div>
      </div>
    ),
  },
  { header: "Email", cell: (row) => row.email },
  { header: "Position", cell: (row) => row.position },
  { header: "Division", cell: (row) => row.division.name },
  {
    header: "Status",
    cell: (row) => (
      <Badge variant={row.activeStatus ? "active" : "inactive"}>
        {row.activeStatus ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    header: "NFC",
    cell: (row) => (
      <Badge variant={row.isPublished ? "active" : "destructive"}>
        {row.isPublished ? "Public" : "Private"}
      </Badge>
    ),
  },
  {
    header: "Link",
    cell: (row) => (
      <Link target="_blank" href={`/nfc/${row.id}`}><SquareArrowOutUpRight className="h-4 w-4 text-muted-foreground hover:text-green-600 transition" /></Link>
    ),
  },
  {
    header: "Actions",
    cell: (row) => (
      <StaffOptions variant={'outline'} staffId={row.id} />
    ),
  },
];

export type AdminData = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  banned: boolean | null;
};

export const adminColumns: ColumnDef<AdminData>[] = [
  {
    header: "Admin Info",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={row.image || "https://github.com/shadcn.png"} alt={row.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(row.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{row.name}</span>
          <span className="text-xs text-muted-foreground">{row.email}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Role",
    cell: (row) => <span className="capitalize">{row.role}</span>,
  },
  {
    header: "Access",
    cell: (row) => (
      <Badge variant={row.banned ? "destructive" : "outline"}>
        {row.banned ? "Banned" : "Granted"}
      </Badge>
    ),
  },
  {
    header: "Actions",
    cell: (row) => (
      <Button
        variant="outline"
        size="sm"
        onClick={() => console.log("Manage", row.id)}
      >
        Manage Access
      </Button>
    ),
  },
];

export type LogData = {
  id: string;
  actorEmail: string;
  action: string;
  targetEmail: string | null;
  createdAt: Date;
};

export const logColumns: ColumnDef<LogData>[] = [
  {
    header: "Date & Time",
    cell: (row) => (
      <span className="text-sm whitespace-nowrap">
        {new Intl.DateTimeFormat("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(row.createdAt))}
      </span>
    ),
  },
  {
    header: "Actor",
    cell: (row) => <span className="font-medium">{row.actorEmail}</span>,
  },
  {
    header: "Action",
    cell: (row) => <Badge variant="secondary">{row.action}</Badge>,
  },
  { header: "Target", cell: (row) => row.targetEmail || "-" },
  {
    header: "Actions",
    cell: (row) => (
      <Button variant="ghost" size="sm" title="View Details">
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },
];
