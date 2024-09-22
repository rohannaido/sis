import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TimeTableCard from "./TimeTableCard";
import { Section, Slots, TimeTable } from "@prisma/client";

// make a type using a type and add a new property
export type TimeTableWithSlots = TimeTable & { slots: Slots };

export interface SectionWithTimeTable extends Section {
  TimeTable: TimeTableWithSlots[];
}

export default function TimeTableCardList({
  classTimeTableList,
}: {
  classTimeTableList: any[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {classTimeTableList.map((classTimeTableItem, index) => (
        <div key={index}>
          <Card>
            <CardHeader>Class {classTimeTableItem.title}</CardHeader>
            <CardContent className="flex flex-col gap-4">
              {classTimeTableItem.Section.map(
                (sectionItem: SectionWithTimeTable) => (
                  <TimeTableCard
                    key={index}
                    sectionItem={sectionItem}
                    slotsList={classTimeTableItem.SlotsGroup.Slots}
                  />
                )
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
