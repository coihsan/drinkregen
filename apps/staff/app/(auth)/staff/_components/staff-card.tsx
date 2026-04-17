"use client";
import { StaffTypes } from "@/types/staff.types";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
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
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import StaffOptions from "./staff-options";
import StaffDetail from "./staff-detail";

interface StaffCardProps {
  staff: StaffTypes;
}

const StaffCard = ({ staff }: StaffCardProps) => {
  const data = staff;

  return (
    <Card
      size="default"
      className={`bg-background shadow-md ${staff.activeStatus === true && "grayscale"}}`}
    >
      <CardHeader className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs">
            Joined: {new Date(staff.joinedAt).toLocaleDateString("id-ID")}
          </p>
        </div>
        <div className="flex items-center gap-2 items-center">
          {/* {getRoleBadge(user?.role || "Unknown")} */}
          <StaffOptions variant={'ghost'} staffId={data.id} />
        </div>
      </CardHeader>
      <CardContent className="w-full">
        <div className="flex flex-col items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage
              className={`${staff.activeStatus === false && "grayscale"}`}
              src={data.avatarUrl || "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center">
            <h1 className="text-xl text-center font-bold">{data.name}</h1>
            <h3 className="text-md text-center font-semibold text-secondary">
              {data.position} at {data.division?.name || "N/A"}
            </h3>
            <Badge
              className="text-[11px] text-muted-foreground mt-2"
              variant={"outline"}
            >
              RGN-{data.staffId}
            </Badge>
          </div>
          <div className="flex gap-1 items-center">
            <Badge variant={data.activeStatus ? "active" : "inactive"}>
              {data.activeStatus ? "Active" : "Inactive"}
            </Badge>
            <Badge variant={data.isPublished ? "active" : "inactive"}>
              {data.isPublished ? "Public" : "Private"}
            </Badge>
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
            <SquareArrowOutUpRight className="w-5 h-5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
export default StaffCard;
