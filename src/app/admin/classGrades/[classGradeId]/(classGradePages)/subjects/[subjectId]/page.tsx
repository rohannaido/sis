"use client";

import ChapterList from "@/components/admin/chapter/ChapterList";
import { Subject } from "@/components/admin/subject/SubjectCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import SubjectNav from "@/components/admin/subject/SubjectNav";
import ChapterPage from "./chapters/page";
import { SubjectContext } from "@/contexts";

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
      <ChapterPage />
    </>
  );
}
