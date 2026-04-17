import { Button } from "@workspace/ui/components/button";
import AdminList from "./_components/admin-list";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAdminManagementScopeAction } from "@/action/admin.action";

const AdminPage = async () => {
  const { canCreateAdmins } = await getAdminManagementScopeAction();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Manage Admins</h1>
          <p className="text-sm text-muted-foreground">
            View all staff members who are already admins and create new admins from existing staff data.
          </p>
        </div>
        {canCreateAdmins ? (
          <Button asChild>
            <Link href="/admin/new">
              <Plus />
              Admin
            </Link>
          </Button>
        ) : null}
      </div>
      <AdminList />
    </div>
  );
};

export default AdminPage;
