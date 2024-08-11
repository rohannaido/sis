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
      <CardHeader className="py-2">{timeTable.name}</CardHeader>
      <CardContent>
        <div
          //     grid-cols-${
          //     Object.keys(timeTable.DailySlots).length + 1
          //   } grid-rows-${timeSlots.length + 1}
          className={`grid
            grid-cols-7 grid-rows-4 
           gap-2`}
        >
          <div>Timings</div>
          {Object.keys(timeTable.DailySlots).map((item) => (
            <div key={item}>{item}</div>
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
                  <div key={item.slotNumber}>{dayItem?.subject?.name}</div>
                ))}
              </>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
