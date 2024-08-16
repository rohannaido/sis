import { NewSection, newSlot } from "@/app/api/admin/time-table/route1";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Slots, TimeTable } from "@prisma/client";
import { SectionWithTimeTable } from "./TimeTableCardList";

export default function TimeTableCard({
  sectionItem,
  slotsList,
}: {
  sectionItem: SectionWithTimeTable;
  slotsList: Slots[];
}) {
  const dayOfWeek = new Set<string>();

  let slotsPerDay = [];
  const slotsMap: {
    [key: string]: Slots;
  } = {};
  slotsList.forEach((slotsItem) => {
    slotsMap[slotsItem.slotNumber] = slotsItem;
    dayOfWeek.add(slotsItem.dayOfWeek);
  });
  slotsPerDay = Object.values(slotsMap).map((item) => {
    let startTimeSplit = item.startTime.split(":");
    startTimeSplit.splice(2, 1);
    let startTime = startTimeSplit.join(":");

    let endTimeSplit = item.endTime.split(":");
    endTimeSplit.splice(2, 1);
    let endTime = endTimeSplit.join(":");

    return {
      slotNumber: item.slotNumber,
      startTime,
      endTime,
    };
  });

  return (
    <Card>
      <CardHeader className="py-2">Section {sectionItem.name}</CardHeader>
      <CardContent>
        <div>
          <div className="p-2 flex justify-between w-full border-2 rounded-xl">
            Timings
            {Array.from(dayOfWeek).map((dayItem, index) => (
              <div key={index}>{dayItem}</div>
            ))}
          </div>
          {slotsPerDay.map((slotItem) => (
            <div className="p-2 flex" key={slotItem.slotNumber}>
              <div className="flex flex-col">
                <div>{slotItem.startTime}</div>
                <div>{slotItem.endTime}</div>
              </div>
              <div>test</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
