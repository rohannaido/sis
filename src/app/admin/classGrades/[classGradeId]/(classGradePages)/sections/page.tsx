"use client";

import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Section } from "@/components/admin/section/SectionCard";
import { SectionFormDialog } from "@/components/admin/section/SectionFormDialog";
import { SectionList } from "@/components/admin/section/SectionList";
import { ClassGradeContext } from "@/contexts";

export default function SectionsPage() {
  const classGrade = useContext(ClassGradeContext);
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState<boolean>(false);

  async function fetchSections() {
    setSectionsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/classGrades/${classGrade?.id}/sections`
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
    fetchSections();
  }, []);

  return (
    <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-10">
      <CardHeader className="flex flex-row justify-between">
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
  );
}
