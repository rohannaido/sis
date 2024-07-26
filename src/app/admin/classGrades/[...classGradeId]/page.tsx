"use client";

import { ClassGrade } from "@/components/admin/classGrade/ClassGradeCard";
import { Section } from "@/components/admin/classGrade/section/SectionCard";
import { SectionFormDialog } from "@/components/admin/classGrade/section/SectionFormDialog";
import { SectionList } from "@/components/admin/classGrade/section/SectionList";
import { Subject } from "@/components/admin/classGrade/subject/SubjectCard";
import { SubjectFormDialog } from "@/components/admin/classGrade/subject/SubjectFormDialog";
import { SubjectList } from "@/components/admin/classGrade/subject/SubjectList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ClassePage({
  params,
}: {
  params: { classGradeId: string[] };
}) {
  const classGradeId = params.classGradeId[0];

  const [classGrade, setClassGrade] = useState<ClassGrade | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sections, setSections] = useState<Section[]>([]);

  const [subjectsLoading, setSubjectsLoading] = useState<boolean>(false);
  const [sectionsLoading, setSectionsLoading] = useState<boolean>(false);

  async function fetchClassGrade() {
    try {
      const response = await fetch(`/api/admin/classGrades/${classGradeId}`);
      const data = await response.json();
      setClassGrade(data);
    } catch (err) {
      toast.error("Something went wrong while searching for class");
    } finally {
    }
  }

  async function fetchSubjects() {
    setSubjectsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/classGrades/${classGradeId}/subjects`
      );
      const data = await response.json();
      setSubjects(data);
    } catch (err) {
      toast.error("Something went wrong while searching for subjects");
    } finally {
      setSubjectsLoading(false);
    }
  }

  async function fetchSections() {
    setSectionsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/classGrades/${classGradeId}/sections`
      );
      const data = await response.json();
      setSections(data);
    } catch (err) {
      toast.error("Something went wrong while searching for sections");
    } finally {
      setSectionsLoading(false);
    }
  }

  useEffect(() => {
    fetchClassGrade();
    fetchSubjects();
    fetchSections();
  }, []);

  return (
    <div className="mx-auto max-w-screen-xl justify-between p-4 text-black dark:text-white">
      <div className="flex justify-between">
        <div className="font-bold md:text-2xl lg:text-3xl">
          Class {classGrade?.title}
        </div>
        <Button className="bg-red-500 text-white">Delete</Button>
      </div>
      <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-10">
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
      <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-10">
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Sections</CardTitle>
            <CardDescription>You can manage Sections.</CardDescription>
          </div>
          <SectionFormDialog
            callbackFn={() => fetchSections()}
            classGrade={classGrade!}
          />
        </CardHeader>
        <CardContent>
          {sectionsLoading ? (
            <div>Loading...</div>
          ) : (
            <SectionList sections={sections} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
