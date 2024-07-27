"use client";

import { Subject } from "@/components/admin/classGrade/subject/SubjectCard";
import { SubjectFormDialog } from "@/components/admin/classGrade/subject/SubjectFormDialog";
import { SubjectList } from "@/components/admin/classGrade/subject/SubjectList";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState<boolean>(false);

  async function fetchSubjects() {
    setSubjectsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/classGrades/1/subjects`
        // `/api/admin/classGrades/${classGradeId}/subjects`
      );
      const data = await response.json();
      setSubjects(data);
    } catch (err) {
      toast.error("Something went wrong while searching for subjects");
    } finally {
      setSubjectsLoading(false);
    }
  }

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-6">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>Subjects</CardTitle>
          <CardDescription>You can manage subjects.</CardDescription>
        </div>
        <SubjectFormDialog
          callbackFn={() => fetchSubjects()}
          // classGrade={classGrade!}
          classGrade={{ id: 1, title: "1" }}
        />
      </CardHeader>
      <CardContent>
        {subjectsLoading ? (
          <div>Loading...</div>
        ) : (
          <SubjectList subjects={subjects} />
        )}
      </CardContent>
    </Card>
  );
}
