import { Class, ClasseCard } from "./SubjectCard";

export const ClassesList = ({ classes }: { classes: Class[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {classes?.map((class) => (
        <ClasseCard key={class.id} class={class} />
      ))}
    </div>
  );
};
