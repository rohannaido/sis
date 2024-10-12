import { createJob } from "@/lib/backgroundJob.service";
import { booksImportQueue } from "@/workers/booksImport.worker";
import {  getServerAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/db";

const bookBulkRequestSchema = z.array(
  z.object({
    title: z.string(),
    author: z.string(),
    copies: z.number(),
  })
);

export async function POST(req: NextRequest) {
  const parsedRequest = bookBulkRequestSchema.safeParse(await req.json());

  try {
    if (!parsedRequest.success) {
      return NextResponse.json(
        {
          error: parsedRequest.error,
        },
        {
          status: 400,
        }
      );
    }

    const session = await getServerAuthSession();

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
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    const job = await createJob("Upload Books", user.id, user.organizationId);
    await booksImportQueue.add("Upload Books", {
      bookList: parsedRequest.data,
      jobId: job.id,
    });

    return NextResponse.json(
      {
        message: "Books upload started!",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 400,
      }
    );
  }
}
