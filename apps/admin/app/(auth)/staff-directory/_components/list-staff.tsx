import { StaffTypes } from "@/types/staff";
import StaffCard from "./staff-card";

interface StaffListProps {
  staffList?: StaffTypes[];
}

export default function StaffList({ staffList = [] }: StaffListProps) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
      {staffList.map((staff) => (
          <StaffCard staff={staff} key={staff.id} />
        ))}
        </div>
    </div>
  );
}
