import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

export type ChapterContent = {
  id: number;
  name: string;
  chapterId: number;
  type: string;
  url: string;
};

export default function ChapterContentCard({
  chapterContent,
}: {
  chapterContent: ChapterContent;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`max-w-sm cursor-pointer border border-gray-200 bg-white mx-auto w-full shadow dark:border-gray-700 dark:bg-gray-800 rounded-lg`}
        >
          <div className="py-6 px-4 flex justify-center items-center">
            <div>{chapterContent.name}</div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>{chapterContent.name}</DialogHeader>
        <div className="flex flex-col items-center">
          {chapterContent.type === "YT_LINK" ? (
            <iframe
              width="900"
              height="575"
              src={chapterContent.url}
              title="Scaling your Node.js app | Horizontal vs Vertical Scaling | Capacity Estimation - Cohort 2 Preview"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          ) : (
            <div></div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
