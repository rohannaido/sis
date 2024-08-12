import db from "@/db";
import { DaysOfWeek, timeStringToDate } from "@/lib/utils";
import {
  Section,
  Slots,
  Subject,
  Teacher,
  TeacherClassGradeSubjectLink,
  User,
} from "@prisma/client";
import { NextResponse } from "next/server";

export interface newSlot {
  id: number;
  slotGroupId: number;
  slotNumber: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  type: string;
  subject: NewSubject | null;
  teacher: NewTeacher | null;
}

export interface NewSubject extends Subject {
  teacher: NewTeacher | null;
}

export interface DailySlots {
  [key: string]: newSlot[];
}

export interface NewSection extends Section {
  DailySlots: DailySlots;
  Subjects: NewSubject[];
}

export interface TeacherDailySlots {
  [key: string]: {
    startTime: string;
    endTime: string;
    // section: Section;
    // subject: Subject;
  }[];
}

export interface NewTeacher extends Teacher {
  user: User;
  dailySlots: TeacherDailySlots;
  TeacherClassGradeSubjectLink: TeacherClassGradeSubjectLink[];
}

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

  const newClassSlots: {
    Section: NewSection[];
    SlotsGroup:
      | ({
          Slots: {
            id: number;
            slotGroupId: number;
            slotNumber: number;
            dayOfWeek: string;
            startTime: string;
            endTime: string;
            type: string;
          }[];
        } & { id: number; name: string })
      | null;
    Subject: {
      id: number;
      classGradeId: number;
      periodCountPerWeek: number;
      name: string | null;
    }[];
    id: number;
    title: string;
    slotsGroupId: number | null;
  }[] = [];

  classSlots.forEach((classItem) => {
    const sectionSlots: NewSection[] = classItem.Section.map(
      (sectionItem): NewSection => {
        const dayWiseSlots: DailySlots = classItem.SlotsGroup!.Slots.reduce(
          (acc, item) => {
            let newSlot: newSlot = {
              ...item,
              subject: null,
              teacher: null,
            };
            if (acc[newSlot.dayOfWeek]) {
              acc[newSlot.dayOfWeek].push(newSlot);
            } else {
              acc[newSlot.dayOfWeek] = [newSlot];
            }
            return acc;
          },
          {} as DailySlots
        );

        const newSubject: NewSubject[] = classItem.Subject.map(
          (item): NewSubject => ({
            ...item,
            teacher: null,
          })
        );

        return {
          ...sectionItem,
          DailySlots: dayWiseSlots,
          Subjects: newSubject,
        };
      }
    );
    const { Section, ...restClassItem } = classItem;

    newClassSlots.push({
      ...restClassItem,
      Section: sectionSlots,
    });
  });

  const teacherList = await db.teacher.findMany({
    include: {
      TeacherClassGradeSubjectLink: true,
      user: true,
    },
  });

  const teacherListNew: NewTeacher[] = teacherList.map(
    (teacherItem): NewTeacher => {
      const teacherDailySlots: TeacherDailySlots = {};

      for (const day of Object.values(DaysOfWeek)) {
        teacherDailySlots[day] = [];
      }

      const newTeacherItem = {
        ...teacherItem,
        dailySlots: teacherDailySlots,
      };
      return newTeacherItem;
    }
  );

  newClassSlots.forEach((classItem) => {
    for (const sectionItem of classItem.Section) {
      const subjectOccuerenceLowestCount: any = {};
      sectionItem.Subjects.forEach((sectionItemForMap) => {
        subjectOccuerenceLowestCount[sectionItemForMap.id] = 0;
      });
      const subjectPerDayCount: any = {};
      Object.keys(sectionItem.DailySlots).forEach((item) => {
        const subjectCount: any = {};
        sectionItem.Subjects.forEach((sectionItemForMap) => {
          subjectCount[sectionItemForMap.id] = 0;
        });
        subjectPerDayCount[item] = subjectCount;
      });

      for (const weekDayItem of Object.keys(sectionItem.DailySlots)) {
        for (const slotItem of sectionItem.DailySlots[weekDayItem]) {
          if (slotItem.teacher && slotItem.subject) {
            continue;
          }

          let subjectToAdd = sectionItem.Subjects.find(
            (subjectItem) =>
              subjectItem.periodCountPerWeek > 0 &&
              subjectPerDayCount[weekDayItem][subjectItem.id] ==
                subjectOccuerenceLowestCount[subjectItem.id]
          );

          if (!subjectToAdd) {
            continue;
          }

          let teacherForSubject;

          if (!subjectToAdd?.teacher) {
            teacherForSubject = teacherListNew.find((teacherItem) =>
              teacherItem.TeacherClassGradeSubjectLink.find(
                (teacherLinkItem) =>
                  teacherLinkItem.classGradeId == classItem.id &&
                  teacherLinkItem.subjectId == subjectToAdd?.id
              )
            );
          } else {
            teacherForSubject = subjectToAdd?.teacher;
          }

          if (!teacherForSubject) {
            throw new Error(
              `Teacher not found for class ${classItem.title}, section ${sectionItem.name}, subject ${subjectToAdd.name}!`
            );
          }

          slotItem.startTime, slotItem.endTime;

          let canAccomodate = true;
          const slotStartTime = timeStringToDate(slotItem.startTime);
          const slotEndTime = timeStringToDate(slotItem.endTime);

          for (const teacherSlot of teacherForSubject.dailySlots[weekDayItem]) {
            const teacherSlotStartTime = timeStringToDate(
              teacherSlot.startTime
            );
            const teacherSlotEndTime = timeStringToDate(teacherSlot.endTime);
            if (
              (slotStartTime < teacherSlotEndTime &&
                slotStartTime >= teacherSlotStartTime) ||
              (slotEndTime > teacherSlotStartTime &&
                slotEndTime <= teacherSlotEndTime) ||
              (slotStartTime <= teacherSlotStartTime &&
                slotEndTime >= teacherSlotEndTime)
            ) {
              canAccomodate = false;
            }
          }

          if (canAccomodate == false) {
            continue;
          }

          teacherForSubject.dailySlots[weekDayItem].push({
            startTime: slotItem.startTime,
            endTime: slotItem.endTime,
          });

          subjectToAdd.teacher = teacherForSubject;

          slotItem.teacher = teacherForSubject;
          slotItem.subject = subjectToAdd;
          subjectToAdd.periodCountPerWeek--;
          subjectPerDayCount[weekDayItem][subjectToAdd.id]++;

          const subjectInDayCountArray: any[] = [];
          Object.values(subjectPerDayCount).forEach((subjectCountItem: any) => {
            subjectInDayCountArray.push(subjectCountItem[subjectToAdd.id]);
          });

          subjectOccuerenceLowestCount[subjectToAdd.id] = Math.min(
            ...subjectInDayCountArray
          );
        }
      }
    }
  });

  return NextResponse.json(newClassSlots);
}
