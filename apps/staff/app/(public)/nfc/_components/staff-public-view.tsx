"use client";

import { CheckCheck, Mail, User } from "lucide-react";
import { useStaff } from "@/hooks/use-staff";

interface StaffPublicViewProps {
  staffId: string;
}

const StaffPublicView = ({ staffId }: StaffPublicViewProps) => {
  const { staffs } = useStaff();

  const data = staffs.find((staff) => staff.id === staffId);

  if (!data) return <div>Staff not found</div>;
  if (!data.isPublished) return <div>Staff not published</div>;

  const activeStatus = data.activeStatus ? "Active" : "Inactive";

  return (
    <div>
      <h2>Staff Directory</h2>
      <div className="flex items-center">
        <CheckCheck className="inline-block mr-1 size-5" />
        <span>{activeStatus}</span>
      </div>
      <h3>{data.name}</h3>
      <p>Staff ID: {data.staffId}</p>
      <div>
        <User className="inline-block mr-1 size-5" />
        <p>{data.position || "Not provided"}</p>
      </div>
      <p>{data.division?.name || "No Division"}</p>
      <div className="flex items-center">
        <Mail className="inline-block mr-1 size-5" />
        <p>Email: {data.email}</p>
      </div>
      <p>Phone: {data.phoneNumber || "Not provided"}</p>
      <p>{data.coverArea || "No cover area specified"}</p>
    </div>
  );
};

export default StaffPublicView;
