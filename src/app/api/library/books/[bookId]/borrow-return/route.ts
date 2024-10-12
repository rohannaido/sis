import { getServerAuthSession, UserSession } from "@/lib/auth";
import { currentBookBorrowTxn, getBookById } from "@/lib/book.service";
import { lendBook, returnBook } from "@/lib/library.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type Params = {
  bookId: string;
};

const borrowRequestSchema = z.object({
  userId: z.string(),
  txnType: z.string(),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD"),
});

const returnRequestSchema = z.object({
  userId: z.string(),
  txnType: z.string(),
});

export async function POST(req: NextRequest, context: { params: Params }) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

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

  const { userId, txnType, dueDate } = parsedRequest.data;

  try {
    if (txnType == "BORROW") {
      await lendBook(bookId, userId, dueDate, organizationId);
    } else {
      await returnBook(bookId, userId, organizationId);
    }

    return NextResponse.json(
      {
        message: "Transaction successful!",
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

export async function PATCH(req: NextRequest, context: { params: Params }) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const bookId = parseInt(context.params.bookId);

  const parsedRequest = returnRequestSchema.safeParse(await req.json());

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

  try {
    await returnBook(bookId, userId, organizationId);

    return NextResponse.json(
      {
        message: "Transaction successful!",
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

export async function GET(req: NextRequest, context: { params: Params }) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const bookId = parseInt(context.params.bookId);
  const bookBorrowDetail = await currentBookBorrowTxn(bookId, organizationId);
  return NextResponse.json(bookBorrowDetail);
}
