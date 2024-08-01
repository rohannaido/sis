"use client";

import { ClassGrade } from "@/components/admin/classGrade/ClassGradeCard";
import { ClassGradeContext } from "@/contexts";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ClassGradeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
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
    <div className="mx-auto max-w-screen-xl justify-between p-2 text-black dark:text-white">
      <ClassGradeContext.Provider value={classGrade}>
        {children}
      </ClassGradeContext.Provider>
    </div>
  );
}
