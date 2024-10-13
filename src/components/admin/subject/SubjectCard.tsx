import { Button } from "@/components/ui/button";
import { ClassGradeContext } from "@/contexts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisVertical, Trash2 } from "lucide-react";
import { useContext } from "react";
import { useRouter } from "next/navigation";

export type Subject = {
  id: number;
  classGradeId: number;
  name: string | null;
  periodCountPerWeek: number | null;
};

export const SubjectCard = ({ subject }: { subject: Subject }) => {
  const classGrade = useContext(ClassGradeContext);
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/admin/classGrades/${classGrade?.id}/subjects/${subject.id}`);
  };

  return (
    <div
      className={`max-w-sm border border-gray-200 bg-white mx-auto w-full shadow dark:border-gray-700 dark:bg-gray-800 rounded-lg cursor-pointer`}
      onClick={handleCardClick}
    >
      <div className="py-6 px-4 flex justify-between items-center">
        <div>{subject.name}</div>
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
