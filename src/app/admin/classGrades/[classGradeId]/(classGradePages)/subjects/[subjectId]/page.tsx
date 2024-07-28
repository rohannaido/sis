"use client";

import ChapterList from "@/components/admin/chapter/ChapterList";
import { Subject } from "@/components/admin/subject/SubjectCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { SubjectContext } from "./layout";
import SubjectNav from "@/components/admin/subject/SubjectNav";
import ChapterPage from "./chapters/page";

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
