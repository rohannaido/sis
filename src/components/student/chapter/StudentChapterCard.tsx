import { Chapter } from "@prisma/client";
import Link from "next/link";

export default function StudentChapterCard({ chapter }: { chapter: Chapter }) {
  return (
    <Link
      href={`/student/subjects/${chapter.subjectId}/chapters/${chapter.id}`}
    >
      <div
        className={`max-w-sm h-40 flex flex-col justify-between border border-gray-200 bg-white mx-auto w-full shadow dark:border-gray-700 dark:bg-gray-800 rounded-lg`}
      >
        <div></div>
        <div className="py-6 px-4">
          <div>{chapter.name}</div>
        </div>
      </div>
    </Link>
  );
}
