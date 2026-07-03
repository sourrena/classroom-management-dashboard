import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  classes as classesTable,
  enrollments,
  subjects,
  users,
} from "../db/schema.js";
import { AppError } from "../utils/AppError.js";
import type { UserRole } from "../types/auth.js";
import type { CreateEnrollmentInput } from "../validators/enrollment.validator.js";

type CurrentUser = {
  id: string;
  role: UserRole;
};

type GetEnrollmentsOptions = {
  currentUser: CurrentUser;
  search?: string;
  classId?: string;
  studentId?: string;
  page?: number;
  limit?: number;
};

const enrollmentListFields = {
  id: enrollments.id,
  studentId: enrollments.studentId,
  studentName: users.fullName,
  studentEmail: users.email,
  classId: enrollments.classId,
  classTitle: classesTable.title,
  subjectId: classesTable.subjectId,
  subjectName: subjects.name,
  enrolledAt: enrollments.enrolledAt,
};

const ensureClassExists = async (classId: string) => {
  const [classItem] = await db
    .select()
    .from(classesTable)
    .where(eq(classesTable.id, classId))
    .limit(1);

  if (!classItem) {
    throw new AppError("Class not found", 404);
  }

  if (classItem.status !== "active") {
    throw new AppError("Cannot enroll in an inactive class", 400);
  }

  return classItem;
};

export const getEnrollments = async ({
  currentUser,
  search = "",
  classId,
  studentId,
  page = 1,
  limit = 10,
}: GetEnrollmentsOptions) => {
  const offset = (page - 1) * limit;

  const conditions = [];

  if (currentUser.role === "student") {
    conditions.push(eq(enrollments.studentId, currentUser.id));
  }

  if (currentUser.role === "teacher" && studentId) {
    conditions.push(eq(enrollments.studentId, studentId));
  }

  if (classId) {
    conditions.push(eq(enrollments.classId, classId));
  }

  if (search) {
    const searchCondition = or(
      ilike(users.fullName, `%${search}%`),
      ilike(users.email, `%${search}%`),
      ilike(classesTable.title, `%${search}%`)
    );

    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }

  const whereCondition =
    conditions.length > 0 ? and(...conditions) : undefined;

  const data = await db
    .select(enrollmentListFields)
    .from(enrollments)
    .leftJoin(users, eq(enrollments.studentId, users.id))
    .leftJoin(classesTable, eq(enrollments.classId, classesTable.id))
    .leftJoin(subjects, eq(classesTable.subjectId, subjects.id))
    .where(whereCondition)
    .orderBy(desc(enrollments.enrolledAt))
    .limit(limit)
    .offset(offset);

  const [totalResult] = await db
    .select({ value: count() })
    .from(enrollments)
    .leftJoin(users, eq(enrollments.studentId, users.id))
    .leftJoin(classesTable, eq(enrollments.classId, classesTable.id))
    .leftJoin(subjects, eq(classesTable.subjectId, subjects.id))
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

export const createEnrollment = async (
  input: CreateEnrollmentInput,
  studentId: string
) => {
  const classItem = await ensureClassExists(input.classId);

  const [existingEnrollment] = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.studentId, studentId),
        eq(enrollments.classId, input.classId)
      )
    )
    .limit(1);

  if (existingEnrollment) {
    throw new AppError("You are already enrolled in this class", 409);
  }

  const [enrolledCountResult] = await db
    .select({ value: count() })
    .from(enrollments)
    .where(eq(enrollments.classId, input.classId));

  const enrolledCount = enrolledCountResult?.value ?? 0;

  if (enrolledCount >= classItem.capacity) {
    throw new AppError("Class is full", 400);
  }

  const [newEnrollment] = await db
    .insert(enrollments)
    .values({
      studentId,
      classId: input.classId,
    })
    .returning();

  return newEnrollment;
};

export const deleteEnrollment = async (id: string, currentUser: CurrentUser) => {
  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.id, id))
    .limit(1);

  if (!enrollment) {
    throw new AppError("Enrollment not found", 404);
  }

  if (
    currentUser.role === "student" &&
    enrollment.studentId !== currentUser.id
  ) {
    throw new AppError("You can only delete your own enrollment", 403);
  }

  const [deletedEnrollment] = await db
    .delete(enrollments)
    .where(eq(enrollments.id, id))
    .returning();

  return deletedEnrollment;
};