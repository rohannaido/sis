import db from "@/db";
import { DaysOfWeek } from "@/lib/utils";
import {
  Section,
  Slots,
  Subject,
  Teacher,
  TeacherClassGradeSubjectLink,
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
    section: Section;
    subject: Subject;
  }[];
}

export interface NewTeacher extends Teacher {
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
      for (const weekDayItem of Object.keys(sectionItem.DailySlots)) {
        for (const slotItem of sectionItem.DailySlots[weekDayItem]) {
          console.log(slotItem.teacher, slotItem.subject);
          if (slotItem.teacher && slotItem.subject) {
            continue;
          }

          let subjectToAdd = sectionItem.Subjects.find(
            (subjectItem) => subjectItem.periodCountPerWeek > 0
          );

          console.log(subjectToAdd);
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

          subjectToAdd.teacher = teacherForSubject;

          slotItem.teacher = teacherForSubject;
          slotItem.subject = subjectToAdd;
          subjectToAdd.periodCountPerWeek--;
        }
      }
    }
  });

  console.log(JSON.stringify(newClassSlots));

  //section wise

  const sectionList: any[] = [];

  newClassSlots.forEach((classItem) => {
    sectionList.push(...classItem.Section);
  });

  return NextResponse.json(sectionList);
}
