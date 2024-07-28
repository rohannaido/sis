import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { z } from "zod";

const requestBodySchema = z.object({
  name: z.string(),
  type: z.string(),
  url: z.string(),
});

type Params = {
  subjectId: string;
  chapterId: string;
};

export async function POST(req: NextRequest, context: { params: Params }) {
  const parseResult = requestBodySchema.safeParse(await req.json());

  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.message },
      { status: 400 }
    );
  }

  const chapterId = parseInt(context.params.chapterId);
  const { name, type, url } = parseResult.data;

  await db.chapterContent.create({
    data: {
      chapterId,
      name,
      type,
      url,
    },
  });

  return NextResponse.json(
    {
      message: "Chapter content is successfully added",
    },
    {
      status: 200,
    }
  );
}

export async function GET(req: NextRequest, context: { params: Params }) {
  const chapterId = parseInt(context.params.chapterId);

  const chapterContent = await db.chapterContent.findMany({
    where: {
      chapterId,
    },
  });

  return NextResponse.json(chapterContent);
}
