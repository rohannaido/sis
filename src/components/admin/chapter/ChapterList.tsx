"use client";

import { toast } from "sonner";
import { Subject } from "../subject/SubjectCard";
import { useEffect, useState } from "react";
import ChapterCard, { Chapter } from "./ChapterCard";

export default function ChapterList({ chapters }: { chapters: Chapter[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {chapters?.map((chapter) => (
        <ChapterCard key={chapter.id} chapter={chapter} />
      ))}
    </div>
  );
}
