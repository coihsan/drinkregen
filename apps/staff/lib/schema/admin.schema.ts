import z from "zod";

export const createAdminSchema = z
.object({
  staffId:    z.string().min(1, "Staff wajib dipilih"),
  email:      z.string().email(),
  password:   z.string().min(8, "Password minimal 8 karakter"),
})
