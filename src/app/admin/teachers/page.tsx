import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function TeachersPage() {
  return (
    <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-10">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>Teachers</CardTitle>
          <CardDescription>You can manage teachers.</CardDescription>
        </div>
        <Link href="/admin/teachers/manage-teacher">
          <Button variant="outline">+ Teacher</Button>
        </Link>
      </CardHeader>
    </Card>
  );
}
