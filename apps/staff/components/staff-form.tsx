"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@workspace/ui/components/button";
import { useQueryClient } from "@tanstack/react-query";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { newStaffSchema, updateStaffSchema } from "@/lib/schema/staff.schema";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import Warning from "@/components/warning";
import { useRef, useTransition, useEffect, useState, useCallback } from "react";
import DatePicker from "./date-picker";
import { createNewStaff } from "@/action/staff.action";
import { useSession } from "@/lib/auth-client";
import { useStaff } from "@/hooks/use-staff";
import { Spinner } from "@workspace/ui/components/spinner";
import { StaffTypes } from "@/types/staff.types";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@workspace/ui/components/input-group";
import {
  NativeSelect,
  NativeSelectOption,
} from "@workspace/ui/components/native-select";

import { useDropzone } from "@uploadthing/react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { useUploadThing } from "@lib/uploadthing";

type CreateFormValues = z.infer<typeof newStaffSchema>;
type UpdateFormValues = z.infer<typeof updateStaffSchema>;
type FormValues = CreateFormValues;

interface StaffFormProps {
  initialData?: StaffTypes | null;
  onSuccess?: () => void;
}

const StaffForm = ({ initialData, onSuccess }: StaffFormProps) => {
  const reff = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();
  const user = session;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const { divisions, updateDataStaffAsync, isUpdatingStaff } = useStaff();
  const [username, setUsername] = useState("");
  const isEditMode = Boolean(initialData);
  const formSchema = isEditMode ? updateStaffSchema : newStaffSchema;

  const defaultDivision = initialData?.division
    ? {
        id: initialData.division.id,
        name: initialData.division.name,
        description: initialData.division.description ?? "",
        createdAt: new Date(initialData.division.createdAt),
        updatedAt: new Date(initialData.division.updatedAt),
      }
    : {
        id: uuidv4(),
        name: "",
        description: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData?.id ?? uuidv4(),
      staffId: initialData?.staffId ?? "",
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      phoneNumber: initialData?.phoneNumber ?? "",
      position: initialData?.position ?? "",
      division: defaultDivision,
      activeStatus: initialData?.activeStatus ?? true,
      isPublished: initialData?.isPublished ?? true,
      createdAt: initialData?.createdAt
        ? new Date(initialData.createdAt)
        : new Date(),
      updatedAt: initialData?.updatedAt
        ? new Date(initialData.updatedAt)
        : new Date(),
      joinedAt: initialData?.joinedAt
        ? new Date(initialData.joinedAt)
        : new Date(),
      avatarUrl: initialData?.avatarUrl ?? "",
      coverArea: initialData?.coverArea ?? "",
      isArchived: initialData?.isArchived ?? false,
      createdById: initialData?.createdById ?? user?.user.id,
    },
  });

  useEffect(() => {
    if (user?.user.id) {
      form.setValue("createdById", user.user.id);
    }
  }, [user?.user.id, form]);

  useEffect(() => {
    if (!initialData) return;

    form.reset({
      id: initialData.id,
      staffId: initialData.staffId,
      name: initialData.name,
      email: initialData.email,
      phoneNumber: initialData.phoneNumber,
      position: initialData.position,
      division: initialData.division
        ? {
            id: initialData.division.id,
            name: initialData.division.name,
            description: initialData.division.description ?? "",
            createdAt: new Date(initialData.division.createdAt),
            updatedAt: new Date(initialData.division.updatedAt),
          }
        : undefined,
      activeStatus: initialData.activeStatus,
      isPublished: initialData.isPublished,
      createdAt: new Date(initialData.createdAt),
      updatedAt: new Date(initialData.updatedAt),
      joinedAt: new Date(initialData.joinedAt),
      avatarUrl: initialData.avatarUrl ?? "",
      coverArea: initialData.coverArea ?? "",
      isArchived: initialData.isArchived ?? false,
      createdById: initialData.createdById ?? user?.user.id,
    });
  }, [form, initialData, user?.user.id]);

  const onSubmit = async (values: FormValues | UpdateFormValues) => {
    try {
      const payload = {
        id: values.id,
        staffId: values.staffId,
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        activeStatus: values.activeStatus,
        isPublished: values.isPublished,
        createdAt: values.createdAt,
        updatedAt: new Date(),
        joinedAt: values.joinedAt,
        position: values.position,
        avatarUrl: values.avatarUrl,
        coverArea: values.coverArea,
        createdById: values.createdById,
        division: values.division?.name
          ? {
              id: values.division.id,
              name: values.division.name,
              description: values.division.description,
              createdAt: values.division.createdAt,
              updatedAt: new Date(),
            }
          : undefined,
        isArchived: values.isArchived || false,
      };

      if (isEditMode && initialData?.id) {
        await updateDataStaffAsync({
          id: initialData.id,
          data: payload,
        });

        startTransition(() => {
          toast.success("Staff updated successfully!");
          onSuccess?.();
        });

        return;
      }

      const createValues = values as CreateFormValues;

      await createNewStaff({
        ...payload,
        id: createValues.id,
        staffId: createValues.staffId,
        name: createValues.name,
        email: createValues.email + "@drinkregen.com",
        phoneNumber: createValues.phoneNumber,
        position: createValues.position,
        activeStatus: createValues.activeStatus,
        isPublished: createValues.isPublished,
        createdAt: createValues.createdAt,
        updatedAt: payload.updatedAt,
        joinedAt: createValues.joinedAt,
        isArchived: createValues.isArchived,
      });

      await queryClient.invalidateQueries({ queryKey: ["staff", "list"] });
      await queryClient.invalidateQueries({ queryKey: ["staff", "archived"] });
      await queryClient.invalidateQueries({ queryKey: ["activity-logs"] });

      startTransition(() => {
        router.push("/staff");
        router.refresh();
        console.log("New staff created");
        toast.success("New staff created successfully!");
        onSuccess?.();
      });
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : isEditMode
            ? "Failed to update staff."
            : "Failed to create new staff.";
      toast.error(message);
    }
  };

  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);
  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      alert("uploaded successfully!");
    },
    onUploadError: () => {
      alert("error occurred while uploading");
    },
    onUploadBegin: (fileName) => {
      console.log("upload has begun for", fileName);
    },
  });
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
  });

  return (
    <div className="mb-12">
      <form ref={reff} onSubmit={form.handleSubmit(onSubmit)} className="">
        <FieldGroup>
          <Controller
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <Field>
                <FieldLabel>Photo</FieldLabel>
                <div {...getRootProps()} className="border">
                  <div>
                    {files.length > 0 && (
                      <Button onClick={() => startUpload(files)}>
                        Upload {files.length} files
                      </Button>
                    )}
                  </div>
                  <Input {...field} {...getInputProps()} />
                  Drop files here!
                </div>
                <FieldError>
                  {form.formState.errors.avatarUrl?.message}
                </FieldError>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="staffId"
            render={({ field }) => (
              <Field>
                <FieldLabel>Staff ID</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    maxLength={5}
                    type="text"
                    placeholder="Enter staff ID"
                    autoComplete="off"
                    autoFocus
                    {...field}
                    id="input-group-url"
                  />
                  <InputGroupAddon>
                    <InputGroupText>RGN-</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
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
                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={({ field }) => (
              <Field>
                <FieldLabel>Email</FieldLabel>
                {isEditMode ? (
                  <Input
                    type="email"
                    {...field}
                    autoComplete="off"
                  />
                ) : (
                  <InputGroup>
                    <InputGroupAddon align={"inline-end"}>
                      <InputGroupText>@drinkregen.com</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      maxLength={5}
                      type="text"
                      placeholder="Enter name"
                      autoComplete="off"
                      autoFocus
                      {...field}
                      id="input-group-url"
                    />
                  </InputGroup>
                )}
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
            name="division"
            render={({ field }) => (
              <Field>
                <FieldLabel>Division</FieldLabel>
                <NativeSelect
                  className="w-full bg-background"
                  value={field.value?.id ?? ""}
                  onChange={(event) => {
                    const selectedDivision = divisions.find(
                      (division) => division.id === event.target.value,
                    );

                    field.onChange(
                      selectedDivision
                        ? {
                            id: selectedDivision.id,
                            name: selectedDivision.name,
                            description: "",
                            createdAt: new Date(selectedDivision.createdAt),
                            updatedAt: new Date(selectedDivision.updatedAt),
                          }
                        : undefined,
                    );
                  }}
                >
                  <NativeSelectOption value="">
                    Select division
                  </NativeSelectOption>
                  {divisions.map((division) => (
                    <NativeSelectOption key={division.id} value={division.id}>
                      {division.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <FieldError>
                  {form.formState.errors.division?.message as string}
                </FieldError>
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
          <Controller
            control={form.control}
            name="joinedAt"
            render={({ field }) => (
              <Field>
                <FieldLabel>
                  <span>Joined Date</span>
                  <Warning
                    message="You can enter the joined date of the staff."
                    icon={<Info className="size-4" />}
                  />
                </FieldLabel>
                <DatePicker date={field.value} setDate={field.onChange} />
                <FieldError>
                  {form.formState.errors.joinedAt?.message}
                </FieldError>
              </Field>
            )}
          />
        </FieldGroup>
        <Field className="mt-4" orientation={"responsive"}>
          <Button
            disabled={isPending || isUpdatingStaff}
            className="bg-green-500"
            type="submit"
          >
            {isPending || isUpdatingStaff ? (
              <>
                <Spinner /> {isEditMode ? "Saving..." : "Creating..."}
              </>
            ) : isEditMode ? (
              "Save changes"
            ) : (
              "Create"
            )}
          </Button>
          {/* <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button> */}
        </Field>
      </form>
    </div>
  );
};
export default StaffForm;
