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

type CreateAdminValues = {
  staffId: string;
  email: string;
  password: string;
};

const CreateAdminForm = () => {
  const { staffs, isLoading } = useStaff();
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
    },
  });

  const selectedStaffId = form.watch("staffId");
  const selectedStaff = eligibleStaffs.find((staff) => staff.id === selectedStaffId);

  const onSubmit = async (values: CreateAdminValues) => {
    try {
      await createAdminFromStaffAction(values);
      startTransition(() => {
        toast.success(`Admin untuk ${selectedStaff?.name ?? "staff"} berhasil dibuat.`);
        form.reset();
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
              Pilih staff yang sudah ada, lalu buatkan email dan password untuk akun admin.
            </FieldDescription>
            <FieldDescription>
              Hanya staff yang belum memiliki akun admin yang akan tampil di daftar.
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
                  const nextStaff = eligibleStaffs.find((staff) => staff.id === nextStaffId);

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
              <FieldError>{form.formState.errors.staffId?.message}</FieldError>
            </Field>
          )}
          />
          {selectedStaff ? (
            <div className="grid gap-3 rounded-xl border border-dashed p-4 text-sm md:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Nama staff</p>
                <p className="font-medium">{selectedStaff.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email staff saat ini</p>
                <p className="font-medium">{selectedStaff.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Staff ID</p>
                <p className="font-medium">RGN-{selectedStaff.staffId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Position</p>
                <p className="font-medium">{selectedStaff.position}</p>
              </div>
            </div>
          ) : null}
          <Controller
            control={form.control}
            name="email"
            render={({ field }) => (
              <Field>
                <FieldLabel>Email Login</FieldLabel>
                <Input
                  type="email"
                  placeholder="Masukkan email untuk login admin"
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
                <Input
                  type="password"
                  placeholder="Minimal 8 karakter"
                  autoComplete="new-password"
                  disabled={isPending}
                  {...field}
                />
                <FieldError>{form.formState.errors.password?.message}</FieldError>
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
