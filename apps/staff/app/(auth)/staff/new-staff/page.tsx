"use client";

import StaffForm from "@/components/staff-form";

const NewStaffPage = () => {

  return (
    <main className="p-4">
      <h1 className="text-xl text-green-500 font-bold">Create New Staff</h1>
      <p>General Information</p>
      <StaffForm />
    </main>
  );
};
export default NewStaffPage;
