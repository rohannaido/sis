"use client";
import { Slots } from "@prisma/client";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
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
import { useTimeTableContexts } from "./TimeTableSelectionContexts";

export type TimeTableBuilderRef = {
  previewAndSave: () => void;
};

export interface TimeTableBuilderProps {
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

    const { subject, teacher } = useTimeTableContexts();

    const {
      slotGroups,
      isSlotGroupsLoading,
      classGrades,
      isClassGradesLoading,
      sections,
      isSectionsLoading,
      subjects,
      isSubjectsLoading,
      teachers,
      isTeachersLoading,
      slots,
      groupedSlots,
      weekDays,
      timeTable,
      isTimeTableLoading,
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

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const divRef = useRef<HTMLDivElement>(null);

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
      if (subject && teacher) {
        const divRect = divRef.current?.getBoundingClientRect();
        if (divRect) {
          const divX = divRect.left;
          const divY = divRect.top;
          const divWidth = divRect.width;
          const divHeight = divRect.height;

          const isInsideDiv = (
            e.clientX >= divX &&
            e.clientX <= divX + divWidth &&
            e.clientY >= divY &&
            e.clientY <= divY + divHeight
          );

          if (isInsideDiv) {
            setMousePos({ x: e.clientX - divX, y: e.clientY - divY });
          }
        }
      }
    }

    return (
      <div
        className="flex gap-4 relative"
      >
        <TimeTablePreview
          open={togglePreviewAndSaveDialog}
          onOpenChange={setTogglePreviewAndSaveDialog}
          timeTable={timeTable}
          weekDays={weekDays}
          groupedSlots={groupedSlots || []}
          onSave={saveTimeTableAfterPreview}
        />
        <div className="w-3/4" onMouseMove={handleMouseMove} ref={divRef}>
          {subject && teacher && (
            <div
              style={{
                top: mousePos.y,
                left: mousePos.x,
                pointerEvents: 'none',
              }}
              className="absolute min-w-[130px] z-50 flex flex-col p-2 pt-4 bg-card rounded-md shadow-sm hover:bg-accent transition-colors overflow-hidden">
              <div className="text-sm font-medium text-foreground">
                {subject?.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {teacher?.name}
              </div>
            </div>
          )}
          <TimeTableBuilderForm
            slotGroups={slotGroups}
            isSlotGroupsLoading={isSlotGroupsLoading}
            classGrades={classGrades}
            isClassGradesLoading={isClassGradesLoading}
            sections={sections}
            isSectionsLoading={isSectionsLoading}
            subjects={subjects}
            isSubjectsLoading={isSubjectsLoading}
            teachers={teachers}
            isTeachersLoading={isTeachersLoading}
            timeTableLength={timeTable.length}
          />
          {currentTimeTableIndex !== undefined &&
            currentTimeTableIndex >= 0 && (
              <div className="my-6">
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Day</TableHead>
                      {weekDays?.map((day) => (
                        <TableHead key={day} className="w-1/7">{day}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedSlots?.map((slot) => (
                      <TableRow key={slot.id}>
                        <TableCell className="w-24">
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
                            handlePeriodClick={handlePeriodClick}
                            handlePeriodClearClick={handlePeriodClearClick}
                            draggable={true}
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
