import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type Section = {
  id: number;
  name: string;
};

export const SectionCard = ({ section }: { section: Section }) => {
  const router = useRouter();

  function handleClasseViewClick(id: number) {
    // router.push(`/admin/classes/${id}`);
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
