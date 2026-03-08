"use client";

import { Button } from "@workspace/ui/components/button";

import { useRouter } from "next/navigation";
import { ArrowBigLeft } from "lucide-react";
import StaffForm from "@/components/staff-form";

const NewStaffPage = () => {
  const router = useRouter();

  return (
    <div>
      <Button onClick={() => router.push("/staff-directory")}>
        <ArrowBigLeft />
        Back to Staff Management
      </Button>
      <h1 className="text-xl text-green-500 font-bold">Create New Staff</h1>
      <p>General Information</p>
      <StaffForm />
    </div>
  );
};
export default NewStaffPage;
