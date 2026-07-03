import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "../db/index.js";
import { departments, subjects } from "../db/schema.js";
import { AppError } from "../utils/AppError.js";
import type {
  CreateSubjectInput,
  UpdateSubjectInput,
} from "../validators/subject.validator.js";

type GetSubjectsOptions = {
  search?: string;
  departmentId?: string;
  page?: number;
  limit?: number;
};

const ensureDepartmentExists = async (departmentId: string) => {
  const [department] = await db
    .select()
    .from(departments)
    .where(eq(departments.id, departmentId))
    .limit(1);

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  return department;
};

export const getSubjects = async ({
  search = "",
  departmentId,
  page = 1,
  limit = 10,
}: GetSubjectsOptions) => {
  const offset = (page - 1) * limit;

  const searchCondition = search
    ? or(
        ilike(subjects.name, `%${search}%`),
        ilike(subjects.code, `%${search}%`)
      )
    : undefined;

  const departmentCondition = departmentId
    ? eq(subjects.departmentId, departmentId)
    : undefined;

  const whereCondition =
    searchCondition && departmentCondition
      ? and(searchCondition, departmentCondition)
      : searchCondition ?? departmentCondition;

  const data = await db
    .select()
    .from(subjects)
    .where(whereCondition)
    .orderBy(desc(subjects.createdAt))
    .limit(limit)
    .offset(offset);

  const [totalResult] = await db
    .select({ value: count() })
    .from(subjects)
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

export const getSubjectById = async (id: string) => {
  const [subject] = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, id))
    .limit(1);

  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  return subject;
};

export const createSubject = async (
  input: CreateSubjectInput,
  createdById: string
) => {
  await ensureDepartmentExists(input.departmentId);

  const [existingSubject] = await db
    .select()
    .from(subjects)
    .where(eq(subjects.code, input.code))
    .limit(1);

  if (existingSubject) {
    throw new AppError("Subject code already exists", 409);
  }

  const [newSubject] = await db
    .insert(subjects)
    .values({
      name: input.name,
      code: input.code,
      description: input.description,
      departmentId: input.departmentId,
      status: input.status ?? "active",
      createdById,
    })
    .returning();

  return newSubject;
};

export const updateSubject = async (id: string, input: UpdateSubjectInput) => {
  await getSubjectById(id);

  if (input.departmentId) {
    await ensureDepartmentExists(input.departmentId);
  }

  if (input.code) {
    const [existingSubject] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.code, input.code))
      .limit(1);

    if (existingSubject && existingSubject.id !== id) {
      throw new AppError("Subject code already exists", 409);
    }
  }

  const [updatedSubject] = await db
    .update(subjects)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(subjects.id, id))
    .returning();

  return updatedSubject;
};