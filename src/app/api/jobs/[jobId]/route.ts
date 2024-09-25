import { NextRequest, NextResponse } from "next/server";
import db from "@/db";

type Params = {
  jobId: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  let { jobId } = context.params;
  let jobIdNumber = parseInt(jobId);

  const job = await db.backgroundJob.findUnique({
    where: {
      id: jobIdNumber,
    },
  });

  return NextResponse.json(job);
}
