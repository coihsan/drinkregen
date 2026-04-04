import * as z from "zod";

export const staffDivisionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const newStaffSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Full name must be at least 2 characters"),
  staffId: z.string().min(5, "Staff ID is required"),
  email: z.string().min(5, "Email is required").email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  avatarUrl: z.string().optional(),
  isArchived: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  activeStatus: z.boolean(),
  coverArea: z.string().optional(),
  isPublished: z.boolean(),
  joinedAt: z.date(),
  division: staffDivisionSchema.optional(),
  divisionId: z.string().optional(),
  createdById: z.string().optional(),
  updatedById: z.string().optional(),
});

export const updateStaffSchema = newStaffSchema.partial().extend({
  id: z.string().min(1),
})

export const createDivisionSchema = z.object({
  name: z.string().min(1, "Nama divisi wajib diisi"),
})
