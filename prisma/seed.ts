import db from "../src/db";

import chapterData from "./seedData/chapter.json";
import chapterContentData from "./seedData/chapterContent.json";
import classGradeData from "./seedData/classGrade.json";
import sectionData from "./seedData/section.json";
import studentData from "./seedData/student.json";
import subjectData from "./seedData/subject.json";

import {
  Chapter,
  ChapterContent,
  ClassGrade,
  Section,
  Student,
  Subject,
} from "@prisma/client";

const chapter: Chapter[] = chapterData;
const chapterContent: ChapterContent[] = chapterContentData;
const classGrade: ClassGrade[] = classGradeData;
const section: Section[] = sectionData;
const student: Student[] = studentData;
const subject: Subject[] = subjectData;

async function seedUsers() {
  const test = await db.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      email: "test@test.com",
      name: "Test",
      password:
        "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEiLCJpYXQiOjE3MjI0NDg1OTQsImV4cCI6MTc1Mzk4NDU5NH0.V4wKMokFAuzKCfVEGbB4KN2_NQP3Meu-tX9v1_NGbag",
    },
  });
  const rohan = await db.user.upsert({
    where: { email: "rohan@test.com" },
    update: {},
    create: {
      email: "rohan@test.com",
      name: "Rohan",
      password:
        "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjIiLCJpYXQiOjE3MjIyNzE1NjgsImV4cCI6MTc1MzgwNzU2OH0.z05_GvZ-JuLCOwYY8TZWf1mZcRqUgC5Z61Fv9mdTqJI",
    },
  });
  console.log({ test, rohan });
}

async function seedDatabase() {
  try {
    await seedUsers();

    const classGradeData = classGrade.map(({ id, ...rest }) => rest);
    await db.classGrade.createMany({ data: classGradeData });

    const subjectData = subject.map(({ id, ...rest }) => rest);
    await db.subject.createMany({ data: subjectData });

    const sectionData = section.map(({ id, ...rest }) => rest);
    await db.section.createMany({ data: sectionData });

    const studentData = student.map(({ id, ...rest }) => rest);
    await db.student.createMany({ data: studentData });

    const chapterData = chapter.map(({ id, ...rest }) => rest);
    await db.chapter.createMany({ data: chapterData });

    const chapterContentData = chapterContent.map(({ id, ...rest }) => rest);
    await db.chapterContent.createMany({ data: chapterContentData });
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

seedDatabase().catch((error) => {
  console.error("An unexpected error occurred during seeding:", error);
  process.exit(1);
});
