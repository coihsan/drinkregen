import CreateAdminForm from "../_components/create-admin-form";

const CreateNewAdminPage = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Manage Admins</h1>
        <p className="text-sm text-muted-foreground">
          Super admin dapat memilih staff yang sudah ada dan membuatkan akun admin untuk login.
        </p>
      </div>
      <CreateAdminForm />
    </div>
  );
};

export default CreateNewAdminPage;
