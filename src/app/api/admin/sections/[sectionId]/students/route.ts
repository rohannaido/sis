import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { z } from "zod";
import {  getServerAuthSession } from "@/lib/auth";
import { UserSession } from "@/lib/auth";

type Params = {
  sectionId: string;
};

const requestBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export async function GET(req: NextRequest, context: { params: Params }) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const sectionId = parseInt(context.params.sectionId);

  let studentList = await db.student.findMany({
    where: {
      organizationId: organizationId,
      sectionId: sectionId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const studentListParsed = studentList.map((item) => {
    const { user, ...rest } = item;
    return {
      ...rest,
      name: user.name,
      email: user.email,
    };
  });

  return NextResponse.json(studentListParsed);
}

export async function POST(req: NextRequest, context: { params: Params }) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const parseResult = requestBodySchema.safeParse(await req.json());

  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.message },
      { status: 400 }
    );
  }

  const sectionId = parseInt(context.params.sectionId);
  const { name, email } = parseResult.data;

  const sectionDetail = await db.section.findFirst({
    where: {
      id: sectionId,
    },
  });

  if (!sectionDetail) {
    return NextResponse.json({ error: "Error Creating" }, { status: 400 });
  }

  const user = await db.user.create({
    data: {
      organizationId,
      email,
      name,
      role: "STUDENT",
      // TODO: set Password hash
      // password:
    },
  });

  await db.student.create({
    data: {
      organizationId,
      classGradeId: sectionDetail.classGradeId,
      userId: user.id,
      sectionId,
    },
  });

  return NextResponse.json(
    {
      message: "Student is successfully added",
    },
    {
      status: 200,
    }
  );
}
