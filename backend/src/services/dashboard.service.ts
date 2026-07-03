import { count, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  classes as classesTable,
  departments,
  enrollments,
  subjects,
  users,
} from "../db/schema.js";

const getCount = async <T extends { value: number }>(
  queryPromise: Promise<T[]>
) => {
  const [result] = await queryPromise;
  return result?.value ?? 0;
};

export const getDashboardStats = async () => {
  const [
    students,
    teachers,
    departmentCount,
    subjectCount,
    classCount,
    activeClassCount,
    enrollmentCount,
  ] = await Promise.all([
    getCount(
      db
        .select({ value: count() })
        .from(users)
        .where(eq(users.role, "student"))
    ),

    getCount(
      db
        .select({ value: count() })
        .from(users)
        .where(eq(users.role, "teacher"))
    ),

    getCount(db.select({ value: count() }).from(departments)),

    getCount(db.select({ value: count() }).from(subjects)),

    getCount(db.select({ value: count() }).from(classesTable)),

    getCount(
      db
        .select({ value: count() })
        .from(classesTable)
        .where(eq(classesTable.status, "active"))
    ),

    getCount(db.select({ value: count() }).from(enrollments)),
  ]);

  return {
    students,
    teachers,
    departments: departmentCount,
    subjects: subjectCount,
    classes: classCount,
    activeClasses: activeClassCount,
    enrollments: enrollmentCount,
  };
};