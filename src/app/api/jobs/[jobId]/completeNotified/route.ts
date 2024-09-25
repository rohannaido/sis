import { NextRequest, NextResponse } from "next/server";
import db from "@/db";

type Params = {
  jobId: string;
};

export async function PATCH(req: NextRequest, context: { params: Params }) {
  let { jobId } = context.params;
  let jobIdNumber = parseInt(jobId);

  const job = await db.backgroundJob.update({
    data: {
      completionNotified: true,
    },
    where: {
      id: jobIdNumber,
    },
  });

  return NextResponse.json(
    {
      message: "Updated job notification!",
    },
    {
      status: 200,
    }
  );
}
