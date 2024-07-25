import { SectionFormDialog } from "@/components/admin/classGrade/section/SectionFormDialog";
import { SubjectFormDialog } from "@/components/admin/classGrade/subject/SubjectFormDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getClassGrade } from "@/db/classGrade";

export default async function ClassePage({
  params,
}: {
  params: { classGradeId: string[] };
}) {
  const classGradeId = params.classGradeId[0];
  const classGrade = await getClassGrade(parseInt(classGradeId));

  return (
    <div className="mx-auto max-w-screen-xl justify-between p-4 text-black dark:text-white">
      <div className="flex justify-between">
        <div className="font-bold md:text-2xl lg:text-3xl">
          Class {classGrade?.title}
        </div>
        <Button className="bg-red-500 text-white">Delete</Button>
      </div>
      <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-10">
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Subjects</CardTitle>
            <CardDescription>You can manage subjects.</CardDescription>
          </div>
          <SubjectFormDialog callbackFn={null} />
        </CardHeader>
        <CardContent>Subject COntent</CardContent>
      </Card>
      <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-10">
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Sections</CardTitle>
            <CardDescription>You can manage Sections.</CardDescription>
          </div>
          <SectionFormDialog callbackFn={null} />
        </CardHeader>
        <CardContent>Sections COntent</CardContent>
      </Card>
    </div>
  );
}
