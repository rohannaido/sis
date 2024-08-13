"use client";

import { ClassGrade } from "@/components/admin/classGrade/ClassGradeCard";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ClassGradeSubjectTimeTableForm from "@/components/admin/time-table/ClassGradeSubjectTimeTableForm";

export default function ClassSubjectsPage() {
  const [classGradeList, setClassGradeList] = useState<ClassGrade[]>([]);
  const [classGradeId, setClassGradeId] = useState<number | null>(null);

  async function fetchClasses() {
    try {
      const response = await fetch(`/api/admin/classGrades`);
      const data = await response.json();
      setClassGradeList(data);
    } catch (err) {
      toast.error("Something went wrong while searching for class grades");
    } finally {
    }
  }

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-10">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>Class Subjects</CardTitle>
          <CardDescription>
            You can manage class subjects for time table.
          </CardDescription>
        </div>
      </CardHeader>
      <div className="px-6 pb-6">
        <Label>Class </Label>
        <Select
          value={classGradeId?.toString()}
          onValueChange={(e) => setClassGradeId(parseInt(e))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {classGradeList?.map((classGradeItem) => (
                <SelectItem
                  key={classGradeItem.id}
                  value={classGradeItem.id.toString()}
                >
                  {classGradeItem.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="px-6 pb-6">
        {classGradeId ? (
          <ClassGradeSubjectTimeTableForm classGradeId={classGradeId} />
        ) : (
          <></>
        )}
      </div>
    </Card>
  );
}
