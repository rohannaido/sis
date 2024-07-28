"use client";

import { useContext, useEffect, useState } from "react";
import ClassGradeNav from "@/components/admin/classGrade/ClassGradeNav";
import SubjectsPage from "./(classGradePages)/subjects/page";
import { ClassGradeContext } from "./layout";

export default function ClassGradeIdPage({
  params,
}: {
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
      <SubjectsPage />
    </>
  );
}
