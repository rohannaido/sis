import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type Subject = {
  id: number;
  classId: number;
  name: string;
};

export const SubjectCard = ({ subject }: { subject: Subject }) => {
  const router = useRouter();

  function handleClasseViewClick(id: number) {
    // router.push(`/admin/classes/${id}`);
  }

  return (
    <div
      className={`max-w-sm border border-gray-200 bg-white mx-auto w-full shadow dark:border-gray-700 dark:bg-gray-800 rounded-lg`}
    >
      <div className="py-6 px-4 flex justify-between items-center">
        <div>{subject.name}</div>
        <div>
          <Button onClick={() => handleClasseViewClick(subject.id)}>
            View
          </Button>
        </div>
      </div>
    </div>
  );
};
