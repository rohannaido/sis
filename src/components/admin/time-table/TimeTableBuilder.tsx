"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  ClassGrade,
  Section,
  Slots,
  SlotsGroup,
  Subject,
  User,
} from "@prisma/client";
import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";

type Teacher = {
  id: number;
  name: string;
  email: string;
};

export default function TimeTableBuilder() {
  const { toast } = useToast();

  const [classGrades, setClassGrades] = useState<ClassGrade[]>([]);
  const [classGrade, setClassGrade] = useState<ClassGrade>();

  const [sections, setSections] = useState<Section[]>([]);
  const [section, setSection] = useState<Section>();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subject, setSubject] = useState<Subject>();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacher, setTeacher] = useState<Teacher>();

  const [slots, setSlots] = useState<Slots[]>();

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [timeTable, setTimeTable] = useState<any[]>([]);
  const [currentTimeTableIndex, setCurrentTimeTableIndex] = useState<number>();

  const [teacherTimeTable, setTeacherTimeTable] = useState<any[]>([]);

  useEffect(() => {
    fetchClassGrades();
    fetchSlotGroup();
  }, []);

  async function fetchSlotGroup() {
    try {
      const response = await fetch(`/api/admin/slot-groups/1`);
      const data = await response.json();
      setSlots(data.Slots);
    } catch (err) {
      toast({
        description: "Something went wrong while searching for slot groups",
      });
    } finally {
    }
  }

  async function fetchClassGrades() {
    try {
      const response = await fetch(`/api/admin/classGrades`);
      const data = await response.json();
      setClassGrades(data);
    } catch (err) {
      toast({
        description: "Something went wrong while searching for classes",
      });
    } finally {
    }
  }

  async function fetchSectionsForClassGrade(classGradeId: number) {
    setSections([]);
    try {
      const response = await fetch(
        `/api/admin/classGrades/${classGradeId}/sections`
      );
      const data = await response.json();
      setSections(data);
    } catch (err) {
      toast({
        description: "Something went wrong while searching for sections",
      });
    } finally {
    }
  }

  async function fetchSubjectsForClassGrade(classGradeId: number) {
    try {
      const response = await fetch(
        `/api/admin/classGrades/${classGradeId}/subjects`
      );
      const data = await response.json();
      setSubjects(data);
    } catch (err) {
      toast({
        description: "Something went wrong while searching for subjects",
      });
    } finally {
    }
  }

  async function fetchTeachersForSubject(subjectId: number) {
    try {
      const response = await fetch(
        `/api/admin/teachers?classGradeId=${classGrade?.id}&subjectId=${subjectId}`
      );
      const data = await response.json();
      setTeachers(data);
    } catch (err) {
      toast({
        description: "Something went wrong while searching for teachers",
      });
    } finally {
    }
  }

  function handleClassGradeChange(value: string) {
    const classGradeId = parseInt(value);
    setClassGrade(
      classGrades.find((classGrade) => classGrade.id === classGradeId)
    );
    setSection(undefined);
    setSubject(undefined);
    setTeacher(undefined);
    fetchSectionsForClassGrade(classGradeId);
    fetchSubjectsForClassGrade(classGradeId);
  }

  function handleSectionChange(value: string) {
    const sectionId = parseInt(value);
    setSection(sections.find((section) => section.id === sectionId));
    setTeacher(undefined);
    fetchCurrentTimeTableForSection(sectionId);
  }

  function handleSubjectChange(value: string) {
    const subjectId = parseInt(value);
    setSubject(subjects.find((subject) => subject.id === subjectId));
    setTeacher(undefined);
    fetchTeachersForSubject(subjectId);
  }

  function handleTeacherChange(value: string) {
    const teacherId = parseInt(value);
    setTeacher(teachers.find((teacher) => teacher.id === teacherId));
  }

  function fetchCurrentTimeTableForSection(sectionId: number) {
    if (classGrade && sectionId) {
      const existingTimeTableIndex = timeTable.findIndex(
        (timeTable) =>
          timeTable.sectionId === sectionId &&
          timeTable.classGradeId === classGrade.id
      );
      if (existingTimeTableIndex >= 0) {
        console.log("existingTimeTableIndex > ", existingTimeTableIndex);
        setCurrentTimeTableIndex(existingTimeTableIndex);
        return;
      }

      console.log("NEW TIMETABLE");
      const dayWiseSlots = weekDays.map((day) => {
        return {
          day: day,
          slots: JSON.parse(JSON.stringify(slots)),
        };
      });
      const newTimeTable = {
        classGradeId: classGrade.id,
        sectionId: sectionId,
        dayWiseSlots: dayWiseSlots,
      };
      setTimeTable([...timeTable, newTimeTable]);
      setCurrentTimeTableIndex(timeTable.length);
      console.log("NEW TIMETABLE SET", newTimeTable);
    }
  }

  function handlePeriodClick(day: string, slot: Slots) {
    if (!subject || !teacher) {
      toast({
        variant: "destructive",
        description: "Please select a subject and teacher",
      });
      return;
    }

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
    generateTeacherTimeTable(newTimeTable);
    console.log("timeTable", newTimeTable);
  }

  function handlePeriodClearClick(day: string, slot: Slots) {
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

    console.log(newDaySlots, "newDaySlots");

    newTimeTable[currentTimeTableIndex!].dayWiseSlots.find(
      (dayItem: any) => dayItem.day === day
    ).slots = newDaySlots.slots;

    resetAndGenerateTeacherTimeTable(newTimeTable);
    setTimeTable(newTimeTable);
  }

  function generateTeacherTimeTable(timeTable: any[], action: string = "add") {
    let newTeacherTimeTable = [...teacherTimeTable];
    if (action === "reset") {
      newTeacherTimeTable = [];
    }

    timeTable.forEach((timeTableItem) => {
      timeTableItem.dayWiseSlots.forEach((slotsForDay: any) => {
        slotsForDay.slots.forEach((slot: any) => {
          if (!slot?.subject || !slot?.teacher) {
            return;
          }

          console.log("slot", slot);

          let teacherItem = newTeacherTimeTable.find(
            (teacherTimeTableItem) =>
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
  }

  function resetAndGenerateTeacherTimeTable(timeTable: any[]) {
    generateTeacherTimeTable(timeTable, "reset");
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label htmlFor="classGrade">Class</Label>
          <Select
            value={classGrade?.id?.toString() || ""}
            onValueChange={handleClassGradeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {classGrades?.map((classGrade) => (
                  <SelectItem
                    key={classGrade.id}
                    value={classGrade.id.toString()}
                  >
                    {classGrade.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="section">Section</Label>
          <Select
            value={section?.id?.toString() || ""}
            onValueChange={handleSectionChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {sections?.map((section) => (
                  <SelectItem key={section.id} value={section.id.toString()}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Select
            value={subject?.id?.toString() || ""}
            onValueChange={handleSubjectChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {subjects?.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="teacher">Teacher</Label>
          <Select
            value={teacher?.id?.toString() || ""}
            onValueChange={handleTeacherChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select teacher" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {teachers?.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id.toString()}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {currentTimeTableIndex !== undefined && currentTimeTableIndex >= 0 && (
        <div className="my-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                {weekDays?.map((day) => (
                  <TableHead key={day}>{day}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {slots?.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>
                    <div>
                      <div>{slot.startTime}</div>
                      <div>{slot.endTime}</div>
                    </div>
                  </TableCell>
                  {weekDays.map((day) => (
                    <TableCell
                      key={day}
                      className={cn(
                        timeTable[currentTimeTableIndex].dayWiseSlots
                          .find((dayItem: any) => dayItem.day === day)
                          .slots.find(
                            (slotItem: any) =>
                              slotItem.slotNumber === slot.slotNumber
                          ).subject?.name || slot.type === "Break"
                          ? ""
                          : teacherTimeTable
                              ?.find(
                                (teacherItem: any) =>
                                  teacherItem.teacherId == teacher?.id
                              )
                              ?.dayWiseSlots?.find(
                                (dayItem: any) => dayItem.day === day
                              )
                              ?.slots?.find(
                                (slotItem: any) =>
                                  slotItem.slotNumber === slot.slotNumber
                              )?.isAllocated
                          ? "bg-stripes-dark"
                          : "hover:bg-muted cursor-pointer"
                      )}
                      onClick={
                        teacherTimeTable
                          ?.find(
                            (teacherItem: any) =>
                              teacherItem.teacherId == teacher?.id
                          )
                          ?.dayWiseSlots?.find(
                            (dayItem: any) => dayItem.day === day
                          )
                          ?.slots?.find(
                            (slotItem: any) =>
                              slotItem.slotNumber === slot.slotNumber
                          )?.isAllocated ||
                        timeTable[currentTimeTableIndex].dayWiseSlots
                          .find((dayItem: any) => dayItem.day === day)
                          .slots.find(
                            (slotItem: any) =>
                              slotItem.slotNumber === slot.slotNumber
                          ).subject?.name ||
                        slot.type === "Break"
                          ? undefined
                          : () => handlePeriodClick(day, slot)
                      }
                    >
                      {slot.type === "Break" ? (
                        <div>-</div>
                      ) : timeTable[currentTimeTableIndex].dayWiseSlots
                          .find((dayItem: any) => dayItem.day === day)
                          .slots.find(
                            (slotItem: any) =>
                              slotItem.slotNumber === slot.slotNumber
                          ).subject?.name ? (
                        <div className="flex items-center justify-between gap-2 px-2">
                          <div className="flex flex-col">
                            <div className="text-sm">
                              {
                                timeTable[currentTimeTableIndex].dayWiseSlots
                                  .find((dayItem: any) => dayItem.day === day)
                                  .slots.find(
                                    (slotItem: any) =>
                                      slotItem.slotNumber === slot.slotNumber
                                  ).subject?.name
                              }
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {
                                timeTable[currentTimeTableIndex].dayWiseSlots
                                  .find((dayItem: any) => dayItem.day === day)
                                  .slots.find(
                                    (slotItem: any) =>
                                      slotItem.slotNumber === slot.slotNumber
                                  ).teacher?.name
                              }
                            </div>
                          </div>
                          <div>
                            <Button
                              variant="ghost"
                              className="p-2"
                              onClick={() => handlePeriodClearClick(day, slot)}
                            >
                              <CircleX />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
