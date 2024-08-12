import { NewSection, newSlot } from "@/app/api/admin/time-table/route";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function TimeTableCard({
  timeTable,
}: {
  timeTable: NewSection;
}) {
  const timeSlots = timeTable.DailySlots[Object.keys(timeTable.DailySlots)[0]];
  return (
    <Card>
      <CardHeader className="py-2">Section {timeTable.name}</CardHeader>
      <CardContent>
        <div
          className={`grid
            grid-cols-7 grid-rows-4
            gap-2`}
        >
          <div>Timings</div>
          {Object.keys(timeTable.DailySlots).map((item) => (
            <div key={item} className="flex flex-col items-center">
              {item}
            </div>
          ))}
          {timeSlots.map((item) => {
            const daysSlotArray: (newSlot | undefined)[] = [];
            Object.keys(timeTable.DailySlots).forEach((dayOfWeek) => {
              const slotDetail = timeTable.DailySlots[dayOfWeek].find(
                (slotItem) => slotItem.slotNumber == item.slotNumber
              );
              daysSlotArray.push(slotDetail);
            });

            return (
              <>
                <div key={item.slotNumber}>
                  {item.startTime} - {item.endTime}
                </div>
                {daysSlotArray.map((dayItem) => (
                  <div
                    key={item.slotNumber}
                    className="flex flex-col items-center"
                  >
                    <div>{dayItem?.subject?.name}</div>
                    {dayItem?.teacher?.user.name ? (
                      <div className="">({dayItem?.teacher?.user.name})</div>
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
              </>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
