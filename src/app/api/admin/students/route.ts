import db from "@/db";
import { UserSession } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();
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
