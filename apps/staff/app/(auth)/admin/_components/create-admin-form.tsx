"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { Spinner } from "@workspace/ui/components/spinner";
import {
  NativeSelect,
  NativeSelectOption,
} from "@workspace/ui/components/native-select";
import { useStaff } from "@/hooks/use-staff";
import { createAdminSchema } from "@/lib/schema/admin.schema";
import { createAdminFromStaffAction } from "@/action/admin.action";
import { useRouter } from "next/navigation";
import PasswordRequirement from "@/components/primitive/password-requirement";
import { z } from "zod";

type CreateAdminValues = z.infer<typeof createAdminSchema>;

const CreateAdminForm = () => {
  const { staffs, isLoading } = useStaff();
  const route = useRouter();
  const [isPending, startTransition] = useTransition();

  const eligibleStaffs = useMemo(
    () => staffs.filter((staff) => !staff.isArchived && !staff.userId),
    [staffs],
  );

  const form = useForm<CreateAdminValues>({
    mode: "onChange",
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      staffId: "",
      email: "",
      password: "",
      role: "admin",
    },
  });

  const selectedStaffId = form.watch("staffId");
  const selectedStaff = eligibleStaffs.find(
    (staff) => staff.id === selectedStaffId,
  );

  const onSubmit = async (values: CreateAdminValues) => {
    try {
      await createAdminFromStaffAction(values);
      startTransition(() => {
        toast.success(
          `Admin untuk ${selectedStaff?.name ?? "staff"} berhasil dibuat.`,
        );
        form.reset();
        route.push("/admin");
        route.refresh()
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Gagal membuat akun admin.",
      );
    }
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl border bg-background p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Create an Admin</FieldLegend>
            <FieldDescription>
              Select an existing staff member, then create an email and password
              for the admin account.
            </FieldDescription>
            <FieldDescription>
              Only staff members who do not have an admin account yet will
              appear in the list.
            </FieldDescription>
            <FieldDescription>
              Super Admin can decide whether the selected staff account should
              become an `Admin` or `Super Admin`.
            </FieldDescription>
          </FieldSet>
          <Controller
            control={form.control}
            name="staffId"
            render={({ field }) => (
              <Field>
                <FieldLabel>Staff</FieldLabel>
                <NativeSelect
                  className="w-full background"
                  disabled={isLoading || isPending}
                  value={field.value}
                  onChange={(event) => {
                    const nextStaffId = event.target.value;
                    const nextStaff = eligibleStaffs.find(
                      (staff) => staff.id === nextStaffId,
                    );

                    field.onChange(nextStaffId);

                    if (nextStaff) {
                      form.setValue("email", nextStaff.email, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }
                  }}
                >
                  <NativeSelectOption value="">
                    {isLoading ? "Loading staff..." : "Pilih staff"}
                  </NativeSelectOption>
                  {eligibleStaffs.map((staff) => (
                    <NativeSelectOption key={staff.id} value={staff.id}>
                      {staff.name} ({staff.staffId})
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <FieldError>
                  {form.formState.errors.staffId?.message}
                </FieldError>
              </Field>
            )}
          />
          {selectedStaff ? (
            <div className="grid gap-3 rounded-xl border border-dashed p-4 text-sm md:grid-cols-2">
              <AdminTitleTable
                title={"Staff ID"}
                value={selectedStaff.staffId}
              />
              <AdminTitleTable
                title={"Nama Staff"}
                value={selectedStaff.name}
              />
              <AdminTitleTable
                title={"Email staff saat ini"}
                value={selectedStaff.email}
              />
              <AdminTitleTable
                title={"Position"}
                value={selectedStaff.position}
              />
            </div>
          ) : null}
          <Controller
            control={form.control}
            name="role"
            render={({ field }) => (
              <Field>
                <FieldLabel>Role</FieldLabel>
                <NativeSelect
                  className="w-full background"
                  disabled={isPending}
                  value={field.value}
                  onChange={(event) => field.onChange(event.target.value)}
                >
                  <NativeSelectOption value="admin">Admin</NativeSelectOption>
                  <NativeSelectOption value="superadmin">
                    Super Admin
                  </NativeSelectOption>
                </NativeSelect>
                <FieldError>{form.formState.errors.role?.message}</FieldError>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={({ field }) => (
              <Field>
                <FieldLabel>Email Login</FieldLabel>
                <Input
                  type="email"
                  placeholder="Enter admin login email"
                  autoComplete="off"
                  readOnly
                  disabled={isPending}
                  {...field}
                />
                <FieldError>{form.formState.errors.email?.message}</FieldError>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field }) => (
              <Field>
                <FieldLabel>Password</FieldLabel>
                <PasswordRequirement 
                  label="Buat Password Baru"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  placeholder="Masukkan password yang kuat..."
                />
                <FieldError>
                  {form.formState.errors.password?.message}
                </FieldError>
              </Field>
            )}
          />
        </FieldGroup>
        <Button
          type="submit"
          className="bg-green-500"
          disabled={
            isPending || isLoading || !selectedStaff || !form.formState.isValid
          }
        >
          {isPending ? (
            <>
              <Spinner /> Creating...
            </>
          ) : (
            "Create Admin"
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateAdminForm;

const AdminTitleTable = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  return (
    <div>
      <p className="text-muted-foreground">{title}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
};
