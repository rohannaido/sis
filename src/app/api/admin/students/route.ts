import db from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  const studentList = await db.student.findMany({
    include: {
      user: true,
    },
  });

  return NextResponse.json(studentList);
}
