import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { z } from "zod";
import {  getServerAuthSession } from "@/lib/auth";
import { UserSession } from "@/lib/auth";

const requestBodySchema = z.object({
  name: z.string(),
});

type Params = {
  classGradeId: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const classGradeId = parseInt(context.params.classGradeId);

  const sections = await db.section.findMany({
    where: {
      organizationId: organizationId,
      classGradeId: classGradeId,
    },
  });

  return NextResponse.json(sections);
}

export async function POST(req: NextRequest, context: { params: Params }) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const parseResult = requestBodySchema.safeParse(await req.json());

  const classGradeId = parseInt(context.params.classGradeId);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.message },
      { status: 400 }
    );
  }

  const { name } = parseResult.data;

  // TODO: admin auth
  //   if (adminSecret !== process.env.ADMIN_SECRET) {
  //     return NextResponse.json({}, { status: 401 });
  //   }

  console.log("GRADE CREATE");

  await db.section.create({
    data: {
      organizationId,
      name: name,
      classGradeId: classGradeId,
    },
  });

  return NextResponse.json(
    {
      message: "Section is successfully added",
    },
    {
      status: 200,
    }
  );
}
