"use client";

import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useEffect } from "react";
import StaffDetail from "./_components/staff-detail";
import { useModal } from "@/providers/modal-provider";
import { getAllStaffAndDivisions } from "./_action/create-new-staff";
import { useState } from "react";
import ModalCustom from "@/components/primitive/modal-custom";
import StaffList from "./_components/list-staff";
import { StaffTypes } from "@/types/staff";
import { Separator } from "@workspace/ui/components/separator";

const StaffManagementPage = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { setOpen, setClose } = useModal();
  const [staffList, setStaffList] = useState<StaffTypes[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffTypes | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getAllStaffAndDivisions();
      // map server data to `StaffTypes`: convert Dates to ISO strings and ensure division.description
      const mapped = (data?.staff ?? []).map((s: any) => ({
        ...s,
        createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : "",
        updatedAt: s.updatedAt ? new Date(s.updatedAt).toISOString() : "",
        joinedAt: s.joinedAt ? new Date(s.joinedAt).toISOString() : "",
        division: {
          id: s.division?.id ?? "",
          name: s.division?.name ?? "",
          description: s.division?.description ?? "",
          createdAt: s.division?.createdAt
            ? new Date(s.division.createdAt).toISOString()
            : "",
          updatedAt: s.division?.updatedAt
            ? new Date(s.division.updatedAt).toISOString()
            : "",
        },
      }));

      // set the full list and default to first staff entry if available
      setStaffList(mapped);
      setSelectedStaff(mapped[0] ?? null);
    };
    load();
  }, []);

  // useEffect(() => {
  //   if (!isPending && !session?.user) {
  //     router.push("/sign-in");
  //   }
  // }, [isPending, session, router]);

  // if (isPending)
  //   return <p className="text-center mt-8 text-white">Loading...</p>;
  // if (!session?.user)
  //   return <p className="text-center mt-8 text-white">Redirecting...</p>;

  // const { user } = session;

  return (
    <div className="p-4 relative">
      {/* <p>Welcome, {user.name || "User"}!</p> */}
      <div className="flex items-center justify-between mb-4 sticky top-0 right-0 left-0">
        <div>Staff Directory</div>
        <Button onClick={() => router.push("/staff-directory/new-staff")}>
          <Plus />
          Add New Staff
        </Button>
      </div>
      <Separator />
      <StaffList staffList={staffList} />

      {/* {selectedStaff && (
        <StaffDetail staff={selectedStaff} onClose={() => setOpen(true)} />
      )} */}
    </div>
  );
};
export default StaffManagementPage;
