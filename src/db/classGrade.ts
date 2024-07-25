import db from "@/db";

export async function getAllClassGrades() {
  const classGrades = await db.classGrade.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return classGrades;
}

export async function getClassGrade(classGradeId: number) {
  const classGrade = db.classGrade.findFirst({
    where: {
      id: classGradeId,
    },
  });
  return classGrade;
}
