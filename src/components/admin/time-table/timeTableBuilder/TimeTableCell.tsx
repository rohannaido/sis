import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CircleX, Lock, X } from "lucide-react";
import { useTimeTableContexts } from "./TimeTableSelectionContexts";

export default function TimeTableCell({
    timeTable,
    currentTimeTableIndex,
    day,
    slot,
    teacherTimeTable,
    handlePeriodClick,
    handlePeriodClearClick,
    handlePeriodDrop,
    draggable,
}: {
    timeTable: any;
    currentTimeTableIndex: number;
    day: string;
    slot: any;
    teacherTimeTable: any;
    handlePeriodClick: (day: string, slot: any) => void;
    handlePeriodClearClick: (day: string, slot: any) => void;
    handlePeriodDrop: (pickedSlotDetails: any, day: string, slot: any) => void;
    draggable: boolean;
}) {
    const { teacher, setShowPeriodAddGuide } = useTimeTableContexts();

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

    const getTeacherSlotDetails = (teacherId: number, day: string, slotNumber: number) => {
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
    const teacherSlotDetails = teacher ? getTeacherSlotDetails(teacher?.id, day, slot.slotNumber) : null;

    if (slot.type === "Break") {
        return <TableCell className="text-center">-</TableCell>;
    }

    if (slotDetails?.subject?.name) {
        return (
            <TableCell className="p-1 relative">
                <div
                    onMouseEnter={() => setShowPeriodAddGuide(false)}
                    onMouseLeave={() => setShowPeriodAddGuide(true)}
                    draggable={draggable}
                    onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', JSON.stringify(slotDetails));
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    className="relative cursor-grab flex flex-col p-2 pt-4 bg-card rounded-md shadow-sm hover:bg-accent transition-colors overflow-hidden">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 z-10 rounded-none rounded-tr-md"
                        onClick={() => handlePeriodClearClick(day, slot)}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                    <div className="text-sm font-medium text-foreground">
                        {slotDetails?.subject?.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {slotDetails?.teacher?.name}
                    </div>
                </div>
            </TableCell>
        );
    } else if (teacherSlotDetails?.isAllocated) {
        return (
            <TableCell className="p-1">
                <div className="h-10 flex items-center justify-between gap-2 p-2 bg-muted rounded-md cursor-not-allowed">
                    <div className="flex items-center">
                        <Lock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-xs text-muted-foreground">Assigned</span>
                    </div>
                </div>
            </TableCell>
        );
    }

    return (
        <TableCell
            className={cn("hover:bg-muted cursor-pointer")}
            onClick={() => handlePeriodClick(day, slot)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault();
                let data = JSON.parse(e.dataTransfer.getData('text'));
                handlePeriodDrop(data, day, slot);
            }}
        >
        </TableCell>
    );
}
