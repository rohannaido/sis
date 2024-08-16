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

  const sectionTeacherSubjectList: SectionSubjectTeacher[] = [];
  const timeTableList: TimeTableWithSlots[] = [];

  for (const classItem of classSlots) {
    for (const sectionItem of classItem.Section) {
      const slotWiseDay: { [key: string]: Slots[] } = {};
      classItem.SlotsGroup?.Slots?.forEach((slotItem) => {
        if (!slotWiseDay[slotItem.slotNumber]) {
          slotWiseDay[slotItem.slotNumber] = [];
        }
        slotWiseDay[slotItem.slotNumber].push(slotItem);
      });
      for (const slotNumber of Object.keys(slotWiseDay)) {
        for (const slotItem of slotWiseDay[slotNumber]) {
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

// export async function GET() {
//   const classSlots = await db.classGrade.findMany({
//     where: {
//       slotsGroupId: {
//         not: null,
//       },
//     },
//     include: {
//       SlotsGroup: {
//         include: {
//           Slots: true,
//         },
//       },
//       Section: {
//         include: {
//           TimeTable: {
//             include: {
//               slots: true,
//               subject: true,
//               teacher: {
//                 include: {
//                   user: true,
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   return NextResponse.json(classSlots);
// }
