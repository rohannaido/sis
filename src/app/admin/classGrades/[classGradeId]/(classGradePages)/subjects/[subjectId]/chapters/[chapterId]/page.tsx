"use client";

import { Chapter } from "@/components/admin/chapter/ChapterCard";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Params = {
  subjectId: string;
  chapterId: string;
};

export default function ChapterDetailPage({ params }: { params: Params }) {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  async function fetchChapter() {
    try {
      const response = await fetch(
        `/api/admin/subjects/${params.subjectId}/chapters/${params.chapterId}`
      );
      const data = await response.json();
      setChapter(data);
    } catch (err) {
      toast.error("Something went wrong fetch chapter detail");
    } finally {
    }
  }

  useEffect(() => {
    fetchChapter();
  }, []);

  return (
    <>
      <div>Name: {chapter?.name}</div>
    </>
  );
}
