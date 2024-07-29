import StudentChapterList from "@/components/student/chapter/StudentChapterList";
import { getSubjectChapters } from "@/db/subject";

type Params = {
  subjectId: string;
};

export default async function StudentSubjectContent({
  params,
}: {
  params: Params;
}) {
  const subjectChapters = await getSubjectChapters(parseInt(params.subjectId));
  console.log(subjectChapters);
  return (
    <>
      <div className="px-4">
        <div className="flex justify-between my-4">
          <div className="font-bold md:text-2xl lg:text-3xl">
            {subjectChapters?.name}
          </div>
          <div></div>
        </div>
        {subjectChapters?.Chapter && (
          <StudentChapterList chapters={subjectChapters?.Chapter} />
        )}
      </div>
    </>
  );
}
