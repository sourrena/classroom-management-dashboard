import { count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "../db/index.js";
import { departments } from "../db/schema.js";
import { AppError } from "../utils/AppError.js";
import type {
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "../validators/department.validator.js";

type GetDepartmentsOptions = {
  search?: string;
  page?: number;
  limit?: number;
};

export const getDepartments = async ({
  search = "",
  page = 1,
  limit = 10,
}: GetDepartmentsOptions) => {
  const offset = (page - 1) * limit;

  const whereCondition = search
    ? or(
        ilike(departments.name, `%${search}%`),
        ilike(departments.code, `%${search}%`)
      )
    : undefined;

  const data = await db
    .select()
    .from(departments)
    .where(whereCondition)
    .orderBy(desc(departments.createdAt))
    .limit(limit)
    .offset(offset);

  const [totalResult] = await db
    .select({ value: count() })
    .from(departments)
    .where(whereCondition);

  const total = totalResult?.value ?? 0;

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getDepartmentById = async (id: string) => {
  const [department] = await db
    .select()
    .from(departments)
    .where(eq(departments.id, id))
    .limit(1);

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  return department;
};

export const createDepartment = async (
  input: CreateDepartmentInput,
  createdById: string
) => {
  const [existingDepartment] = await db
    .select()
    .from(departments)
    .where(eq(departments.code, input.code))
    .limit(1);

  if (existingDepartment) {
    throw new AppError("Department code already exists", 409);
  }

  const [newDepartment] = await db
    .insert(departments)
    .values({
      name: input.name,
      code: input.code,
      description: input.description,
      status: input.status ?? "active",
      createdById,
    })
    .returning();

  return newDepartment;
};

export const updateDepartment = async (
  id: string,
  input: UpdateDepartmentInput
) => {
  await getDepartmentById(id);

  if (input.code) {
    const [existingDepartment] = await db
      .select()
      .from(departments)
      .where(eq(departments.code, input.code))
      .limit(1);

    if (existingDepartment && existingDepartment.id !== id) {
      throw new AppError("Department code already exists", 409);
    }
  }

  const [updatedDepartment] = await db
    .update(departments)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(departments.id, id))
    .returning();

  return updatedDepartment;
};