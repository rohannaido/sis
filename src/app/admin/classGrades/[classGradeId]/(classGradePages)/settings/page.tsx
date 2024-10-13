"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClassGradeContext } from "@/contexts";
import { ClassGradeDeleteAlert } from "@/components/admin/classGrade/ClassGradeDeleteAlert";

export default function SettingsPage() {
  const classGrade = useContext(ClassGradeContext);
  const router = useRouter();

  const handleDeleteSuccess = () => {
    router.push("/admin");
  };

  return (
    <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-10">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your class settings here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Danger Zone</h3>
          <ClassGradeDeleteAlert 
            classGradeId={classGrade?.id!} 
            classGradeTitle={classGrade?.title!} 
            onDeleteSuccess={handleDeleteSuccess}
          >
            <Button variant="destructive">
              Delete Class
            </Button>
          </ClassGradeDeleteAlert>
        </div>
      </CardContent>
    </Card>
  );
}
