import z from "zod";

export const createAdminSchema = z
.object({
  name:       z.string().min(1),
  email:      z.string().email(),
  password:   z.string().min(8, "Password minimal 8 karakter"),
  permissions: z.array(z.enum(["MANAGE_STAFF", "MANAGE_LUCKY_DRAW"])).default([]),
})