"use client";

import * as React from "react";
import { StaffTypes } from "@/types/staff.types";
import { Button } from "@workspace/ui/components/button";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  Shield,
  Globe,
  Timer,
} from "lucide-react";
import { formatPhoneNumber } from "@/lib/helpers";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Separator } from "@workspace/ui/components/separator";
import EditStaff from "./edit-staff";
import { isToday } from "date-fns";

interface StaffDetailProps {
  staff: StaffTypes | null;
}

const StaffDetail = ({ staff }: StaffDetailProps) => {
  if (!staff) return null;

  const [open, setOpen] = React.useState(false);
  const data = staff;
  const joined = data.joinedAt ? new Date(data.joinedAt) : null;
  const updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
  const createdByLabel =
    data.createdBy?.name ||
    data.createdBy?.email ||
    data.createdById ||
    "Unknown";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="flex-1" variant={"default"}>
          View Details
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detail profile</SheetTitle>
          <SheetDescription>
            Here you can see the details of the staff member. You can also edit
            the information if needed.
          </SheetDescription>
        </SheetHeader>
        <Separator orientation="horizontal" />
        <div className="p-4 space-y-4">
          <div>
            <h2 className="font-semibold text-lg">{data.name}</h2>
            <h3>
              {data.position} at {data.division?.name}
            </h3>
            <span className="font-semibold text-xs text-muted-foreground">
              RGN-{data.staffId}
            </span>
          </div>
          <StaffItem icon={<Mail className="w-5 h-5" />} title={data.email} />
          <StaffItem icon={<Phone className="w-5 h-5" />} title={data.phoneNumber} />
          <StaffItem icon={<Briefcase className="w-5 h-5" />} title={data.position} />
          <StaffItem icon={<Globe className="w-5 h-5" />} title={data.coverArea} />
          <StaffItem icon={<Building2 className="w-5 h-5" />} title={data.division.name} />
          <StaffItem icon={<Calendar className="w-5 h-5" />} title={data.joinedAt.toLocaleString()} />
          <div>
            <p>Created by: <span className="text-green-500">{createdByLabel}</span></p>
          </div>
          <div>
            <p>
              Last updated :{" "}
              <span className="text-gray-50 font-semibold">{updatedAt ? updatedAt.toLocaleString("id-ID") : "N/A"}</span>
            </p>
            <p>Updated by: {data.updatedById}</p>
          </div>
        </div>
        <SheetFooter>
          <EditStaff staff={data} />
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default StaffDetail;

interface StaffItemProps {
  icon?: React.ReactNode;
  title: string | null;
}

const StaffItem = ({ icon, title }: StaffItemProps) => {
  return (
    <div className="flex items-center gap-3">
      <div>{icon}</div>
      <div className="font-semibold">{title}</div>
    </div>
  );
};
