import { Button } from "@/components/ui/button";
import { ClassGradeContext } from "@/contexts";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export type Section = {
  id: number;
  name: string;
};

export const SectionCard = ({ section }: { section: Section }) => {
  const router = useRouter();

  const classGrade = useContext(ClassGradeContext);

  function handleClasseViewClick(id: number) {
    router.push(`/admin/classGrades/${classGrade?.id}/sections/${id}`);
  }

  return (
    <div
      className={`max-w-sm border border-gray-200 bg-white mx-auto w-full shadow dark:border-gray-700 dark:bg-gray-800 rounded-lg`}
    >
      <div className="py-6 px-4 flex justify-between items-center">
        <div>{section.name}</div>
        <div>
          <Button onClick={() => handleClasseViewClick(section.id)}>
            View
          </Button>
        </div>
      </div>
    </div>
  );
};
