import { libraryManager } from "@/lib/Library";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bookRequestSchema = z.object({
  title: z.string(),
  author: z.string(),
  copies: z.number(),
});

export async function GET() {
  const bookList = await libraryManager.getAllBooks();

  return NextResponse.json(bookList);
}

export async function POST(req: NextRequest) {
  const parsedRequest = bookRequestSchema.safeParse(await req.json());

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

  await libraryManager.addBook(
    parsedRequest.data.title,
    parsedRequest.data.author,
    parsedRequest.data.copies
  );

  return NextResponse.json(
    {
      message: "Saved book!",
    },
    {
      status: 200,
    }
  );
}
