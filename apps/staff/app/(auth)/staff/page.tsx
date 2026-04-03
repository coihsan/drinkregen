"use client";

import { Button } from "@workspace/ui/components/button";
import { Archive, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ViewTransition } from "react";
import { Separator } from "@workspace/ui/components/separator";
import { Loading } from "@workspace/ui/components/loading";
import { useStaff } from "@/hooks/use-staff";
import StaffCard from "./_components/staff-card";
import { useSession } from "@/lib/auth-client";

const StaffManagementPage = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { staffs, isLoading, createStaff, isCreating } = useStaff();

  const user = session

  if (isLoading) return;
  <div className="w-full h-screen flex items-center justify-center">
    <Loading className="h-32 w-32" />
  </div>;
  if (!staffs?.find((s) => !s.isArchived)) {
    return <p className="text-center mt-8 text-white">Redirecting...</p>;
  }

  return (
    <ViewTransition default={"none"} enter="slide-up" exit="slide-down">
      <div className="p-4 relative">
        <p>Welcome, {user?.user.name || "User"}!</p>
        <div className="flex items-center justify-between mb-4 sticky top-0 right-0 left-0">
          <div>Staff Directory</div>
          <div className="flex items-center gap-2">
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
            </Button>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-3 gap-4">
          {staffs.map((staff, index) => (
            <StaffCard key={index} staff={staff} />
          ))}
        </div>
      </div>
    </ViewTransition>
  );
};
export default StaffManagementPage;
