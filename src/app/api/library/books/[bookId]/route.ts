import { getServerAuthSession, UserSession } from "@/lib/auth";
import { getBookById, updateBook } from "@/lib/book.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bookRequestSchema = z.object({
  title: z.string(),
  author: z.string(),
  copies: z.number(),
});

type Params = {
  bookId: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  const bookId = parseInt(context.params.bookId);
  const book = await getBookById(bookId);

  return NextResponse.json(book);
}

export async function PUT(req: NextRequest, context: { params: Params }) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;
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

  await updateBook(
    bookId,
    parsedRequest.data.title,
    parsedRequest.data.author,
    parsedRequest.data.copies,
    organizationId
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
