"use client";

import { Chapter } from "@/components/admin/chapter/ChapterCard";
import { ChapterContent } from "@/components/admin/chapterContent/ChapterContentCard";
import ChapterContentDialog from "@/components/admin/chapterContent/ChapterContentDialog";
import ChapterContentList from "@/components/admin/chapterContent/ChapterContentList";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Params = {
  subjectId: string;
  chapterId: string;
};

export default function ChapterDetailPage({ params }: { params: Params }) {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [chapterContents, setChapterContents] = useState<
    ChapterContent[] | null
  >(null);

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

  async function fetchChapterContent() {
    try {
      const response = await fetch(
        `/api/admin/subjects/${params.subjectId}/chapters/${params.chapterId}/chapterContents`
      );
      const data = await response.json();
      setChapterContents(data);
    } catch (err) {
      toast.error("Something went wrong fetch chapter contents");
    } finally {
    }
  }

  useEffect(() => {
    fetchChapter();
    fetchChapterContent();
  }, []);

  return (
    <>
      {chapter ? (
        <>
          <div className="flex justify-between items-center">
            <div className="text-xl">{chapter?.name}</div>
            <ChapterContentDialog chapterId={chapter?.id} />
          </div>
          {chapterContents ? (
            <ChapterContentList chapterContents={chapterContents} />
          ) : (
            <div>Loading chapter contents...</div>
          )}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
