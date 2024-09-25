import db from "@/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json(
      {
        error: "Session not found",
      },
      {
        status: 400,
      }
    );
  }

  const user = await db.user.findUnique({
    where: { email: session?.user?.email },
  });

  const jobList = await db.backgroundJob.findMany({
    where: {
      userId: user?.id,
      completionNotified: false,
    },
  });

  return NextResponse.json(jobList);
}
