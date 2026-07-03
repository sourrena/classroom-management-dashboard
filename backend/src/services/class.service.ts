import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "../db/index.js";
import { classes as classesTable, subjects, users } from "../db/schema.js";
import { AppError } from "../utils/AppError.js";
import type {
  CreateClassInput,
  UpdateClassInput,
} from "../validators/class.validator.js";

type GetClassesOptions = {
  search?: string;
  subjectId?: string;
  teacherId?: string;
  status?: string;
  page?: number;
  limit?: number;
};

const ensureSubjectExists = async (subjectId: string) => {
  const [subject] = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, subjectId))
    .limit(1);

  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  return subject;
};

const ensureTeacherExists = async (teacherId: string) => {
  const [teacher] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, teacherId), eq(users.role, "teacher")))
    .limit(1);

  if (!teacher) {
    throw new AppError("Teacher not found", 404);
  }

  return teacher;
};

const classListFields = {
  id: classesTable.id,
  title: classesTable.title,
  description: classesTable.description,
  subjectId: classesTable.subjectId,
  subjectName: subjects.name,
  subjectCode: subjects.code,
  teacherId: classesTable.teacherId,
  teacherName: users.fullName,
  teacherEmail: users.email,
  capacity: classesTable.capacity,
  bannerImageUrl: classesTable.bannerImageUrl,
  status: classesTable.status,
  createdAt: classesTable.createdAt,
  updatedAt: classesTable.updatedAt,
};

export const getClasses = async ({
  search = "",
  subjectId,
  teacherId,
  status,
  page = 1,
  limit = 10,
}: GetClassesOptions) => {
  const offset = (page - 1) * limit;

  const conditions = [];

  if (search) {
    const searchCondition = or(
      ilike(classesTable.title, `%${search}%`),
      ilike(classesTable.description, `%${search}%`)
    );

    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }

  if (subjectId) {
    conditions.push(eq(classesTable.subjectId, subjectId));
  }

  if (teacherId) {
    conditions.push(eq(classesTable.teacherId, teacherId));
  }

  if (status) {
    conditions.push(eq(classesTable.status, status));
  }

  const whereCondition =
    conditions.length > 0 ? and(...conditions) : undefined;

  const data = await db
    .select(classListFields)
    .from(classesTable)
    .leftJoin(subjects, eq(classesTable.subjectId, subjects.id))
    .leftJoin(users, eq(classesTable.teacherId, users.id))
    .where(whereCondition)
    .orderBy(desc(classesTable.createdAt))
    .limit(limit)
    .offset(offset);

  const [totalResult] = await db
    .select({ value: count() })
    .from(classesTable)
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

export const getClassById = async (id: string) => {
  const [classItem] = await db
    .select(classListFields)
    .from(classesTable)
    .leftJoin(subjects, eq(classesTable.subjectId, subjects.id))
    .leftJoin(users, eq(classesTable.teacherId, users.id))
    .where(eq(classesTable.id, id))
    .limit(1);

  if (!classItem) {
    throw new AppError("Class not found", 404);
  }

  return classItem;
};

export const createClass = async (input: CreateClassInput) => {
  await ensureSubjectExists(input.subjectId);
  await ensureTeacherExists(input.teacherId);

  const [newClass] = await db
    .insert(classesTable)
    .values({
      title: input.title,
      description: input.description,
      subjectId: input.subjectId,
      teacherId: input.teacherId,
      capacity: input.capacity,
      bannerImageUrl: input.bannerImageUrl,
      status: input.status ?? "active",
    })
    .returning();

  return newClass;
};

export const updateClass = async (id: string, input: UpdateClassInput) => {
  await getClassById(id);

  if (Object.keys(input).length === 0) {
    throw new AppError("No fields provided for update", 400);
  }

  if (input.subjectId) {
    await ensureSubjectExists(input.subjectId);
  }

  if (input.teacherId) {
    await ensureTeacherExists(input.teacherId);
  }

  const [updatedClass] = await db
    .update(classesTable)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(classesTable.id, id))
    .returning();

  return updatedClass;
};

export const deleteClass = async (id: string) => {
  await getClassById(id);

  const [deletedClass] = await db
    .delete(classesTable)
    .where(eq(classesTable.id, id))
    .returning();

  return deletedClass;
};