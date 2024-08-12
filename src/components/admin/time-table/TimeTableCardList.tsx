import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TimeTableCard from "./TimeTableCard";
import { NewSection } from "@/app/api/admin/time-table/route";

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
              {classTimeTableItem.Section.map((sectionItem: NewSection) => (
                <TimeTableCard key={index} timeTable={sectionItem} />
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
