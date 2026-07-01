import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  fullName: text("full_name").notNull(),

  email: text("email").notNull().unique(),

  passwordHash: text("password_hash").notNull(),

  role: text("role").notNull(), // "student" or "teacher"

  avatarUrl: text("avatar_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: text("name").notNull(),

  code: text("code").notNull().unique(),

  description: text("description"),

  status: text("status").notNull().default("active"),

  createdById: uuid("created_by_id")
    .notNull()
    .references(() => users.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subjects = pgTable("subjects", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: text("name").notNull(),

  code: text("code").notNull().unique(),

  description: text("description"),

  departmentId: uuid("department_id")
    .notNull()
    .references(() => departments.id),

  status: text("status").notNull().default("active"),

  createdById: uuid("created_by_id")
    .notNull()
    .references(() => users.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: text("title").notNull(),

  description: text("description"),

  subjectId: uuid("subject_id")
    .notNull()
    .references(() => subjects.id),

  teacherId: uuid("teacher_id")
    .notNull()
    .references(() => users.id),

  capacity: integer("capacity").notNull(),

  bannerImageUrl: text("banner_image_url"),

  status: text("status").notNull().default("active"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id),

    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id),

    enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueStudentClass: unique().on(table.studentId, table.classId),
  })
);