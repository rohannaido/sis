import { DaysOfWeek, timeStringToDate } from "@/lib/utils";
import {
  Section,
  SectionSubjectTeacher,
  Slots,
  Subject,
  TimeTable,
} from "@prisma/client";

export interface TimeTableWithSlots extends TimeTable {
  Slot: Slots;
}

export function generateTimeTableItem(
  slot: Slots,
  section: Section,
  subjectList: Subject[],
  teacherList: {
    TeacherClassGradeSubjectLink: {
      id: number;
      teacherId: number;
      classGradeId: number;
      subjectId: number;
    }[];
    user: {
      id: string;
      name: string | null;
      email: string | null;
      token: string | null;
      password: string | null;
      role: string | null;
    };
    id: number;
  }[],
  sectionTeacherSubjectList: SectionSubjectTeacher[],
  timeTableList: TimeTableWithSlots[]
) {
  let subjectToAdd = getSubjectToAdd(timeTableList, subjectList, slot, section);

  if (!subjectToAdd) {
    return null;
  }

  let newTeacherLink = false;

  let sectionTeacherForSubject = sectionTeacherSubjectList.find(
    (sectionTeacherSubjectItem) =>
      sectionTeacherSubjectItem.subjectId === subjectToAdd.id
  );

  if (!sectionTeacherForSubject) {
    let searchForTeacher = true;
    let teacherForSubject = null;
    while (searchForTeacher && teacherList.length) {
      teacherForSubject = teacherList.find((teacherItem) =>
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

      const teacherTimeTableForToday = getTeacherTimeTableForDay(
        teacherForSubject?.id,
        timeTableList,
        slot.dayOfWeek
      );

      const canTeacherAccomodate = canTeacherAccomodateSlot(
        slot,
        teacherTimeTableForToday
      );

      if (!canTeacherAccomodate) {
        let deleteIndex = 0;
        for (let i = 0; i < teacherList.length; i++) {
          if (teacherForSubject.id == teacherList[i].id) {
            deleteIndex = i;
            break;
          }
        }
        teacherList.splice(deleteIndex, 1);
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
    const teacherTimeTableForToday = getTeacherTimeTableForDay(
      sectionTeacherForSubject.teacherId,
      timeTableList,
      slot.dayOfWeek
    );
    const canTeacherAccomodate = canTeacherAccomodateSlot(
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

export function canTeacherAccomodateSlot(
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

export function getTeacherTimeTableForDay(
  teacherId: number,
  timeTableList: TimeTableWithSlots[],
  dayOfWeek: string
) {
  // check if the teacher is available
  const teacherTimeTableForToday = [];
  for (const timeTableItem of timeTableList) {
    if (
      timeTableItem.teacherId == teacherId &&
      timeTableItem.dayOfWeek === dayOfWeek
    ) {
      teacherTimeTableForToday.push(timeTableItem);
    }
  }

  return teacherTimeTableForToday;
}

export function getSubjectToAdd(
  timeTableList: TimeTableWithSlots[],
  subjectList: Subject[],
  slot: Slots,
  section: Section
) {
  for (const subjectItem of subjectList) {
    const daySubjectCount: { [key: string]: number } = {};
    Object.values(DaysOfWeek).forEach((item) => {
      daySubjectCount[item] = 0;
    });
    for (const timeTableItem of timeTableList) {
      if (
        timeTableItem.subjectId == subjectItem.id &&
        timeTableItem.sectionId == section.id
      ) {
        // if (!daySubjectCount[timeTableItem.dayOfWeek]) {
        //   daySubjectCount[timeTableItem.dayOfWeek] = 0;
        // } else {
        daySubjectCount[timeTableItem.dayOfWeek]++;
        // }
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
      // if lowest is today or today is same as all others
      return subjectItem;
    }
  }

  return null;
}
