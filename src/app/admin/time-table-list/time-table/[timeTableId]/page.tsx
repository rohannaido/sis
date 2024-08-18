"use client";

import TimeTableForm from "@/components/admin/time-table/TimeTableForm";

export default function TimeTablePage({
  params,
}: {
  params: {
    timeTableId: string;
  };
}) {
  return <TimeTableForm type="EDIT" timeTableId={params.timeTableId} />;
}
