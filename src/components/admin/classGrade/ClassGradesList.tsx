import { ClassGrade, ClassGradeCard } from "./ClassGradeCard";

export const ClassGradeList = ({
  classGrades,
}: {
  classGrades: ClassGrade[];
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {classGrades?.map((classGrade) => (
        <ClassGradeCard key={classGrade.id} classGrade={classGrade} />
      ))}
    </div>
  );
};
