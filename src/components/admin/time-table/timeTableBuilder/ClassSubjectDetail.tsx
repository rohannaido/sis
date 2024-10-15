import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Subject } from "@prisma/client";

export default function ClassSubjectDetail({
    subjects,
    timeTable,
    currentTimeTableIndex,
}: {
    subjects: Subject[];
    timeTable: any;
    currentTimeTableIndex: any;
}) {
    return <Card>
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
                                {timeTable[
                                    currentTimeTableIndex!
                                ]?.dayWiseSlots?.reduce(
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
    </Card>;
}