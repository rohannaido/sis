import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ManageTeacherPage() {
  return (
    <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-10">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>Add Teacher</CardTitle>
          <CardDescription>Add a new teacher here</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
