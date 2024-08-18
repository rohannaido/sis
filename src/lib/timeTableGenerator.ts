import { DaysOfWeek, timeStringToDate } from "@/lib/utils";
import {
  ClassGrade,
  Section,
  SectionSubjectTeacher,
  Slots,
  SlotsGroup,
  Subject,
  Teacher,
  TeacherClassGradeSubjectLink,
  TimeTable,
  User,
} from "@prisma/client";

export interface TimeTableWithSlots extends TimeTable {
  Slot: Slots;
}

export interface SlotsGroupSlots extends SlotsGroup {
  Slots: Slots[];
}

export interface ClassGradeTimeTable extends ClassGrade {
  SlotsGroup: SlotsGroupSlots | null;
  Section: Section[];
  Subject: Subject[];
}

export interface TeacherTimeTable extends Teacher {
  TeacherClassGradeSubjectLink: TeacherClassGradeSubjectLink[];
  user: User;
}

export class TimeTableGenerator {
  classSlots: ClassGradeTimeTable[];
  teachers: TeacherTimeTable[];
  sectionTeacherSubjects: SectionSubjectTeacher[];
  timeTableList: TimeTableWithSlots[];

  constructor(classSlots: ClassGradeTimeTable[], teachers: TeacherTimeTable[]) {
    this.classSlots = classSlots;
    this.teachers = teachers;
    this.sectionTeacherSubjects = [];
    this.timeTableList = [];
  }

  generate() {
    for (const classItem of this.classSlots) {
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
            const timeTableItem = this.generateTimeTableItem(
              slotItem,
              sectionItem,
              classItem.Subject
            );
            if (timeTableItem) {
              this.timeTableList.push(timeTableItem.timeTableItem);
              if (timeTableItem.newSectionTeacherForSubject) {
                this.sectionTeacherSubjects.push(
                  timeTableItem.newSectionTeacherForSubject
                );
              }
            }
          }
        }
      }
    }

    return this.timeTableList;
  }

  generateTimeTableItem(slot: Slots, section: Section, subjectList: Subject[]) {
    let subjectToAdd = this.getSubjectToAdd(subjectList, slot, section);

    if (!subjectToAdd) {
      return null;
    }

    let newTeacherLink = false;

    let sectionTeacherForSubject = this.sectionTeacherSubjects.find(
      (sectionTeacherSubjectItem) =>
        sectionTeacherSubjectItem.subjectId === subjectToAdd.id
    );

    if (!sectionTeacherForSubject) {
      let searchForTeacher = true;
      let teacherForSubject = null;
      while (searchForTeacher && this.teachers.length) {
        teacherForSubject = this.teachers.find((teacherItem) =>
          teacherItem.TeacherClassGradeSubjectLink.find(
            (teacherClassGradeSubjectItem) =>
              teacherClassGradeSubjectItem.classGradeId ===
                section.classGradeId &&
              subjectToAdd.id === teacherClassGradeSubjectItem.subjectId
          )
        );

        if (!teacherForSubject) {
          throw new Error("Teacher not Found");
        }

        const teacherTimeTableForToday = this.getTeacherTimeTableForDay(
          teacherForSubject?.id,
          slot.dayOfWeek
        );

        const canTeacherAccomodate = this.canTeacherAccomodateSlot(
          slot,
          teacherTimeTableForToday
        );

        if (!canTeacherAccomodate) {
          let deleteIndex = 0;
          for (let i = 0; i < this.teachers.length; i++) {
            if (teacherForSubject.id == this.teachers[i].id) {
              deleteIndex = i;
              break;
            }
          }
          this.teachers.splice(deleteIndex, 1);
        } else {
          searchForTeacher = false;
          newTeacherLink = true;
        }
      }

      sectionTeacherForSubject = {
        id: 0,
        sectionId: section.id,
        teacherId: teacherForSubject?.id!,
        subjectId: subjectToAdd.id,
      };
    } else {
      const teacherTimeTableForToday = this.getTeacherTimeTableForDay(
        sectionTeacherForSubject.teacherId,
        slot.dayOfWeek
      );
      const canTeacherAccomodate = this.canTeacherAccomodateSlot(
        slot,
        teacherTimeTableForToday
      );
      if (!canTeacherAccomodate) {
        return null;
      }
    }

    return {
      timeTableItem: {
        id: 0,
        timeTableGroupId: 0,
        classGradeId: section.classGradeId,
        sectionId: section.id,
        slotsGroupId: slot.slotGroupId!,
        slotsId: slot.id,
        dayOfWeek: slot.dayOfWeek,
        subjectId: subjectToAdd.id,
        teacherId: sectionTeacherForSubject.teacherId,
        Slot: slot,
      },
      newSectionTeacherForSubject: newTeacherLink
        ? sectionTeacherForSubject
        : null,
    };
  }

  canTeacherAccomodateSlot(
    slot: Slots,
    teacherTimeTableForToday: TimeTableWithSlots[]
  ) {
    const slotStartTime = timeStringToDate(slot.startTime);
    const slotEndTime = timeStringToDate(slot.endTime);

    for (const teacherSlot of teacherTimeTableForToday) {
      const teacherSlotStartTime = timeStringToDate(teacherSlot.Slot.startTime);
      const teacherSlotEndTime = timeStringToDate(teacherSlot.Slot.endTime);
      if (
        (slotStartTime < teacherSlotEndTime &&
          slotStartTime >= teacherSlotStartTime) ||
        (slotEndTime > teacherSlotStartTime &&
          slotEndTime <= teacherSlotEndTime) ||
        (slotStartTime <= teacherSlotStartTime &&
          slotEndTime >= teacherSlotEndTime)
      ) {
        return false;
      }
    }

    return true;
  }

  getTeacherTimeTableForDay(teacherId: number, dayOfWeek: string) {
    const teacherTimeTableForToday = [];
    for (const timeTableItem of this.timeTableList) {
      if (
        timeTableItem.teacherId == teacherId &&
        timeTableItem.dayOfWeek === dayOfWeek
      ) {
        teacherTimeTableForToday.push(timeTableItem);
      }
    }

    return teacherTimeTableForToday;
  }

  getSubjectToAdd(subjectList: Subject[], slot: Slots, section: Section) {
    for (const subjectItem of subjectList) {
      const daySubjectCount: { [key: string]: number } = {};
      Object.values(DaysOfWeek).forEach((item) => {
        daySubjectCount[item] = 0;
      });
      for (const timeTableItem of this.timeTableList) {
        if (
          timeTableItem.subjectId == subjectItem.id &&
          timeTableItem.sectionId == section.id
        ) {
          daySubjectCount[timeTableItem.dayOfWeek]++;
        }
      }

      if (
        Object.values(daySubjectCount).reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0) === subjectItem.periodCountPerWeek
      ) {
        continue;
      }

      if (
        daySubjectCount[slot.dayOfWeek] <=
        Math.min(...Object.values(daySubjectCount))
      ) {
        return subjectItem;
      }
    }

    return null;
  }
}
