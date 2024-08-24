import { LibraryManager } from "@/lib/Library";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type Params = {
  bookId: string;
};

const borrowRequestSchema = z.object({
  userId: z.string(),
  txnType: z.string(),
});

export async function POST(
  req: NextRequest,
  { context }: { context: { params: Params } }
) {
  const bookId = parseInt(context.params.bookId);

  const parsedRequest = borrowRequestSchema.safeParse(req.json());

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

  const libraryManager = new LibraryManager();
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
