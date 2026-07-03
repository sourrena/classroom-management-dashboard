import { z } from "zod";

export const createEnrollmentSchema = z.object({
  classId: z.string().uuid("Invalid class id"),
});

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;