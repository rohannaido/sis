import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CircleX } from "lucide-react";

export default function TimeTableCell({
    timeTable,
    currentTimeTableIndex,
    day,
    slot,
    teacherTimeTable,
    teacher,
    handlePeriodClick,
    handlePeriodClearClick,
}: {
    timeTable: any;
    currentTimeTableIndex: number;
    day: string;
    slot: any;
    teacherTimeTable: any;
    teacher: any | null;
    handlePeriodClick: (day: string, slot: any) => void;
    handlePeriodClearClick: (day: string, slot: any) => void;
}) {
    const getSlotDetails = (day: string, slotNumber: number) => {
        const daySlot = timeTable[currentTimeTableIndex].dayWiseSlots.find(
            (dayItem: any) => dayItem.day === day
        );

        if (!daySlot) return null;

        const slotDetails = daySlot.slots.find(
            (slotItem: any) => slotItem.slotNumber === slotNumber
        );

        return slotDetails;
    };

    const getTeacherSlotDetails = (teacherId: string, day: string, slotNumber: number) => {
        const teacherSlot = teacherTimeTable.find(
            (teacherItem: any) => teacherItem.teacherId === teacherId
        );

        if (!teacherSlot) return null;

        const daySlot = teacherSlot.dayWiseSlots.find(
            (dayItem: any) => dayItem.day === day
        );

        if (!daySlot) return null;

        const slotDetails = daySlot.slots.find(
            (slotItem: any) => slotItem.slotNumber === slotNumber
        );

        return slotDetails;
    };

    const slotDetails = getSlotDetails(day, slot.slotNumber);
    const teacherSlotDetails = teacher ? getTeacherSlotDetails(teacher.id, day, slot.slotNumber) : null;

    if (slot.type === "Break") {
        return <TableCell className="text-center">-</TableCell>;
    }

    if (slotDetails?.subject?.name) {
        return <TableCell>
            <div className="flex items-center justify-between gap-2 px-2">
                <div className="flex flex-col">
                    <div className="text-sm">
                        {slotDetails?.subject?.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {slotDetails?.teacher?.name}
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
        </TableCell>
    } else if (teacherSlotDetails?.isAllocated) {
        return (
            <TableCell className="bg-stripes-dark">
            </TableCell>)
    }

    return (
        <TableCell
            className={cn("hover:bg-muted cursor-pointer")}
            onClick={() => handlePeriodClick(day, slot)}
        >
        </TableCell>
    );
}
