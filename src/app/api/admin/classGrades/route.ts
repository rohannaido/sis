import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { z } from "zod";
import {  getServerAuthSession } from "@/lib/auth";
import { UserSession } from "@/lib/auth";

const requestBodySchema = z.object({
  title: z.string(),
});

export async function GET(req: NextRequest) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const classGrades = await db.classGrade.findMany({
    where: {
      organizationId,
    },
  });

  return NextResponse.json(classGrades);
}

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

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
      organizationId,
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
