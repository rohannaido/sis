import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/db";
import {  getServerAuthSession } from "@/lib/auth";
import { UserSession } from "@/lib/auth";

const requestBodySchema = z.object({
  slotsGroupId: z.number(),
  classSubjectCountList: z.array(
    z.object({
      subjectId: z.number(),
      subjectPeriodCount: z.number(),
    })
  ),
});

type Params = {
  classGradeId: string;
};

export async function PUT(
  req: NextRequest,
  context: {
    params: Params;
  }
) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const parsedRequest = requestBodySchema.safeParse(await req.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        error: parsedRequest.error.message,
      },
      {
        status: 400,
      }
    );
  }

  const classGradeId = parseInt(context.params.classGradeId);

  const { slotsGroupId, classSubjectCountList } = parsedRequest.data;

  await db.classGrade.update({
    data: {
      slotsGroupId: slotsGroupId,
    },
    where: {
      id: classGradeId,
    },
  });

  // TODO : OPTIMIZE
  await db.subject.updateMany({
    data: {
      periodCountPerWeek: 0,
    },
    where: {
      classGradeId,
      organizationId: organizationId,
    },
  });

  for (const subjectCounts of classSubjectCountList) {
    await db.subject.update({
      data: {
        periodCountPerWeek: subjectCounts.subjectPeriodCount,
      },
      where: {
        id: subjectCounts.subjectId,
      },
    });
  }

  return NextResponse.json(
    {
      message: "Subject periods linked successfully",
    },
    {
      status: 200,
    }
  );
}

export async function GET(req: NextRequest, context: { params: Params }) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const classGradeId = parseInt(context.params.classGradeId);

  const classGrade = await db.classGrade.findFirst({
    where: {
      id: classGradeId,
    },
    select: {
      slotsGroupId: true,
    },
  });

  if (!classGrade?.slotsGroupId) {
    return NextResponse.json(
      {
        error: "Not found",
      },
      {
        status: 404,
      }
    );
  }

  const sujectsList = await db.subject.findMany({
    select: {
      id: true,
      periodCountPerWeek: true,
    },
    where: {
      organizationId,
      classGradeId,
      periodCountPerWeek: {
        not: 0,
      },
    },
  });

  const classSubjectCountList: {
    subjectId: number;
    subjectPeriodCount: number;
  }[] = [];

  sujectsList.forEach((item) => {
    classSubjectCountList.push({
      subjectId: item.id,
      subjectPeriodCount: item.periodCountPerWeek,
    });
  });

  const responseObject = {
    slotsGroupId: classGrade?.slotsGroupId,
    classSubjectCountList,
  };

  return NextResponse.json(responseObject);
}
