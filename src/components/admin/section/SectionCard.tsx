import { Button } from "@/components/ui/button";
import { ClassGradeContext } from "@/contexts";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { EllipsisVertical, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Section = {
  id: number;
  name: string;
};

export const SectionCard = ({ section }: { section: Section }) => {
  const router = useRouter();
  const classGrade = useContext(ClassGradeContext);

  function handleSectionClick(id: number) {
    router.push(`/admin/classGrades/${classGrade?.id}/sections/${id}`);
  }

  function handleDelete(id: number) {
    // Add your delete logic here
    console.log(`Delete section with id: ${id}`);
  }

  return (
    <div
      className={`max-w-sm border border-gray-200 bg-white mx-auto w-full shadow dark:border-gray-700 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700`}
      onClick={() => handleSectionClick(section.id)}
    >
      <div className="py-6 px-4 flex justify-between items-center">
        <div>{section.name}</div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
              <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDelete(section.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
