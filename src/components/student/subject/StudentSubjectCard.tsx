import { Subject } from "@prisma/client";
import Link from "next/link";

export default function StudentSubjectCard({ subject }: { subject: Subject }) {
  return (
    <Link href={`/student/subject/${subject.id}`}>
      <div
        className={`max-w-sm h-40 flex flex-col justify-between border border-gray-200 bg-white mx-auto w-full shadow dark:border-gray-700 dark:bg-gray-800 rounded-lg`}
      >
        <div></div>
        <div className="py-6 px-4">
          <div>{subject.name}</div>
        </div>
      </div>
    </Link>
  );
}
