"use client";

import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import AdminList from "./_components/admin-list";

const AdminPage = () => {
  const route = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Manage Admins</h1>
          <p className="text-sm text-muted-foreground">
            Lihat seluruh staff yang sudah menjadi admin dan buat admin baru dari data staff yang ada.
          </p>
        </div>
        <Button onClick={() => route.push("/admin/new")}>Add Admin</Button>
      </div>
      <AdminList />
    </div>
  );
};

export default AdminPage;
