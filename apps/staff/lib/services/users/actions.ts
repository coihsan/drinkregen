// src/app/admin/users/actions.ts
"use server";

import { createUser } from "./user.service";
import { getAuthenticatedUser } from "./user.service";

export async function createAdminAction(formData: FormData) {
  const { user } = await getAuthenticatedUser(); // pastikan OWNER/ADMIN

  await createUser(
    {
      name:        formData.get("name") as string,
      email:       formData.get("email") as string,
      phoneNumber: formData.get("phone") as string,
      staffId:     formData.get("staffId") as string,
      position:    formData.get("position") as string,
      divisionId:  formData.get("divisionId") as string,
      role: "ADMIN", // wajib password
      password:    formData.get("password") as string, // wajib untuk ADMIN
    },
    user.id // createdBy
  );
}

export async function createStaffAction(formData: FormData) {
  const { user } = await getAuthenticatedUser();

  await createUser(
    {
      name:        formData.get("name") as string,
      email:       formData.get("email") as string,
      phoneNumber: formData.get("phone") as string,
      staffId:     formData.get("staffId") as string,
      position:    formData.get("position") as string,
      divisionId:  formData.get("divisionId") as string,
      role:        "STAFF", // tidak perlu password
    },
    user.id
  );
}