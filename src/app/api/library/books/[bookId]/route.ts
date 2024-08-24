import { Book } from "@/lib/Book";
import { LibraryManager } from "@/lib/Library";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bookRequestSchema = z.object({
  title: z.string(),
  author: z.string(),
});

type Params = {
  bookId: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  const bookId = parseInt(context.params.bookId);
  const book = await Book.fetchFromDatabase(bookId);

  return NextResponse.json(book);
}

export async function PUT(req: NextRequest, context: { params: Params }) {
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

  const bookId = parseInt(context.params.bookId);

  const libraryManager = new LibraryManager();
  await libraryManager.updateBook(
    bookId,
    parsedRequest.data.title,
    parsedRequest.data.author
  );

  return NextResponse.json(
    {
      message: "Updated book!",
    },
    {
      status: 200,
    }
  );
}
