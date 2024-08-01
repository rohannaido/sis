import StudentChapterList from "@/components/student/chapter/StudentChapterList";
import { getChapterContent } from "@/db/subject";

type Params = {
  subjectId: string;
  chapterId: string;
};

// TODO: refactor content to separate component
export default async function StudentSubjectChapterContent({
  params,
}: {
  params: Params;
}) {
  const chapterContents = await getChapterContent(parseInt(params.chapterId));
  console.log(chapterContents);
  return (
    <>
      <div className="px-4">
        <div className="flex justify-between my-4">
          <div className="font-bold md:text-2xl lg:text-3xl">
            {chapterContents?.name}
          </div>
          <div></div>
        </div>
        {chapterContents?.ChapterContent?.length &&
          chapterContents?.ChapterContent?.map((item) => (
            <div key={item.id}>
              <div className="text-xl mt-6 mb-2">{item.name}</div>
              <div>
                <iframe
                  width="900"
                  height="575"
                  src={item?.url || undefined}
                  title="Scaling your Node.js app | Horizontal vs Vertical Scaling | Capacity Estimation - Cohort 2 Preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
