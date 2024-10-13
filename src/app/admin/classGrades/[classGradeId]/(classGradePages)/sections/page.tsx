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
        <div className="flex flex-col gap-2">
          <CardTitle>Sections</CardTitle>
          <CardDescription>You can manage sections.</CardDescription>
        </div>
        {sections.length > 0 && (
          <SectionFormDialog
            callbackFn={() => fetchSections()}
            classGrade={classGrade!}
          />
        )}
      </CardHeader>
      <CardContent>
        {sectionsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sections...</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sections found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new section.</p>
            <div className="mt-6">
              <SectionFormDialog callbackFn={fetchSections} classGrade={classGrade!} />
            </div>
          </div>
        ) : (
          <SectionList sections={sections} />
        )}
      </CardContent>
    </Card>
  );
}
