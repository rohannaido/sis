"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { HoverCardContent } from "@/components/ui/hover-card";
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
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { SubjectCard } from "../subject/SubjectCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";

type Teacher = {
  id: number;
  name: string;
  email: string;
};

export type TimeTableBuilderRef = {
  previewAndSave: () => void;
};

const TimeTableBuilder = forwardRef<TimeTableBuilderRef>((props, ref) => {
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
  const [groupedSlots, setGroupedSlots] = useState<Slots[]>();

  const [togglePreviewAndSaveDialog, setTogglePreviewAndSaveDialog] =
    useState<boolean>(false);

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

  function handlePreviewAndSave() {
    if (timeTable.length === 0) {
      toast({
        variant: "destructive",
        description: "Please add atleast one time table",
      });
      return;
    }

    setTogglePreviewAndSaveDialog(true);
  }

  useImperativeHandle(ref, () => ({
    previewAndSave: () => {
      console.log("REFFF");
      handlePreviewAndSave();
    },
  }));

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

  async function fetchSlotGroup() {
    try {
      const response = await fetch(`/api/admin/slot-groups/1?forFullweek=true`);
      const data = await response.json();
      setSlots(data.Slots);
      const newGroupedSlots = groupSlotsBySlotNumber(data.Slots);
      setGroupedSlots(newGroupedSlots);
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
        const slotsForDay = slots?.filter((slot) => slot.dayOfWeek === day);
        return {
          day: day,
          slots: JSON.parse(JSON.stringify(slotsForDay)),
        };
      });
      const newTimeTable = {
        classGradeId: classGrade.id,
        classGradeName: classGrade.title,
        sectionId: sectionId,
        sectionName: sections.find((section) => section.id === sectionId)?.name,
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

  async function saveTimeTable() {
    if (timeTable.length === 0) {
      toast({
        variant: "destructive",
        description: "Please add atleast one time table",
      });
      return;
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

      console.log("timeTableData", timeTableData);
      await axios.post("/api/admin/time-table", timeTableData);
      toast({
        title: "Saved Time Table!",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        description: err?.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setTogglePreviewAndSaveDialog(false);
    }
  }

  return (
    <div className="flex gap-4">
      <Dialog
        open={togglePreviewAndSaveDialog}
        onOpenChange={setTogglePreviewAndSaveDialog}
      >
        <DialogContent className="sm:max-w-[900px] sm:h-full overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Preview and save</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            {timeTable?.map((timeTableItem) => (
              <Card key={timeTableItem.classGradeId + timeTableItem.sectionId}>
                <CardHeader>
                  Class {timeTableItem.classGradeName} Section{" "}
                  {timeTableItem.sectionName}{" "}
                </CardHeader>
                <CardDescription>
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
                      {groupedSlots?.map((slot) => (
                        <TableRow key={slot.id}>
                          <TableCell>
                            <div>
                              <div>{slot.startTime}</div>
                              <div>{slot.endTime}</div>
                            </div>
                          </TableCell>
                          {weekDays.map((day) => (
                            <TableCell key={day}>
                              <div className="flex flex-col">
                                <div className="text-sm">
                                  {
                                    timeTableItem.dayWiseSlots
                                      .find(
                                        (dayItem: any) => dayItem.day === day
                                      )
                                      .slots.find(
                                        (slotItem: any) =>
                                          slotItem.slotNumber ===
                                          slot.slotNumber
                                      ).subject?.name
                                  }
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {
                                    timeTableItem.dayWiseSlots
                                      .find(
                                        (dayItem: any) => dayItem.day === day
                                      )
                                      .slots.find(
                                        (slotItem: any) =>
                                          slotItem.slotNumber ===
                                          slot.slotNumber
                                      ).teacher?.name
                                  }
                                </div>
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardDescription>
              </Card>
            ))}
          </div>
          <Button onClick={() => saveTimeTable()}>Save</Button>
        </DialogContent>
      </Dialog>
      <div className="w-3/4">
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
                {groupedSlots?.map((slot) => (
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
                                onClick={() =>
                                  handlePeriodClearClick(day, slot)
                                }
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
      <div className="w-1/4">
        <Card>
          <CardHeader>Class subjects</CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableHead>Name</TableHead>
                <TableHead>Weekly periods</TableHead>
                <TableHead>Added periods</TableHead>
              </TableHeader>
              <TableBody>
                {subjects?.map((subjectItem) => (
                  <TableRow key={subjectItem.id}>
                    <TableCell>{subjectItem.name}</TableCell>
                    <TableCell>{subjectItem.periodCountPerWeek}</TableCell>
                    <TableCell>
                      {timeTable[currentTimeTableIndex!]?.dayWiseSlots?.reduce(
                        (acc: any, dayWiseSlotsItem: any) => {
                          dayWiseSlotsItem.slots.forEach((slotItem: any) => {
                            if (slotItem?.subject?.id == subjectItem.id) {
                              acc += 1;
                            }
                          });
                          return acc;
                        },
                        0
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

TimeTableBuilder.displayName = "TimeTableBuilder";

export default TimeTableBuilder;
