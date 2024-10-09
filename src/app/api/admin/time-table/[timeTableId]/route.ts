import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { UserSession } from "@/lib/auth";
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

type Params = {
  timeTableId: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  const session = await getServerSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const timeTableId = parseInt(context.params.timeTableId);

  const timeTableGroup = await db.timeTableGroup.findFirst({
    where: {
      id: timeTableId,
      organizationId,
    },
    include: {
      TimeTable: {
        include: {
          slots: true,
        },
      },
    },
  });

  if (!timeTableGroup) {
    return NextResponse.json(
      {
        message: "Time Table not found",
      },
      {
        status: 400,
      }
    );
  }

  const timeTableList = await db.timeTableGroup.findUnique({
    where: {
      id: timeTableId,
    },
    include: {
      TimeTable: {
        include: {
          classGrade: true,
          section: true,
          slots: true,
          teacher: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          subject: true,
        },
      },
    },
  });

  return NextResponse.json(timeTableList);
}

export async function PUT(req: NextRequest, context: { params: Params }) {
  const session = await getServerSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const parsedRequest = timeTableRequestBodySchema.safeParse(await req.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: parsedRequest.error.message },
      {
        status: 400,
      }
    );
  }

  const timeTableId = parseInt(context.params.timeTableId);

  const timeTableGroup = await db.timeTableGroup.findFirst({
    where: {
      id: timeTableId,
    },
  });

  if (!timeTableGroup) {
    return NextResponse.json(
      {
        message: "Not found!",
      },
      {
        status: 400,
      }
    );
  }

  await db.timeTable.deleteMany({
    where: {
      timeTableGroupId: timeTableId,
      organizationId,
    },
  });

  const timeTable = await db.timeTable.createMany({
    data: parsedRequest.data.map((timeTableItem) => ({
      organizationId: organizationId,
      timeTableGroupId: timeTableId,
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
