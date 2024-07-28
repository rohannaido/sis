import { ClassGradeContext } from "@/app/admin/classGrades/[classGradeId]/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useContext } from "react";

export type Subject = {
  id: number;
  classId: number;
  name: string;
};

export const SubjectCard = ({ subject }: { subject: Subject }) => {
  const classGrade = useContext(ClassGradeContext);

  return (
    <div
      className={`max-w-sm border border-gray-200 bg-white mx-auto w-full shadow dark:border-gray-700 dark:bg-gray-800 rounded-lg`}
    >
      <div className="py-6 px-4 flex justify-between items-center">
        <div>{subject.name}</div>
        <div>
          <Link
            href={`/admin/classGrades/${classGrade?.id}/subjects/${subject.id}`}
          >
            <Button>View</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
