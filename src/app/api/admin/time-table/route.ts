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
import { generateTimeTableItem, TimeTableWithSlots } from "./utils";

export async function POST() {
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

  const sectionTeacherSubjectList: SectionSubjectTeacher[] = [];
  const timeTableList: TimeTableWithSlots[] = [];

  for (const classItem of classSlots) {
    for (const sectionItem of classItem.Section) {
      for (const slotItem of classItem.SlotsGroup?.Slots!) {
        const timeTableItem = generateTimeTableItem(
          slotItem,
          sectionItem,
          classItem.Subject,
          teacherList,
          sectionTeacherSubjectList,
          timeTableList
        );
        if (timeTableItem) {
          timeTableList.push(timeTableItem.timeTableItem);
          if (timeTableItem.newSectionTeacherForSubject) {
            sectionTeacherSubjectList.push(
              timeTableItem.newSectionTeacherForSubject
            );
          }
        }
      }
    }
  }

  const timeTableGroup = await db.timeTableGroup.create({
    data: {},
  });

  const timeTable = await db.timeTable.createMany({
    data: timeTableList.map((item) => {
      const { Slot, id, timeTableGroupId, ...rest } = item;
      const newTimeTable = {
        ...rest,
        timeTableGroupId: timeTableGroup.id,
      };
      return newTimeTable;
    }),
  });
  timeTableGroup.id;

  return NextResponse.json(
    {
      message: "Time table is successfully generated",
    },
    {
      status: 200,
    }
  );
}

export async function GET() {
  const classSlots = await db.classGrade.findMany({
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

  return NextResponse.json(classSlots);
}
