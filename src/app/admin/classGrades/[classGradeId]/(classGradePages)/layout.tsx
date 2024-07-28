"use client";

import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { ClassGrade } from "@/components/admin/classGrade/ClassGradeCard";
import ClassGradeNav from "@/components/admin/classGrade/ClassGradeNav";
import { ClassGradeContext } from "../layout";

export default function ClassGradePages({
  children,
  params,
}: {
  children: { children: React.ReactNode };
  params: { classGradeId: string };
}) {
  const classGrade = useContext(ClassGradeContext);
  const classGradeId = parseInt(params.classGradeId);

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
