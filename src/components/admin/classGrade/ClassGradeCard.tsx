import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ClassGradeDeleteAlert } from "./ClassGradeDeleteAlert";

export type ClassGrade = {
  id: number;
  title: string;
};

export const ClassGradeCard = ({
  classGrade,
  callbackFn,
}: {
  classGrade: ClassGrade;
  callbackFn: () => void;
}) => {
  const { toast } = useToast();
  const router = useRouter();

  function handleClassGradeViewClick(id: number) {
    router.push(`/admin/classGrades/${id}`);
  }

  function handleAfterDelete() {
    callbackFn();
    router.refresh();
  }

  return (
    <div
      className={`max-w-sm border border-gray-200 bg-white mx-auto w-full shadow dark:border-gray-700 dark:bg-gray-800 rounded-lg`}
    >
      <div
        className="py-6 px-4 flex justify-between items-center cursor-pointer"
        onClick={() => handleClassGradeViewClick(classGrade.id)}
      >
        <div>Class {classGrade.title}</div>
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleClassGradeViewClick(classGrade.id)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <ClassGradeDeleteAlert 
                classGradeId={classGrade.id} 
                classGradeTitle={classGrade.title}
                onDeleteSuccess={handleAfterDelete}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </ClassGradeDeleteAlert>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
