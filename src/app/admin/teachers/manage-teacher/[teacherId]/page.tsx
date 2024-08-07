"use client";

import TeacherForm from "@/components/admin/teachers/TeacherForm";

export default function ManageTeacherPage({
  params,
}: {
  params: {
    teacherId: string;
  };
}) {
  return <TeacherForm type="EDIT" teacherId={parseInt(params.teacherId)} />;
}
