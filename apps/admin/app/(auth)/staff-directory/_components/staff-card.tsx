"use client";
import { StaffTypes } from "@/types/staff";
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
import { useRouter } from "next/navigation";
import Link from "next/link";

interface StaffCardProps {
  staff: StaffTypes;
}

const StaffCard = ({ staff }: StaffCardProps) => {
  const router = useRouter()
  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2 w-full">
        <div>
          <p>Joined: {new Date(staff.joinedAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2 items-center">
          <Badge>{staff.activeStatus ? "Active" : "Inactive"}</Badge>
          <Badge variant={staff.isPublished ? "default" : "destructive"}>
            {staff.isPublished ? "Published" : "Unpublished"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-1">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold">{staff.name}</h3>
              <p>RGN-{staff.staffId}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-2 p-3 border rounded-lg">
            <StaffDetailList title="Email" name={staff.email} icon={<Mail className="w-4 h-4 text-emerald-600 text-gray-500" />} />
            <StaffDetailList title="Phone" name={staff.phoneNumber} icon={<Phone className="w-4 h-4 text-emerald-600 text-gray-500" />} />
        </div>
        <div className="grid grid-cols-2 mt-2 p-3 border rounded-lg">
            <StaffDetailList title="Position" name={staff.position} icon={<Briefcase className="w-4 h-4 text-emerald-600 text-gray-500" />} />
            <StaffDetailList title="Division" name={staff.division?.name || "N/A"} icon={<Briefcase className="w-4 h-4 text-emerald-600 text-gray-500" />} />
        </div>
      </CardContent>
      <CardFooter className="flex gap-1">
        <Button className="flex-1 flex items-center justify-center gap-2">Detail</Button>
        <Link href={`/x/${staff.id}`} target="_blank" className="flex items-center justify-center gap-2">
          <Button>
            <SquareArrowOutUpRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
export default StaffCard;
