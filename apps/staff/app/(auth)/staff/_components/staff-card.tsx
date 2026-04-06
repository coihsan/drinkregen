"use client";
import { StaffTypes } from "@/types/staff.types";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import StaffDetailList from "./staff-detail-list";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Briefcase, Mail, Phone, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { Separator } from "@workspace/ui/components/separator";
import StaffOptions from "./staff-options";
import StaffDetail from "./staff-detail";

interface StaffCardProps {
  staff: StaffTypes;
  className?: string;
}

const StaffCard = ({ staff, className }: StaffCardProps) => {

  const data = staff;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge variant="destructive">
            <span className="uppercase">ADMIN</span>
          </Badge>
        );
      case "STAFF":
        return (
          <Badge variant="default">
            <span className="uppercase">STAFF</span>
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <Card size="default" className={`bg-muted-foreground/3 ${className || ""}`}>
      <CardHeader className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs">
            Joined:{" "}
            {new Date(staff.joinedAt).toLocaleDateString("id-ID")}
          </p>
        </div>
        <div className="flex items-center gap-2 items-center">
          {/* {getRoleBadge(user?.role || "Unknown")} */}
          <Badge variant={data.activeStatus ? "active" : "inactive"}>
            {data.activeStatus ? "Active" : "Inactive"}
          </Badge>
          <Badge variant={data.isPublished ? "active" : "inactive"}>
            {data.isPublished ? "Published" : "Unpublished"}
          </Badge>
          <StaffOptions staffId={data.id} />
        </div>
      </CardHeader>
      <CardContent className="w-full">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={data.avatarUrl || "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-2 flex-1">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold">{data.name}</h3>
              <p className="text-xs font-semibold">RGN-{data.staffId}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 mb-4">
            <StaffDetailList
              title="Email"
              name={data.email}
              icon={<Mail className="w-4 h-4 text-emerald-600 text-gray-500" />}
            />
            <StaffDetailList
              title="Phone"
              name={data.phoneNumber}
              icon={
                <Phone className="w-4 h-4 text-emerald-600 text-gray-500" />
              }
            />
          </div>
          <Separator orientation="horizontal" className="border-green-900" />
          <div className="flex flex-col gap-2">
            <StaffDetailList
              title="Position"
              name={data.position}
              icon={
                <Briefcase className="w-4 h-4 text-emerald-600 text-gray-500" />
              }
            />
            <StaffDetailList
              title="Division"
              name={data.division?.name || "N/A"}
              icon={
                <Briefcase className="w-4 h-4 text-emerald-600 text-gray-500" />
              }
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-2">
        <StaffDetail staff={data} />
        <Link
        aria-disabled={data.isArchived === true}
          href={data.isArchived ? "#" : `/nfc/${data.id}`}
          target="_blank"
          className="flex items-center justify-center gap-2"
        >
          <Button disabled={data.isArchived === true} variant={"outline"}>
            <SquareArrowOutUpRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
export default StaffCard;
