"use client";

import TimeTableCardList from "@/components/admin/time-table/TimeTableCardList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

export default function TimeTableListPage() {
  const [sectionTimeTableList, setSectionTimeTableList] = useState([]);
  async function fetchGenerateTimeTable() {
    try {
      const res = await fetch("/api/admin/time-table");
      const data = await res.json();
      setSectionTimeTableList(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
    }
  }

  function handleGenerateTimeTableClick() {
    fetchGenerateTimeTable();
  }

  return (
    <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-10">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>Time table</CardTitle>
          <CardDescription>
            You can generate and manage time tables here.
          </CardDescription>
        </div>
        <Button onClick={handleGenerateTimeTableClick} variant="default">
          Generate Time table
        </Button>
      </CardHeader>
      <CardContent>
        <TimeTableCardList sectionTimeTableList={sectionTimeTableList} />
      </CardContent>
    </Card>
  );
}
