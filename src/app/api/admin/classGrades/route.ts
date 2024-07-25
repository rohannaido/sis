import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { z } from "zod";

const requestBodySchema = z.object({
  title: z.string(),
});

export async function GET(req: NextRequest) {
  const classGrades = await db.classGrade.findMany();

  return NextResponse.json(classGrades);
}

export async function POST(req: NextRequest) {
  const parseResult = requestBodySchema.safeParse(await req.json());

  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.message },
      { status: 400 }
    );
  }

  const { title } = parseResult.data;

  // TODO: admin auth
  //   if (adminSecret !== process.env.ADMIN_SECRET) {
  //     return NextResponse.json({}, { status: 401 });
  //   }

  console.log("GRADE CREATE");

  await db.classGrade.create({
    data: {
      title,
    },
  });

  return NextResponse.json(
    {
      message: "Class is successfully added",
    },
    {
      status: 200,
    }
  );
}
