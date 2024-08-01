import { Subject } from "@/components/admin/subject/SubjectCard";
import StudentSubjectCard from "./StudentSubjectCard";

export default function StudentSubjectList({
  subjects,
}: {
  subjects: Subject[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {subjects.map((subjectItem) => (
        <StudentSubjectCard key={subjectItem.id} subject={subjectItem} />
      ))}
    </div>
  );
}
