import db from "../src/db";
import fs from "fs";

async function seedCreatorDatabase() {
  try {
    const user = await db.user.findMany({});
    fs.writeFileSync("./prisma/seedData/user.json", JSON.stringify(user));

    const chapter = await db.chapter.findMany({});
    fs.writeFileSync("./prisma/seedData/chapter.json", JSON.stringify(chapter));

    const chapterContent = await db.chapterContent.findMany({});
    fs.writeFileSync(
      "./prisma/seedData/chapterContent.json",
      JSON.stringify(chapterContent)
    );

    const classGrade = await db.classGrade.findMany({});
    fs.writeFileSync(
      "./prisma/seedData/classGrade.json",
      JSON.stringify(classGrade)
    );

    const section = await db.section.findMany({});
    fs.writeFileSync("./prisma/seedData/section.json", JSON.stringify(section));

    const student = await db.student.findMany({});
    fs.writeFileSync("./prisma/seedData/student.json", JSON.stringify(student));

    const subject = await db.subject.findMany({});
    fs.writeFileSync("./prisma/seedData/subject.json", JSON.stringify(subject));
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

seedCreatorDatabase().catch((error) => {
  console.error("An unexpected error occurred during seeding:", error);
  process.exit(1);
});
