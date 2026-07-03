import { db, pool } from "./index.js";
import {
  classes as classesTable,
  departments,
  enrollments,
  subjects,
  users,
} from "./schema.js";
import { hashPassword } from "../utils/password.js";

const seed = async () => {
  console.log("Starting database seed...");

  const passwordHash = await hashPassword("password123");

  console.log("Clearing old data...");

  await db.delete(enrollments);
  await db.delete(classesTable);
  await db.delete(subjects);
  await db.delete(departments);
  await db.delete(users);

  console.log("Creating users...");

  const insertedUsers = await db
    .insert(users)
    .values([
      {
        fullName: "Dr. Alice Morgan",
        email: "alice.teacher@test.com",
        passwordHash,
        role: "teacher",
        avatarUrl: "https://i.pravatar.cc/150?img=47",
      },
      {
        fullName: "Dr. Marco Rossi",
        email: "marco.teacher@test.com",
        passwordHash,
        role: "teacher",
        avatarUrl: "https://i.pravatar.cc/150?img=12",
      },
      {
        fullName: "Sofia Bianchi",
        email: "sofia.student@test.com",
        passwordHash,
        role: "student",
        avatarUrl: "https://i.pravatar.cc/150?img=32",
      },
      {
        fullName: "Luca Ferri",
        email: "luca.student@test.com",
        passwordHash,
        role: "student",
        avatarUrl: "https://i.pravatar.cc/150?img=15",
      },
      {
        fullName: "Sara Conti",
        email: "sara.student@test.com",
        passwordHash,
        role: "student",
        avatarUrl: "https://i.pravatar.cc/150?img=26",
      },
    ])
    .returning();

  const teacherAlice = insertedUsers.find(
    (user) => user.email === "alice.teacher@test.com"
  );

  const teacherMarco = insertedUsers.find(
    (user) => user.email === "marco.teacher@test.com"
  );

  const studentSofia = insertedUsers.find(
    (user) => user.email === "sofia.student@test.com"
  );

  const studentLuca = insertedUsers.find(
    (user) => user.email === "luca.student@test.com"
  );

  const studentSara = insertedUsers.find(
    (user) => user.email === "sara.student@test.com"
  );

  if (!teacherAlice || !teacherMarco || !studentSofia || !studentLuca || !studentSara) {
    throw new Error("Failed to create seed users");
  }

  console.log("Creating departments...");

  const insertedDepartments = await db
    .insert(departments)
    .values([
      {
        name: "Computer Engineering",
        code: "CE",
        description: "Department focused on software, systems, and computing.",
        createdById: teacherAlice.id,
      },
      {
        name: "Electrical Engineering",
        code: "EE",
        description: "Department focused on electronics, circuits, and signals.",
        createdById: teacherMarco.id,
      },
    ])
    .returning();

  const computerEngineering = insertedDepartments.find(
    (department) => department.code === "CE"
  );

  const electricalEngineering = insertedDepartments.find(
    (department) => department.code === "EE"
  );

  if (!computerEngineering || !electricalEngineering) {
    throw new Error("Failed to create seed departments");
  }

  console.log("Creating subjects...");

  const insertedSubjects = await db
    .insert(subjects)
    .values([
      {
        name: "Web Development",
        code: "WEB101",
        description: "Frontend, backend, APIs, and database-driven web apps.",
        departmentId: computerEngineering.id,
        createdById: teacherAlice.id,
      },
      {
        name: "Database Systems",
        code: "DB201",
        description: "Relational databases, SQL, schema design, and transactions.",
        departmentId: computerEngineering.id,
        createdById: teacherAlice.id,
      },
      {
        name: "Digital Electronics",
        code: "DE101",
        description: "Logic gates, combinational circuits, and sequential systems.",
        departmentId: electricalEngineering.id,
        createdById: teacherMarco.id,
      },
      {
        name: "Signals and Systems",
        code: "SIG201",
        description: "Signal analysis, systems, filters, and frequency response.",
        departmentId: electricalEngineering.id,
        createdById: teacherMarco.id,
      },
    ])
    .returning();

  const webDevelopment = insertedSubjects.find(
    (subject) => subject.code === "WEB101"
  );

  const databaseSystems = insertedSubjects.find(
    (subject) => subject.code === "DB201"
  );

  const digitalElectronics = insertedSubjects.find(
    (subject) => subject.code === "DE101"
  );

  const signalsSystems = insertedSubjects.find(
    (subject) => subject.code === "SIG201"
  );

  if (!webDevelopment || !databaseSystems || !digitalElectronics || !signalsSystems) {
    throw new Error("Failed to create seed subjects");
  }

  console.log("Creating classes...");

  const insertedClasses = await db
    .insert(classesTable)
    .values([
      {
        title: "Full-Stack Web Development",
        description: "Build complete applications with React, Express, and PostgreSQL.",
        subjectId: webDevelopment.id,
        teacherId: teacherAlice.id,
        capacity: 30,
        bannerImageUrl:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      },
      {
        title: "Advanced Database Design",
        description: "Design normalized schemas, queries, and relational data models.",
        subjectId: databaseSystems.id,
        teacherId: teacherAlice.id,
        capacity: 25,
        bannerImageUrl:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
      },
      {
        title: "Digital Logic Laboratory",
        description: "Hands-on work with digital circuits and logic design.",
        subjectId: digitalElectronics.id,
        teacherId: teacherMarco.id,
        capacity: 20,
        bannerImageUrl:
          "https://images.unsplash.com/photo-1518770660439-4636190af475",
      },
      {
        title: "Signal Processing Fundamentals",
        description: "Understand signals, systems, sampling, and frequency analysis.",
        subjectId: signalsSystems.id,
        teacherId: teacherMarco.id,
        capacity: 35,
        bannerImageUrl:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      },
    ])
    .returning();

  const fullStackClass = insertedClasses.find(
    (classItem) => classItem.title === "Full-Stack Web Development"
  );

  const databaseClass = insertedClasses.find(
    (classItem) => classItem.title === "Advanced Database Design"
  );

  const logicClass = insertedClasses.find(
    (classItem) => classItem.title === "Digital Logic Laboratory"
  );

  if (!fullStackClass || !databaseClass || !logicClass) {
    throw new Error("Failed to create seed classes");
  }

  console.log("Creating enrollments...");

  await db.insert(enrollments).values([
    {
      studentId: studentSofia.id,
      classId: fullStackClass.id,
    },
    {
      studentId: studentLuca.id,
      classId: fullStackClass.id,
    },
    {
      studentId: studentSara.id,
      classId: databaseClass.id,
    },
    {
      studentId: studentSofia.id,
      classId: logicClass.id,
    },
  ]);

  console.log("Seed completed successfully.");
  console.log("");
  console.log("Demo accounts:");
  console.log("Teacher: alice.teacher@test.com / password123");
  console.log("Teacher: marco.teacher@test.com / password123");
  console.log("Student: sofia.student@test.com / password123");
  console.log("Student: luca.student@test.com / password123");
  console.log("Student: sara.student@test.com / password123");
};

seed()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });