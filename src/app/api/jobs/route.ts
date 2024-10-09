import db from "@/db";
import { UserSession } from "@/lib/auth";
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
    where: {
      email: session?.user?.email,
      organizationId: (session as UserSession)?.user?.organizationId,
    },
  });

  const jobList = await db.backgroundJob.findMany({
    where: {
      userId: user?.id,
      completionNotified: false,
      organizationId: (session as UserSession)?.user?.organizationId,
    },
  });

  return NextResponse.json(jobList);
}
