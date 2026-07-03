import { z } from "zod";

export const createClassSchema = z.object({
  title: z.string().trim().min(2, "Class title must be at least 2 characters"),

  description: z.string().trim().optional(),

  subjectId: z.string().uuid("Invalid subject id"),

  teacherId: z.string().uuid("Invalid teacher id"),

  capacity: z
    .number()
    .int("Capacity must be an integer")
    .positive("Capacity must be greater than 0"),

  bannerImageUrl: z.string().url("Invalid banner image URL").optional(),

  status: z.enum(["active", "inactive"]).optional(),
});

export const updateClassSchema = createClassSchema.partial();

export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;