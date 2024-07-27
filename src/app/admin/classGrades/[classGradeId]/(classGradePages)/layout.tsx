"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ClassGrade } from "@/components/admin/classGrade/ClassGradeCard";
import ClassGradeNav from "@/components/admin/classGrade/ClassGradeNav";

export default function ClassGradePages({
  children,
  params,
}: {
  children: { children: React.ReactNode };
  params: { classGradeId: string };
}) {
  const classGradeId = parseInt(params.classGradeId);

  const [classGrade, setClassGrade] = useState<ClassGrade | null>(null);

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
  useEffect(() => {
    fetchClassGrade();
  }, []);

  return (
    <>
      <div className="flex justify-between my-4">
        <div className="font-bold md:text-2xl lg:text-3xl">
          Class {classGrade?.title}
        </div>
      </div>
      <ClassGradeNav classGradeId={classGradeId} />
      {children}
    </>
  );
}
