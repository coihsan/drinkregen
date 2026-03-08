import { ROLE } from "../../types/enums";
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
  staffId: z.string().min(5, "Staff ID is required"),
  name: z.string().min(2, "Full name must be at least 2 characters"),
  emailVerified: z.boolean().default(true),
  email: z.string().min(5, "Email is required").email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  role: z.literal(ROLE.STAFF).or(z.literal(ROLE.ADMIN)).optional(),
  position: z.string().min(2, "Position must be at least 2 characters"),
  division: staffDivisionSchema.optional(),
  activeStatus: z.boolean(),
  isPublished: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  joinedAt: z.date(),
  image: z.string(),
  coverArea: z.string().min(2, "Cover area must be at least 2 characters"),
});