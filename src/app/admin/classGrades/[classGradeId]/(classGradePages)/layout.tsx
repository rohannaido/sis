"use client";

import React, { useContext, useEffect, useState } from "react";
import ClassGradeNav from "@/components/admin/classGrade/ClassGradeNav";
import { ClassGradeContext } from "@/contexts";

export default function ClassGradePages({
  children,
  params,
}: {
  children: React.ReactNode;
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
