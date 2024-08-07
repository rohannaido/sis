import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/db";

const requestBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  teacherClassSubjectLink: z.array(
    z.object({
      subjectId: z.number(),
      classGradeId: z.number(),
    })
  ),
});

export async function POST(req: NextRequest) {
  const parsedRequest = requestBodySchema.safeParse(await req.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: parsedRequest.error.message },
      { status: 400 }
    );
  }

  const { name, email, teacherClassSubjectLink } = parsedRequest.data;

  const user = await db.user.create({
    data: {
      name,
      email,
    },
  });

  const teacher = await db.teacher.create({
    data: {
      userId: user.id,
    },
  });

  const teacherClassSubjectLinkList = teacherClassSubjectLink.map((item) => ({
    ...item,
    teacherId: teacher.id,
  }));

  await db.teacherClassGradeSubjectLink.createMany({
    data: teacherClassSubjectLinkList,
  });

  return NextResponse.json(
    {
      message: "Teacher is successfully added",
    },
    {
      status: 200,
    }
  );
}
