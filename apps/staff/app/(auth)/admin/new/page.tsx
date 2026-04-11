import CreateAdminForm from "../_components/create-admin-form";
import { getAdminManagementScopeAction } from "@/action/admin.action";
import { redirect } from "next/navigation";

const CreateNewAdminPage = async () => {
  const { canManageAdmins } = await getAdminManagementScopeAction();

  if (!canManageAdmins) {
    redirect("/admin");
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Manage Admins</h1>
        <p className="text-sm text-muted-foreground">
          Super admins can select existing staff members and create admin login accounts for them.
        </p>
      </div>
      <CreateAdminForm />
    </div>
  );
};

export default CreateNewAdminPage;
