import ChapterContentCard, { ChapterContent } from "./ChapterContentCard";

export default function ChapterContentList({
  chapterContents,
}: {
  chapterContents: ChapterContent[];
}) {
  //   let a = [1, 2, 3, 4, 5];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {chapterContents.map((chapterContentItem) => (
          <ChapterContentCard
            key={chapterContentItem.id}
            chapterContent={chapterContentItem}
          />
        ))}
      </div>
    </>
  );
}
