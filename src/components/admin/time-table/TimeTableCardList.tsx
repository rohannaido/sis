import TimeTableCard from "./TimeTableCard";

export default function TimeTableCardList({
  sectionTimeTableList,
}: {
  sectionTimeTableList: any[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {sectionTimeTableList.map((sectionTimeTableItem, index) => (
        <TimeTableCard key={index} timeTable={sectionTimeTableItem} />
      ))}
    </div>
  );
}
