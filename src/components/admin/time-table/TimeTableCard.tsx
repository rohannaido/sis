import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Slots, TimeTable } from "@prisma/client";
import { SectionWithTimeTable } from "./TimeTableCardList";
import { Key } from "react";

export default function TimeTableCard({
  sectionItem,
  slotsList,
}: {
  sectionItem: SectionWithTimeTable;
  slotsList: Slots[];
}) {
  const dayOfWeek: any = {};

  let slotsPerDay = [];
  const slotsMap: {
    [key: string]: Slots;
  } = {};

  slotsList.forEach((slotsItem) => {
    slotsMap[slotsItem.slotNumber] = slotsItem;
    if (!dayOfWeek[slotsItem.dayOfWeek]) {
      dayOfWeek[slotsItem.dayOfWeek] = [];
    }
    dayOfWeek[slotsItem.dayOfWeek].push(slotsItem);
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

  const timeTableMap: any = {};
  sectionItem.TimeTable.forEach((timeTableItem) => {
    if (!timeTableMap[timeTableItem.dayOfWeek]) {
      timeTableMap[timeTableItem.dayOfWeek] = {};
    }
    timeTableMap[timeTableItem.dayOfWeek][timeTableItem.slots.slotNumber] =
      timeTableItem;
  });

  return (
    <Card>
      <CardHeader className="py-2">Section {sectionItem.name}</CardHeader>
      <CardContent>
        <div className="flex">
          <div>
            <div className="p-2">Timings</div>
            {slotsPerDay.map((slotItem) => (
              <div className="p-2 border-2 w-full " key={slotItem.slotNumber}>
                <div>{slotItem.startTime}</div>
                <div>{slotItem.endTime}</div>
              </div>
            ))}
          </div>
          {Object.keys(dayOfWeek).map((dayItem) => (
            <div key={dayItem} className="flex flex-col flex-1 items-center">
              <div className="p-2">{dayItem}</div>
              {dayOfWeek[dayItem].map(
                (slotItem: { slotNumber: Key | null | undefined }) => (
                  <div
                    key={slotItem.slotNumber}
                    className="flex-1 border-2 w-full"
                  >
                    <div
                      className="flex flex-col justify-center items-center w-full h-full"
                      draggable="true"
                    >
                      {timeTableMap[dayItem]?.[
                        parseInt(slotItem.slotNumber?.toString() || "0")
                      ] ? (
                        <>
                          <div>
                            {
                              timeTableMap[dayItem]?.[
                                parseInt(slotItem.slotNumber?.toString() || "0")
                              ]?.subject?.name
                            }
                          </div>
                          <div>
                            (
                            {
                              timeTableMap[dayItem]?.[
                                parseInt(slotItem.slotNumber?.toString() || "0")
                              ]?.teacher?.user?.name
                            }
                            )
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
