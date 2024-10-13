import db from "@/db";
import { UserSession } from "@/lib/auth";
import {  getServerAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const timeTableRequestBodySchema = z.object({
  timeTable: z.array(
    z.object({
      classGradeId: z.number(),
      sectionId: z.number(),
      slotsGroupId: z.number(),
      dayOfWeek: z.string(),
      slotsId: z.number(),
      subjectId: z.number(),
      teacherId: z.number(),
    })
  ),
  slotsGroupId: z.number(),
});

export async function GET() {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const timeTableGroups = await db.timeTableGroup.findMany({
    where: {
      organizationId: organizationId,
    },
    include: {
      slotsGroup: true,
    },
  });

  return NextResponse.json(timeTableGroups);
}

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const parsedRequest = timeTableRequestBodySchema.safeParse(await req.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: parsedRequest.error.message },
      { status: 400 }
    );
  }

  const timeTableGroup = await db.timeTableGroup.create({
    data: {
      organizationId,
      slotsGroupId: parsedRequest.data.slotsGroupId,
    },
  });

  const timeTable = await db.timeTable.createMany({
    data: parsedRequest.data.timeTable.map((timeTableItem) => ({
      organizationId,
      timeTableGroupId: timeTableGroup.id,
      ...timeTableItem,
    })),
  });

  return NextResponse.json(
    {
      message: "Time table saved",
    },
    {
      status: 200,
    }
  );
}
