import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { z } from "zod";

type Params = {
  subjectId: string;
};

const requestBodySchema = z.object({
  name: z.string(),
});

export async function GET(req: NextRequest, context: { params: Params }) {
  const subjectId = parseInt(context.params.subjectId);

  const chapterList = await db.chapter.findMany({
    where: {
      subjectId: subjectId,
    },
  });

  return NextResponse.json(chapterList);
}

export async function POST(req: NextRequest, context: { params: Params }) {
  const parseResult = requestBodySchema.safeParse(await req.json());

  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.message },
      { status: 400 }
    );
  }

  const subjectId = parseInt(context.params.subjectId);
  const { name } = parseResult.data;

  await db.chapter.create({
    data: {
      subjectId,
      name,
    },
  });

  return NextResponse.json(
    {
      message: "Chapter is successfully added",
    },
    {
      status: 200,
    }
  );
}
