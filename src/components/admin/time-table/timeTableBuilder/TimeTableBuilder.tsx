"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
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
import { CircleX, PlusCircle } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { string } from "zod";
import SlotGroupPage from "../SlotGroupPage";
import TimeTableCell from "./TimeTableCell";
import ClassSubjectDetail from "./ClassSubjectDetail";
import TimeTablePreview from "./TimeTablePreview";
import TimeTableBuilderForm from "./TimeTableBuilderForm";

type Teacher = {
  id: number;
  name: string;
  email: string;
};

export type TimeTableBuilderRef = {
  previewAndSave: () => void;
};

interface TimeTableBuilderProps {
  type?: string;
  timeTableId?: string;
}

const TimeTableBuilder = forwardRef<TimeTableBuilderRef, TimeTableBuilderProps>(
  (
    props: {
      type?: string;
      timeTableId?: string;
    },
    ref
  ) => {
    const { toast } = useToast();

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

    const [togglePreviewAndSaveDialog, setTogglePreviewAndSaveDialog] =
      useState<boolean>(false);

    const [slotGroupDialogOpen, setSlotGroupDialogOpen] =
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
    const [currentTimeTableIndex, setCurrentTimeTableIndex] =
      useState<number>();

    const [teacherTimeTable, setTeacherTimeTable] = useState<any[]>([]);

    useEffect(() => {
      fetchSlotGroups();
      fetchClassGrades();
    }, []);

    useEffect(() => {
      if (props.type === "EDIT" && props.timeTableId) {
        fetchTimeTable().then((timeTableData) => {
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
    }, [props.type, props.timeTableId]);

    async function fetchTimeTable() {
      try {
        const response = await axios.get(
          `/api/admin/time-table/${props.timeTableId}`
        );
        return response.data;
      } catch (err: any) {
        toast({
          variant: "destructive",
          description: err?.response?.data?.message || "Something went wrong!",
        });
      }
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

      generateTeacherTimeTable(newTimeTable, "edit", slots);
      setTimeTable(newTimeTable);
    }

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

    async function fetchSlotGroups() {
      try {
        const response = await fetch(`/api/admin/slot-groups`);
        const data = await response.json();
        setSlotGroups(data);
      } catch (err) {
        toast({
          description: "Something went wrong while searching for slot groups",
        });
      } finally {
      }
    }

    async function fetchSlotGroup(slotGroupId: number) {
      try {
        const response = await fetch(
          `/api/admin/slot-groups/${slotGroupId}?forFullweek=true`
        );
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

    function handleSlotGroupChange(value: string) {
      const slotGroupId = parseInt(value);
      setSlotGroup(
        slotGroups.find((slotGroup) => slotGroup.id === slotGroupId)
      );
      fetchSlotGroup(slotGroupId);
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
          sectionName: sections.find((section) => section.id === sectionId)
            ?.name,
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

      newTimeTable[currentTimeTableIndex!].dayWiseSlots.find(
        (dayItem: any) => dayItem.day === day
      ).slots = newDaySlots.slots;

      resetAndGenerateTeacherTimeTable(newTimeTable);
      setTimeTable(newTimeTable);
    }

    function generateTeacherTimeTable(
      timeTable: any[],
      action: string = "add",
      slots: Slots[] = []
    ) {
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

        if (props.timeTableId && props.type === "EDIT") {
          await axios.put(
            `/api/admin/time-table/${props.timeTableId}`,
            {
              timeTable: timeTableData,
              slotsGroupId: slotGroup?.id,
            }
          );
        } else {
          await axios.post("/api/admin/time-table", {
            timeTable: timeTableData,
            slotsGroupId: slotGroup?.id,
          });
        }
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
        <TimeTablePreview
          open={togglePreviewAndSaveDialog}
          onOpenChange={setTogglePreviewAndSaveDialog}
          timeTable={timeTable}
          weekDays={weekDays}
          groupedSlots={groupedSlots || []}
          onSave={saveTimeTable}
        />
        <div className="w-3/4">
          <TimeTableBuilderForm
            slotGroup={slotGroup}
            slotGroups={slotGroups}
            classGrade={classGrade}
            classGrades={classGrades}
            section={section}
            sections={sections}
            subject={subject}
            subjects={subjects}
            teacher={teacher}
            teachers={teachers}
            handleSlotGroupChange={handleSlotGroupChange}
            handleClassGradeChange={handleClassGradeChange}
            handleSectionChange={handleSectionChange}
            handleSubjectChange={handleSubjectChange}
            handleTeacherChange={handleTeacherChange}
            timeTableLength={timeTable.length}
          />
          {currentTimeTableIndex !== undefined &&
            currentTimeTableIndex >= 0 && (
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
                          <TimeTableCell
                            key={day}
                            timeTable={timeTable}
                            currentTimeTableIndex={currentTimeTableIndex}
                            day={day}
                            slot={slot}
                            teacherTimeTable={teacherTimeTable}
                            teacher={teacher}
                            handlePeriodClick={handlePeriodClick}
                            handlePeriodClearClick={handlePeriodClearClick}
                          />
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
        </div>
        <div className="w-1/4">
          <ClassSubjectDetail
            subjects={subjects}
            timeTable={timeTable}
            currentTimeTableIndex={currentTimeTableIndex}
          />
        </div>
      </div>
    );
  }
);

TimeTableBuilder.displayName = "TimeTableBuilder";

export default TimeTableBuilder;
