"use client";

import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { SubjectContext } from "../layout";
import { Chapter } from "@/components/admin/chapter/ChapterCard";
import ChapterFormDialog from "@/components/admin/chapter/ChapterFormDialog";
import ChapterList from "@/components/admin/chapter/ChapterList";

export default function ChapterPage() {
  const subject = useContext(SubjectContext);
  const [chapters, setChapters] = useState<Chapter[] | null>(null);

  async function fetchChapters() {
    try {
      const response = await fetch(
        `/api/admin/subjects/${subject?.id}/chapters`
      );
      const data = await response.json();
      setChapters(data);
    } catch (err) {
      toast.error("something went wrong fetching chapters!");
    } finally {
    }
  }

  useEffect(() => {
    fetchChapters();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <ChapterFormDialog
          subject={subject!}
          callbackFn={() => fetchChapters()}
        />
      </div>
      {chapters?.length != undefined && chapters?.length > 0 ? (
        <ChapterList chapters={chapters} />
      ) : (
        <div>No data found!</div>
      )}
    </div>
  );
}
