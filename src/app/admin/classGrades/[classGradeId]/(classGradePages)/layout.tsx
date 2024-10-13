"use client";

import React, { useContext, useEffect, useState } from "react";
import ClassGradeNav from "@/components/admin/classGrade/ClassGradeNav";
import { ClassGradeContext } from "@/contexts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/classGrades">Classes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Class {classGrade?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
