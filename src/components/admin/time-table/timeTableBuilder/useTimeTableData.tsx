import { useState, useEffect } from 'react';
import { fetchSlotGroups, fetchClassGrades, fetchSectionsForClassGrade, fetchSubjectsForClassGrade, fetchTeachersForSubject, fetchSlotGroupDetails, fetchTimeTable, createTimeTable, updateTimeTable } from './api';
import { ClassGrade, Section, Slots, SlotsGroup, Subject, Teacher } from '@prisma/client';

const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export function useTimeTableData(type: string | undefined, timeTableId: string | undefined) {
    const [slotGroups, setSlotGroups] = useState<SlotsGroup[]>([]);
    const [slotGroup, setSlotGroup] = useState<SlotsGroup>();

    const [classGrades, setClassGrades] = useState<ClassGrade[]>([]);
    const [classGrade, setClassGrade] = useState<ClassGrade>();

    const [sections, setSections] = useState<Section[]>([]);
    const [section, setSection] = useState<Section>();

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [subject, setSubject] = useState<Subject>();

    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [teacher, setTeacher] = useState<Teacher>();

    const [slots, setSlots] = useState<Slots[]>();
    const [groupedSlots, setGroupedSlots] = useState<Slots[]>();

    const [timeTable, setTimeTable] = useState<any[]>([]);
    const [currentTimeTableIndex, setCurrentTimeTableIndex] = useState<number>();
    const [teacherTimeTable, setTeacherTimeTable] = useState<any[]>([]);

    useEffect(() => {
        if (type === "EDIT" && timeTableId) {
            fetchTimeTable(parseInt(timeTableId)).then((timeTableData) => {
                setSlotGroup(timeTableData.slotsGroup);
                setSlots(timeTableData.slotsGroup.Slots);
                const newGroupedSlots = groupSlotsBySlotNumber(
                    timeTableData.slotsGroup.Slots
                );
                setGroupedSlots(newGroupedSlots);
                parseTimeTableForEdit(
                    timeTableData.TimeTable,
                    timeTableData.slotsGroup.Slots
                );
            });
        }
    }, [type, timeTableId]);

    useEffect(() => {
        fetchSlotGroups().then(setSlotGroups);
        fetchClassGrades().then(setClassGrades);
    }, []);

    useEffect(() => {
        if (slotGroup) {
            fetchSlotGroupDetails(slotGroup.id).then((data: any) => {
                setSlots(data.Slots);
                const newGroupedSlots = groupSlotsBySlotNumber(data.Slots);
                setGroupedSlots(newGroupedSlots);
            });
        }
    }, [slotGroup]);

    useEffect(() => {
        if (classGrade) {
            setSection(undefined);
            setSubject(undefined);
            setTeacher(undefined);
            fetchSectionsForClassGrade(classGrade?.id).then(setSections);
            fetchSubjectsForClassGrade(classGrade?.id).then(setSubjects);
        }
    }, [classGrade]);

    useEffect(() => {
        if (section) {
            setTeacher(undefined);
            fetchCurrentTimeTableForSection();
        }
    }, [section]);

    useEffect(() => {
        if (subject && classGrade) {
            setTeacher(undefined);
            fetchTeachersForSubject(classGrade?.id, subject?.id).then(setTeachers);
        }
    }, [subject]);

    useEffect(() => {
        console.log("timeTable", timeTable);
        generateTeacherTimeTable();
    }, [timeTable]);

    function groupSlotsBySlotNumber(slots: any[]): any[] {
        return Object.values(
            slots.reduce((acc, slot) => {
                if (!acc[slot.slotNumber]) {
                    acc[slot.slotNumber] = slot;
                }
                return acc;
            }, {})
        );
    }

    function fetchCurrentTimeTableForSection() {
        if (classGrade && section) {
            const existingTimeTableIndex = timeTable.findIndex(
                (timeTable) =>
                    timeTable.sectionId === section.id &&
                    timeTable.classGradeId === classGrade.id
            );
            if (existingTimeTableIndex >= 0) {
                setCurrentTimeTableIndex(existingTimeTableIndex);
                return;
            }

            const dayWiseSlots = weekDays.map((day) => {
                const slotsForDay = slots?.filter((slot) => slot.dayOfWeek === day);
                return {
                    day: day,
                    slots: JSON.parse(JSON.stringify(slotsForDay)),
                };
            });
            const newTimeTable = {
                classGradeId: classGrade.id,
                classGradeName: classGrade.title,
                sectionId: section.id,
                sectionName: sections.find((section) => section.id === section.id)
                    ?.name,
                dayWiseSlots: dayWiseSlots,
            };
            setTimeTable([...timeTable, newTimeTable]);
            setCurrentTimeTableIndex(timeTable.length);
        }
    }

    function generateTeacherTimeTable() {
        let newTeacherTimeTable: any = [];

        timeTable.forEach((timeTableItem) => {
            timeTableItem.dayWiseSlots.forEach((slotsForDay: any) => {
                slotsForDay.slots.forEach((slot: any) => {
                    if (!slot?.subject || !slot?.teacher) {
                        return;
                    }

                    let teacherItem = newTeacherTimeTable.find(
                        (teacherTimeTableItem: any) =>
                            teacherTimeTableItem.teacherId === slot.teacher?.id
                    );

                    if (!teacherItem) {
                        teacherItem = {
                            teacherId: slot.teacher?.id,
                            dayWiseSlots: weekDays.map((day) => {
                                return {
                                    day: day,
                                    slots: JSON.parse(JSON.stringify(slots)),
                                };
                            }),
                        };
                        newTeacherTimeTable.push(teacherItem);
                    }

                    const daySlotsForTeacher = teacherItem.dayWiseSlots.find(
                        (dayWiseSlotsForTeacherItem: { day: any }) =>
                            dayWiseSlotsForTeacherItem.day === slotsForDay.day
                    );

                    const newSlots = daySlotsForTeacher.slots.map((slotItem: any) => {
                        if (slotItem.slotNumber === slot.slotNumber) {
                            slotItem.subject = subject;
                            slotItem.teacher = teacher;
                            slotItem.isAllocated = true;
                        }
                        return slotItem;
                    });

                    daySlotsForTeacher.slots = newSlots;
                    teacherItem.dayWiseSlots = teacherItem.dayWiseSlots.map(
                        (dayWiseSlotsForTeacherItem: any) => {
                            if (dayWiseSlotsForTeacherItem.day === slotsForDay.day) {
                                dayWiseSlotsForTeacherItem.slots = newSlots;
                            }
                            return dayWiseSlotsForTeacherItem;
                        }
                    );
                });
            });
        });
        setTeacherTimeTable(newTeacherTimeTable);
        console.log("newTeacherTimeTable", newTeacherTimeTable);
    }

    function assignSubjectAndTeacherToSlot(day: string, slot: Slots) {
        const newTimeTable = [...timeTable];
        const daySlots = newTimeTable[currentTimeTableIndex!].dayWiseSlots.find(
            (dayItem: any) => dayItem.day === day
        );

        const newDaySlots = {
            ...daySlots,
            slots: daySlots.slots.map((slotItem: any) => {
                if (slotItem.slotNumber === slot.slotNumber) {
                    slotItem.subject = subject;
                    slotItem.teacher = teacher;
                }
                return slotItem;
            }),
        };

        newTimeTable[currentTimeTableIndex!].dayWiseSlots.find(
            (dayItem: any) => dayItem.day === day
        ).slots = newDaySlots.slots;

        setTimeTable(newTimeTable);
    }

    function clearSubjectAndTeacherFromSlot(day: string, slot: Slots) {
        const newTimeTable = [...timeTable];
        const daySlots = newTimeTable[currentTimeTableIndex!].dayWiseSlots.find(
            (dayItem: any) => dayItem.day === day
        );

        const newDaySlots = {
            ...daySlots,
            slots: daySlots.slots.map((slotItem: any) => {
                if (slotItem.slotNumber === slot.slotNumber) {
                    slotItem.subject = null;
                    slotItem.teacher = null;
                }
                return slotItem;
            }),
        };

        newTimeTable[currentTimeTableIndex!].dayWiseSlots.find(
            (dayItem: any) => dayItem.day === day
        ).slots = newDaySlots.slots;

        setTimeTable(newTimeTable);
    }

    function parseTimeTableForEdit(timeTableData: any[], slots: Slots[]) {
        const newTimeTable: any[] = [];
        timeTableData.forEach((timeTableItem) => {
            let sectionTimeTable = newTimeTable.find(
                (item: any) =>
                    timeTableItem.classGradeId === item.classGradeId &&
                    timeTableItem.sectionId === item.sectionId
            );

            if (!sectionTimeTable) {
                const dayWiseSlots = weekDays.map((day) => {
                    const slotsForDay = slots?.filter((slot) => slot.dayOfWeek === day);
                    return {
                        day: day,
                        slots: JSON.parse(JSON.stringify(slotsForDay)),
                    };
                });

                sectionTimeTable = {
                    classGradeId: timeTableItem.classGradeId,
                    classGradeName: timeTableItem.classGrade.title,
                    sectionId: timeTableItem.sectionId,
                    sectionName: timeTableItem.section.name,
                    dayWiseSlots: dayWiseSlots,
                };

                newTimeTable.push(sectionTimeTable);
            }

            let daySlots = sectionTimeTable.dayWiseSlots.find(
                (dayWiseSlotItem: any) =>
                    timeTableItem.dayOfWeek === dayWiseSlotItem.day
            ).slots;

            daySlots = daySlots.map((slotItem: any) => {
                if (slotItem.slotNumber === timeTableItem.slots.slotNumber) {
                    const newTeacher = {
                        id: timeTableItem.teacher.id,
                        email: timeTableItem.teacher.user.email,
                        name: timeTableItem.teacher.user.name,
                    };
                    slotItem.subject = timeTableItem.subject;
                    slotItem.teacher = newTeacher;
                }
                return slotItem;
            });
        });

        setTimeTable(newTimeTable);
    }

    async function saveTimeTable() {
        if (timeTable.length === 0) {
            throw new Error("Please add atleast one time table");
        }

        try {
            let timeTableData: any[] = [];
            timeTable.forEach((timeTableItem) => {
                timeTableItem.dayWiseSlots.forEach((dayWiseSlots: any) => {
                    dayWiseSlots.slots.forEach((slot: any) => {
                        if (slot?.subject && slot?.teacher) {
                            timeTableData.push({
                                classGradeId: timeTableItem.classGradeId,
                                sectionId: timeTableItem.sectionId,
                                dayOfWeek: dayWiseSlots.day,
                                slotsId: slot.id,
                                slotsGroupId: slot.slotGroupId,
                                subjectId: slot?.subject?.id,
                                teacherId: slot?.teacher?.id,
                            });
                        }
                    });
                });
            });

            if (timeTableId && type === "EDIT") {
                await updateTimeTable(parseInt(timeTableId), {
                    timeTable: timeTableData,
                    slotsGroupId: slotGroup?.id,
                });
            } else {
                await createTimeTable({
                    timeTable: timeTableData,
                    slotsGroupId: slotGroup?.id,
                });
            }
        } catch (err: any) {
            throw new Error(err?.response?.data?.message || "Something went wrong!");
        }
    }

    return {
        timeTable,
        currentTimeTableIndex,
        teacherTimeTable,
        slotGroups,
        slotGroup,
        setSlotGroup,
        classGrades,
        classGrade,
        setClassGrade,
        sections,
        section,
        setSection,
        subjects,
        subject,
        setSubject,
        teachers,
        teacher,
        setTeacher,
        slots,
        groupedSlots,
        weekDays,
        assignSubjectAndTeacherToSlot,
        clearSubjectAndTeacherFromSlot,
        saveTimeTable,
    };
}

