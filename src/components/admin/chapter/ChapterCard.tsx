import { Button } from "@/components/ui/button";
import { ClassGradeContext, SubjectContext } from "@/contexts";
import Link from "next/link";
import { useContext } from "react";

export type Chapter = {
  id: number;
  name: string;
};

export default function ChapterCard({ chapter }: { chapter: Chapter }) {
  const classGrade = useContext(ClassGradeContext);
  const subject = useContext(SubjectContext);

  return (
    <div
      className={`max-w-sm border border-gray-200 bg-white mx-auto w-full shadow dark:border-gray-700 dark:bg-gray-800 rounded-lg`}
    >
      <div className="py-6 px-4 flex justify-between items-center">
        <div>{chapter.name}</div>
        <div>
          <Link
            href={`/admin/classGrades/${classGrade?.id}/subjects/${subject?.id}/chapters/${chapter.id}`}
          >
            <Button>View</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
