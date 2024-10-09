import db from "@/db";
import { ClassGrade } from "@prisma/client";

export async function getAllClassGrades(organizationId: number) {
  const classGrades = await db.classGrade.findMany({
    where: {
      organizationId,
    },
    orderBy: {
      id: "desc",
    },
  });

  return classGrades;
}

export async function getClassGrade(
  classGradeId: number
): Promise<ClassGrade | null> {
  const classGrade = db.classGrade.findFirst({
    where: {
      id: classGradeId,
    },
  });
  return classGrade;
}
