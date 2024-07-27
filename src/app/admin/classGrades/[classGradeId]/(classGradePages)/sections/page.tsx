"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Section } from "@/components/admin/classGrade/section/SectionCard";
import { SectionFormDialog } from "@/components/admin/classGrade/section/SectionFormDialog";
import { SectionList } from "@/components/admin/classGrade/section/SectionList";

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState<boolean>(false);

  async function fetchSections() {
    setSectionsLoading(true);
    try {
      const response = await fetch(`/api/admin/classGrades/${1}/sections`);
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
        <div className="flex flex-col gap-2">
          <CardTitle>Sections</CardTitle>
          <CardDescription>You can manage Sections.</CardDescription>
        </div>
        <SectionFormDialog
          callbackFn={() => fetchSections()}
          classGrade={{ id: 1, title: "1" }}
          // classGrade={classGrade!}
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
