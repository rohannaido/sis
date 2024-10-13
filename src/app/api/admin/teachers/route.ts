import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/db";
import {  getServerAuthSession } from "@/lib/auth";
import { UserSession } from "@/lib/auth";

const requestBodySchema = z.object({
  name: z.string(),
  email: z.string().email().or(z.literal('')),
  teacherClassSubjectLink: z.array(
    z.object({
      id: z.number(),
      subjectId: z.number(),
      classGradeId: z.number(),
    })
  ),
});

export async function GET(req: NextRequest) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const classGradeId = req.nextUrl.searchParams.get("classGradeId");
  const subjectId = req.nextUrl.searchParams.get("subjectId");
  const where: any = {
    organizationId: organizationId,
  };

  if (classGradeId) {
    where.TeacherClassGradeSubjectLink = {
      some: {
        classGradeId: parseInt(classGradeId),
      },
    };
  }

  if (subjectId) {
    where.TeacherClassGradeSubjectLink = {
      some: {
        subjectId: parseInt(subjectId),
      },
    };
  }

  const teacherList = await db.teacher.findMany({
    select: {
      id: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    where,
  });

  const parsedTeacherList = teacherList.map((item) => ({
    id: item.id,
    name: item.user.name,
    email: item.user.email,
  }));

  return NextResponse.json(parsedTeacherList);
}

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

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
      organizationId,
      name,
      email: email || null,
    },
  });

  const teacher = await db.teacher.create({
    data: {
      organizationId,
      userId: user.id,
    },
  });

  const parsedTeacherClassSubjectLink = teacherClassSubjectLink.map((item) => {
    const { id, ...rest } = item;
    return rest;
  });

  const teacherClassSubjectLinkList = parsedTeacherClassSubjectLink.map(
    (item) => ({
      organizationId,
      ...item,
      teacherId: teacher.id,
    })
  );

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
