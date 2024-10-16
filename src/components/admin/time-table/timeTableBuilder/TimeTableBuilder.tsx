"use client";
import { Slots } from "@prisma/client";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import TimeTableCell from "./TimeTableCell";
import ClassSubjectDetail from "./ClassSubjectDetail";
import TimeTablePreview from "./TimeTablePreview";
import TimeTableBuilderForm from "./TimeTableBuilderForm";
import { useTimeTableData } from "./useTimeTableData";

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

    const {
      slotGroup,
      setSlotGroup,
      slotGroups,

      classGrade,
      setClassGrade,
      classGrades,

      section,
      setSection,
      sections,

      subject,
      setSubject,
      subjects,

      teacher,
      setTeacher,
      teachers,

      slots,
      groupedSlots,

      weekDays,
      timeTable,
      currentTimeTableIndex,
      teacherTimeTable,

      assignSubjectAndTeacherToSlot,
      clearSubjectAndTeacherFromSlot,
      saveTimeTable,
    } = useTimeTableData(props.type, props.timeTableId);

    const [togglePreviewAndSaveDialog, setTogglePreviewAndSaveDialog] = useState<boolean>(false);

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

    function handlePeriodClick(day: string, slot: Slots) {
      if (!subject || !teacher) {
        toast({
          variant: "destructive",
          description: "Please select a subject and teacher",
        });
        return;
      }

      assignSubjectAndTeacherToSlot(day, slot);
    }

    function handlePeriodClearClick(day: string, slot: Slots) {
      clearSubjectAndTeacherFromSlot(day, slot);
    }

    async function saveTimeTableAfterPreview() {
      await saveTimeTable();
    }

    return (
      <div className="flex gap-4">
        <TimeTablePreview
          open={togglePreviewAndSaveDialog}
          onOpenChange={setTogglePreviewAndSaveDialog}
          timeTable={timeTable}
          weekDays={weekDays}
          groupedSlots={groupedSlots || []}
          onSave={saveTimeTableAfterPreview}
        />
        <div className="w-3/4">
          <TimeTableBuilderForm
            slotGroup={slotGroup}
            setSlotGroup={setSlotGroup}
            slotGroups={slotGroups}

            classGrade={classGrade}
            setClassGrade={setClassGrade}
            classGrades={classGrades}

            section={section}
            setSection={setSection}
            sections={sections}

            subject={subject}
            setSubject={setSubject}
            subjects={subjects}

            teacher={teacher}
            setTeacher={setTeacher}
            teachers={teachers}
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
