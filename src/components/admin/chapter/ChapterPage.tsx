"use client";

import { toast } from "sonner";
import { Subject } from "../subject/SubjectCard";
import ChapterFormDialog from "./ChapterFormDialog";
import ChapterList from "./ChapterList";
import { useCallback, useEffect, useState } from "react";
import { Chapter } from "./ChapterCard";

export default function ChapterPage({ subject }: { subject: Subject }) {
  const [chapters, setChapters] = useState<Chapter[] | null>(null);

  const fetchChapters = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/admin/subjects/${subject.id}/chapters`
      );
      const data = await response.json();
      setChapters(data);
    } catch (err) {
      toast.error("something went wrong fetching chapters!");
    } finally {
    }
  }, [subject.id]);

  useEffect(() => {
    fetchChapters();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <ChapterFormDialog subject={subject} callbackFn={fetchChapters} />
      </div>
      {chapters?.length != undefined && chapters?.length > 0 ? (
        <ChapterList chapters={chapters} />
      ) : (
        <div>No data found!</div>
      )}
    </div>
  );
}
