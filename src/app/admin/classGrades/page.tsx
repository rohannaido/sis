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
        {classGrades.length > 0 && (
          <ClassGradeFormDialog callbackFn={() => fetchClasses()} existingClasses={classGrades} />
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading classes...</p>
          </div>
        ) : classGrades.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No classes found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new class.</p>
            <div className="mt-6">
              <ClassGradeFormDialog callbackFn={fetchClasses} existingClasses={classGrades} />
            </div>
          </div>
        ) : (
          <ClassGradeList
            classGrades={classGrades}
            callbackFn={fetchClasses}
          />
        )}
      </CardContent>
    </Card>
  );
}
