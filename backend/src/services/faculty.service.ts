import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { AppError } from "../utils/AppError.js";

type GetFacultyOptions = {
  search?: string;
  page?: number;
  limit?: number;
};

const publicFacultyFields = {
  id: users.id,
  fullName: users.fullName,
  email: users.email,
  role: users.role,
  avatarUrl: users.avatarUrl,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

export const getFaculty = async ({
  search = "",
  page = 1,
  limit = 10,
}: GetFacultyOptions) => {
  const offset = (page - 1) * limit;

  const roleCondition = eq(users.role, "teacher");

  const searchCondition = search
    ? or(
        ilike(users.fullName, `%${search}%`),
        ilike(users.email, `%${search}%`)
      )
    : undefined;

  const whereCondition = searchCondition
    ? and(roleCondition, searchCondition)
    : roleCondition;

  const data = await db
    .select(publicFacultyFields)
    .from(users)
    .where(whereCondition)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);

  const [totalResult] = await db
    .select({ value: count() })
    .from(users)
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

export const getFacultyMemberById = async (id: string) => {
  const [facultyMember] = await db
    .select(publicFacultyFields)
    .from(users)
    .where(and(eq(users.id, id), eq(users.role, "teacher")))
    .limit(1);

  if (!facultyMember) {
    throw new AppError("Faculty member not found", 404);
  }

  return facultyMember;
};