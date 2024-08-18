import db from "@/db";
import { DaysOfWeek, timeStringToDate } from "@/lib/utils";
import {
  ClassGrade,
  Section,
  SectionSubjectTeacher,
  Slots,
  Subject,
  Teacher,
  TeacherClassGradeSubjectLink,
  TimeTable,
  User,
} from "@prisma/client";
import { NextResponse } from "next/server";
import { TimeTableGenerator } from "@/lib/timeTableGenerator";

export async function GET() {
  const classSlots = await db.classGrade.findMany({
    where: {
      slotsGroupId: {
        not: null,
      },
    },
    include: {
      Section: true,
      Subject: true,
      SlotsGroup: {
        include: {
          Slots: true,
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

  let timeTableList = [];
  const timeTableGenerator = new TimeTableGenerator(classSlots, teacherList);
  try {
    timeTableList = timeTableGenerator.generate();
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 409,
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

  classSlotsWithTimeTable.forEach((classItem) => {
    classItem.Section.forEach((sectionItem) => {
      sectionItem.TimeTable = timeTableList
        .filter((timeTableItem) => timeTableItem.sectionId == sectionItem.id)
        .map((timeTableItem) => {
          const { Slot, ...rest } = timeTableItem;

          const subject = classItem.Subject.find(
            (subjectItem) => subjectItem.id == timeTableItem.subjectId
          );
          const teacher = teacherList.find(
            (teacherItem) => teacherItem.id == timeTableItem.teacherId
          );

          const { TeacherClassGradeSubjectLink, ...restTeacher } = teacher;

          return {
            slots: Slot,
            subject,
            teacher: restTeacher,
            ...rest,
          };
        });
    });
  });

  // const timeTableGroup = await db.timeTableGroup.create({
  //   data: {},
  // });

  // const timeTable = await db.timeTable.createMany({
  //   data: timeTableList.map((item) => {
  //     const { Slot, id, timeTableGroupId, ...rest } = item;
  //     const newTimeTable = {
  //       ...rest,
  //       timeTableGroupId: timeTableGroup.id,
  //     };
  //     return newTimeTable;
  //   }),
  // });
  // timeTableGroup.id;

  return NextResponse.json(classSlotsWithTimeTable);
}
