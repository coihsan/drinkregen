"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loading } from "@workspace/ui/components/loading";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@workspace/ui/components/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { newStaffSchema } from "@/lib/schema/staff";
import { ROLE } from "@/types/enums";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import Warning from "@/components/warning";
import { useRef, useTransition } from "react";
import { createNewStaff } from "@/app/(auth)/staff-directory/_action/create-new-staff";

type FormValues = z.infer<typeof newStaffSchema>;

const StaffForm = () => {
  const reff = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(newStaffSchema),
    defaultValues: {
      id: uuidv4(),
      staffId: "",
      name: "",
      email: "",
      phoneNumber: "",
      emailVerified: true,
      role: ROLE.STAFF,
      position: "",
      division: {
        id: uuidv4(),
        name: "",
        description: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      activeStatus: true,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      joinedAt: new Date(),
      image: "",
      coverArea: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
        await createNewStaff({
        id: values.id,
        staffId: values.staffId,
        name: values.name,
        email: values.email,
        emailVerified: values.emailVerified,
        phoneNumber: values.phoneNumber,
        role: values.role || ROLE.STAFF,
        activeStatus: values.activeStatus,
        isPublished: values.isPublished,
        createdAt: values.createdAt,
        updatedAt: values.updatedAt,
        joinedAt: values.joinedAt,
        position: values.position,
        image: values.image,
        coverArea: values.coverArea,
        division: values.division?.name
          ? {
              id: values.division.id,
              name: values.division.name,
              description: values.division.description,
              createdAt: values.division.createdAt,
              updatedAt: values.division.updatedAt,
            }
          : undefined,
      });
      startTransition(() => {
          router.push("/staff-directory");
          console.log("New staff created");
          toast.success("New staff created successfully!");
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create new staff.");
    }
  };

  return (
    <div>
      <form ref={reff} onSubmit={form.handleSubmit(onSubmit)} className="w-dvh">
        <FieldGroup>
          <Controller
            control={form.control}
            name="staffId"
            render={({ field }) => (
              <Field>
                <FieldLabel>Staff ID</FieldLabel>
                <Input
                  className="border"
                  type="text"
                  maxLength={5}
                  placeholder="Enter staff ID"
                  autoComplete="off"
                  {...field}
                />
                <FieldError>
                  {form.formState.errors.staffId?.message}
                </FieldError>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="name"
            render={({ field }) => (
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input
                  placeholder="Enter full name"
                  {...field}
                  autoComplete="off"
                />
                <FieldError>
                  {form.formState.errors.name?.message}
                </FieldError>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={({ field }) => (
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="Enter email"
                  {...field}
                  autoComplete="off"
                />
                <FieldError>{form.formState.errors.email?.message}</FieldError>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <Field>
                <FieldLabel>Phone Number</FieldLabel>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  {...field}
                  autoComplete="off"
                />
                <FieldError>
                  {form.formState.errors.phoneNumber?.message}
                </FieldError>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="position"
            render={({ field }) => (
              <Field>
                <FieldLabel>Position</FieldLabel>
                <Input
                  type="text"
                  placeholder="Enter position"
                  {...field}
                  autoComplete="off"
                />
                <FieldError>
                  {form.formState.errors.position?.message}
                </FieldError>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="image"
            render={({ field }) => (
              <Field>
                <FieldLabel>Image</FieldLabel>
                <Input
                  type="text"
                  placeholder="Enter image URL"
                  {...field}
                  autoComplete="off"
                />
                <FieldError>{form.formState.errors.image?.message}</FieldError>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="division.name"
            render={({ field }) => (
              <Field>
                <FieldLabel>Division</FieldLabel>
                <Input
                  type="text"
                  placeholder="Enter division name"
                  {...field}
                  autoComplete="off"
                />
                <FieldError>{form.formState.errors.image?.message}</FieldError>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="coverArea"
            render={({ field }) => (
              <Field>
                <FieldLabel>
                  <span>Cover Area</span>
                  <Warning
                    message="You can enter the cover area of the staff, e.g., the location or department they are responsible for."
                    icon={<Info className="size-4" />}
                  />
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="Enter cover area"
                  {...field}
                  autoComplete="off"
                />
                <FieldError>
                  {form.formState.errors.coverArea?.message}
                </FieldError>
              </Field>
            )}
          />
        </FieldGroup>
        <Field orientation={"responsive"}>
          <Button disabled={isPending} className="bg-green-500" type="submit">
            {isPending ? (
              <>
                <Loading /> Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              console.log("Form reset");
              form.reset();
            }}
          >
            Reset
          </Button>
        </Field>
      </form>
    </div>
  );
};
export default StaffForm;
