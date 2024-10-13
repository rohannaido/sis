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

export async function DELETE(req: NextRequest, context: { params: Params }) {
  try {
    const classGradeId = parseInt(context.params.classGradeId);

    await db.classGrade.delete({
      where: {
        id: classGradeId,
      },
    });

    return NextResponse.json({ message: "Class grade deleted successfully" });
  } catch (error) {
    console.error("Error deleting class grade:", error);
    return NextResponse.json(
      { message: "Failed to delete class grade" },
      { status: 500 }
    );
  }
}
