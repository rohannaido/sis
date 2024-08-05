"use client";

import { useContext, useEffect, useState } from "react";
import { SubjectContext } from "@/contexts";
import StudentsPage from "./students/page";

export default function SubjectDetailPage({
  params,
}: {
  params: {
    subjectId: string;
    classGradeId: string;
  };
}) {
  const subject = useContext(SubjectContext);

  return (
    <>
      <StudentsPage />
    </>
  );
}
