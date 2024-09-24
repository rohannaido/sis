import { addBook } from "@/lib/book.service";
import { booksImportQueue } from "@/workers/booksImport.worker";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

    for (const book of parsedRequest.data) {
      booksImportQueue.add("Upload Books", book);
      // await addBook(book.title, book.author, book.copies);
    }

    return NextResponse.json(
      {
        message: "Saving books!",
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
