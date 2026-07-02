import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(2, "Department name must be at least 2 characters"),

  code: z.string().trim().min(2, "Department code must be at least 2 characters").toUpperCase(),

  description: z.string().trim().optional(),

  status: z.enum(["active", "inactive"]).optional(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;