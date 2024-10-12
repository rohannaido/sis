import StudentSubjectList from "@/components/student/subject/StudentSubjectList";
import { getAllSubjects } from "@/db/subject";
import {  getServerAuthSession } from "@/lib/auth";

async function getSubjects() {
  const session = await getServerAuthSession();
  const subjects = await getAllSubjects(session?.user?.email || "");
  return subjects;
}

export default async function StudentSubjects() {
  const subjects = await getSubjects();

  return (
    <div className="px-4">
      <div className="flex justify-between my-4">
        <div className="font-bold md:text-2xl lg:text-3xl">Subjects</div>
        <div></div>
      </div>
      <StudentSubjectList subjects={subjects} />
    </div>
  );
}
