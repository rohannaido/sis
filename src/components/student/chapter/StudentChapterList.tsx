import { Chapter } from "@prisma/client";
import StudentChapterCard from "./StudentChapterCard";

export default function StudentChapterList({
  chapters,
}: {
  chapters: Chapter[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {chapters.map((chapterItem) => (
        <StudentChapterCard key={chapterItem.id} chapter={chapterItem} />
      ))}
    </div>
  );
}
