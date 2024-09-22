import { NextRequest, NextResponse } from "next/server";
import db from "@/db";

type Params = {
  classGradeId: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  const classGradeId = parseInt(context.params.classGradeId);

  const classGrade = await db.classGrade.findFirst({
    where: {
      id: classGradeId,
    },
  });

  return NextResponse.json(classGrade);
}
