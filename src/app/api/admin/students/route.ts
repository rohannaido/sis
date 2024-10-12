import db from "@/db";
import { UserSession } from "@/lib/auth";
import {  getServerAuthSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const studentList = await db.student.findMany({
    include: {
      user: true,
    },
    where: {
      organizationId: organizationId,
    },
  });

  return NextResponse.json(studentList);
}
