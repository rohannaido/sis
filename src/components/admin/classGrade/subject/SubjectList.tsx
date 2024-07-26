import { Subject, SubjectCard } from "./SubjectCard";

export const SubjectList = ({ subjects }: { subjects: Subject[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {subjects?.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  );
};
