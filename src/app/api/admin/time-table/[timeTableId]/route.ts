import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
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

type Params = {
  timeTableId: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  const timeTableId = parseInt(context.params.timeTableId);

  const timeTableGroup = await db.timeTableGroup.findFirst({
    where: {
      id: timeTableId,
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

  const classSlotsWithTimeTable = await db.classGrade.findMany({
    where: {
      slotsGroupId: {
        not: null,
      },
    },
    include: {
      SlotsGroup: {
        include: {
          Slots: true,
        },
      },
      Subject: true,
      Section: {
        include: {
          TimeTable: {
            include: {
              slots: true,
              subject: true,
              teacher: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const teacherList = await db.teacher.findMany({
    include: {
      TeacherClassGradeSubjectLink: true,
      user: true,
    },
  });

  const timeTableList = timeTableGroup.TimeTable;

  classSlotsWithTimeTable.forEach((classItem) => {
    classItem.Section.forEach((sectionItem) => {
      // @ts-ignore
      sectionItem.TimeTable = timeTableList
        .filter((timeTableItem) => timeTableItem.sectionId == sectionItem.id)
        .map((timeTableItem) => {
          const { ...rest } = timeTableItem;

          const subject = classItem.Subject.find(
            (subjectItem) => subjectItem.id == timeTableItem.subjectId
          );
          const teacher = teacherList.find(
            (teacherItem) => teacherItem.id == timeTableItem.teacherId
          );

          // @ts-ignore
          const { TeacherClassGradeSubjectLink, ...restTeacher } = teacher;

          return {
            subject,
            teacher: restTeacher,
            ...rest,
          };
        });
    });
  });

  return NextResponse.json(classSlotsWithTimeTable);
}

export async function PUT(req: NextRequest, context: { params: Params }) {
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
    },
  });

  const timeTable = await db.timeTable.createMany({
    data: parsedRequest.data.map((timeTableItem) => ({
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
