import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z.string().trim().min(2, "Subject name must be at least 2 characters"),

  code: z
    .string()
    .trim()
    .min(2, "Subject code must be at least 2 characters")
    .toUpperCase(),

  description: z.string().trim().optional(),

  departmentId: z.string().uuid("Invalid department id"),

  status: z.enum(["active", "inactive"]).optional(),
});

export const updateSubjectSchema = createSubjectSchema.partial();

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;