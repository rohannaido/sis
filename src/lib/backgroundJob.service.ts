import db from "@/db";
import { BackgroundJobStatus } from "@prisma/client";

export async function createJob(
  jobName: string,
  userId: string,
  organizationId: number
) {
  const job = await db.backgroundJob.create({
    data: {
      organizationId: organizationId,
      title: jobName,
      userId: userId,
      status: "PENDING",
    },
  });

  return job;
}

export async function updateJobProgress(jobId: number, progress: number) {
  const status =
    progress === 100
      ? BackgroundJobStatus.COMPLETED
      : BackgroundJobStatus.PROCESSING;

  await db.backgroundJob.update({
    where: {
      id: jobId,
    },
    data: {
      status: status,
      progress: progress,
    },
  });
}
