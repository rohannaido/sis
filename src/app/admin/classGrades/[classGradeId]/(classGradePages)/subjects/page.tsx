"use client";

import { Subject } from "@/components/admin/subject/SubjectCard";
import { SubjectFormDialog } from "@/components/admin/subject/SubjectFormDialog";
import { SubjectList } from "@/components/admin/subject/SubjectList";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClassGradeContext } from "@/contexts";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState<boolean>(false);
  const classGrade = useContext(ClassGradeContext);

  async function fetchSubjects() {
    setSubjectsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/classGrades/${classGrade?.id}/subjects`
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
    if (classGrade) {
      fetchSubjects();
    }
  }, [classGrade]);

  return (
    <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-6">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>Subjects</CardTitle>
          <CardDescription>You can manage subjects.</CardDescription>
        </div>
        <SubjectFormDialog
          callbackFn={() => fetchSubjects()}
          classGrade={classGrade!}
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
