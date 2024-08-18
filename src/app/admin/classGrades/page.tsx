"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ClassGradeFormDialog } from "@/components/admin/classGrade/ClassGradeFormDialog";
import { ClassGradeList } from "@/components/admin/classGrade/ClassGradesList";
import { useEffect, useState } from "react";
import { ClassGrade } from "@prisma/client";
import { toast } from "sonner";

export default function ClassGrades() {
  const [classGrades, setClassGrades] = useState<ClassGrade[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchClasses() {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/classGrades`);
      const data = await response.json();
      setClassGrades(data);
    } catch (err) {
      toast.error("Something went wrong while searching for classes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-10">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>Class</CardTitle>
          <CardDescription>You can manage classes.</CardDescription>
        </div>
        <ClassGradeFormDialog callbackFn={() => fetchClasses()} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ClassGradeList classGrades={classGrades} />
        )}
      </CardContent>
    </Card>
  );
}
