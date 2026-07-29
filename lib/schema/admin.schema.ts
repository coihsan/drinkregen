import z from "zod";

export const createAdminSchema = z
.object({
  staffId:    z.string().min(1, "Staff wajib dipilih"),
  email:      z.string().email(),
  password:   z.string().min(12, "Password minimal 12 karakter"),
  role:       z.enum(["admin", "superadmin"], {
    error: "Role admin wajib dipilih",
  }),
})
