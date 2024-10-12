import { getServerAuthSession, UserSession } from "@/lib/auth";
import { addBook, getAllBooks } from "@/lib/book.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bookRequestSchema = z.object({
  title: z.string(),
  author: z.string(),
  copies: z.number(),
});

export async function GET() {
  try {
    const session = await getServerAuthSession();
    const organizationId = (session as UserSession)?.user?.organizationId;

    const bookList = await getAllBooks(organizationId);

    return NextResponse.json(bookList);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
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

  await addBook(
    parsedRequest.data.title,
    parsedRequest.data.author,
    parsedRequest.data.copies,
    organizationId
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
