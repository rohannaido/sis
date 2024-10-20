import React from 'react';
import {
    Card,
    CardHeader,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Slots } from '@prisma/client';
import { Loader2 } from 'lucide-react';

interface TimeTablePreviewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    timeTable: any[];
    weekDays: string[];
    groupedSlots: Slots[];
    onSave: () => void;
    isSaving: boolean;
}

const TimeTablePreview: React.FC<TimeTablePreviewProps> = ({
    open,
    onOpenChange,
    timeTable,
    weekDays,
    groupedSlots,
    onSave,
    isSaving,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                                                            <div className="text-primary">
                                                                {
                                                                    timeTableItem.dayWiseSlots
                                                                        .find((dayItem: any) => dayItem.day === day)
                                                                        .slots.find(
                                                                            (slotItem: any) =>
                                                                                slotItem.slotNumber === slot.slotNumber
                                                                        ).subject?.name
                                                                }
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {
                                                                    timeTableItem.dayWiseSlots
                                                                        .find((dayItem: any) => dayItem.day === day)
                                                                        .slots.find(
                                                                            (slotItem: any) =>
                                                                                slotItem.slotNumber === slot.slotNumber
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
                <Button onClick={onSave} disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save'
                    )}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default TimeTablePreview;

