import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/db";
import prisma from "@/db";
import { UserService } from "@/modules/users/user.service";
import { TeacherService } from "@/modules/teachers/teacher.service";
import { UserRepository } from "@/modules/users/user.repository";
import { UserRoundIcon } from "lucide-react";
import { TeacherRepository } from "@/modules/teachers/teacher.repository";

const requestBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  teacherClassSubjectLink: z.array(
    z.object({
      id: z.number(),
      subjectId: z.number(),
      classGradeId: z.number(),
    })
  ),
});

// TODO: add pagination
export async function GET() {
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
  });

  const parsedTeacherList = teacherList.map((item) => ({
    id: item.id,
    name: item.user.name,
    email: item.user.email,
  }));

  return NextResponse.json(parsedTeacherList);
}

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

  const parsedTeacherClassSubjectLink = teacherClassSubjectLink.map((item) => {
    const { id, ...rest } = item;
    return rest;
  });

  const teacherClassSubjectLinkList = parsedTeacherClassSubjectLink.map(
    (item) => ({
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

export async function POST_V2(req: NextRequest) {
  const parsedRequest = requestBodySchema.safeParse(await req.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: parsedRequest.error.message },
      { status: 400 }
    );
  }

  const { name, email, teacherClassSubjectLink } = parsedRequest.data;

  const userRepository = new UserRepository();
  const teacherRepository = new TeacherRepository();
  const userService = new UserService(userRepository);
  const teacherService = new TeacherService(teacherRepository, userService);

  await db.$transaction(async (transaction) => {
    const teacher = await teacherService.createTeacher({
      name,
      email,
    });
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
