import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type Class = {
  id: number;
  title: string;
};

export const ClasseCard = ({ class }: { class: Class }) => {
  const router = useRouter();

  function handleClasseViewClick(id: number) {
    router.push(`/admin/classes/${id}`);
  }

  return (
    <div
      className={`max-w-sm border border-gray-200 bg-white mx-auto w-full shadow dark:border-gray-700 dark:bg-gray-800 rounded-lg`}
    >
      <div className="py-6 px-4 flex justify-between items-center">
        <div>Class {class.title}</div>
        <div>
          <Button onClick={() => handleClasseViewClick(class.id)}>View</Button>
        </div>
      </div>
    </div>
  );
};
