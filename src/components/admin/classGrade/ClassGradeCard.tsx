import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type ClassGrade = {
  id: number;
  title: string;
};

export const ClassGradeCard = ({ classGrade }: { classGrade: ClassGrade }) => {
  const router = useRouter();

  function handleClassGradeViewClick(id: number) {
    router.push(`/admin/classGrades/${id}`);
  }

  return (
    <div
      className={`max-w-sm border border-gray-200 bg-white mx-auto w-full shadow dark:border-gray-700 dark:bg-gray-800 rounded-lg`}
    >
      <div className="py-6 px-4 flex justify-between items-center">
        <div>Class {classGrade.title}</div>
        <div>
          <Button onClick={() => handleClassGradeViewClick(classGrade.id)}>
            View
          </Button>
        </div>
      </div>
    </div>
  );
};
