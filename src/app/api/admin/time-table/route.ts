import db from "@/db";
import { UserSession } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const timeTableRequestBodySchema = z.array(
  z.object({
    classGradeId: z.number(),
    sectionId: z.number(),
    slotsGroupId: z.number(),
    dayOfWeek: z.string(),
    slotsId: z.number(),
    subjectId: z.number(),
    teacherId: z.number(),
  })
);

export async function GET() {
  const session = await getServerSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const timeTableGroups = await db.timeTableGroup.findMany({
    where: {
      organizationId: organizationId,
    },
  });

  return NextResponse.json(timeTableGroups);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
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
    },
  });

  const timeTable = await db.timeTable.createMany({
    data: parsedRequest.data.map((timeTableItem) => ({
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
