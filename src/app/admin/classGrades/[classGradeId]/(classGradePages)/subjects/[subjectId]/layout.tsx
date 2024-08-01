"use client";

import { Subject } from "@/components/admin/subject/SubjectCard";
import SubjectNav from "@/components/admin/subject/SubjectNav";
import { SubjectContext } from "@/contexts";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SubjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    subjectId: string;
    classGradeId: string;
  };
}) {
  const [subject, setSubject] = useState<Subject | null>(null);

  async function fetchSubject() {
    try {
      const response = await fetch(`/api/admin/subjects/${params.subjectId}`);
      const data = await response.json();
      setSubject(data);
    } catch (e) {
      toast.error("Something went wrong while searching for subject");
    } finally {
    }
  }

  useEffect(() => {
    fetchSubject();
  }, []);

  return (
    <>
      <SubjectContext.Provider value={subject}>
        <div className="font-bold md:text-xl lg:text-xl">{subject?.name}</div>
        {subject ? (
          <div className="flex mt-4">
            <div className="w-3/12 mr-4">
              <SubjectNav subjectId={subject?.id}></SubjectNav>
            </div>
            <div className="w-full">{children}</div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </SubjectContext.Provider>
    </>
  );
}
