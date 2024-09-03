import { Book } from "@/lib/Book";
import { libraryManager } from "@/lib/Library";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type Params = {
  bookId: string;
};

const borrowRequestSchema = z.object({
  userId: z.string(),
  txnType: z.string(),
});

export async function POST(req: NextRequest, context: { params: Params }) {
  const bookId = parseInt(context.params.bookId);

  const parsedRequest = borrowRequestSchema.safeParse(await req.json());

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

  const { userId, txnType } = parsedRequest.data;

  if (txnType == "BORROW") {
    await libraryManager.lendBook(bookId, userId);
  } else {
    await libraryManager.returnBook(bookId, userId);
  }

  return NextResponse.json(
    {
      message: "Transaction successful!",
    },
    {
      status: 200,
    }
  );
}

export async function PATCH(req: NextRequest, context: { params: Params }) {
  const bookId = parseInt(context.params.bookId);

  const parsedRequest = borrowRequestSchema.safeParse(await req.json());

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

  const { userId, txnType } = parsedRequest.data;

  await libraryManager.returnBook(bookId, userId);

  return NextResponse.json(
    {
      message: "Transaction successful!",
    },
    {
      status: 200,
    }
  );
}

export async function GET(req: NextRequest, context: { params: Params }) {
  const bookId = parseInt(context.params.bookId);
  const bookDetail = await Book.fetchFromDatabase(bookId);
  const bookBorrowDetail = bookDetail?.currentBookBorrowTxn();
  return NextResponse.json(bookBorrowDetail);
}
