import { getAllBookBorrowedUsers } from "@/lib/book.service";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  bookId: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  const bookId = parseInt(context.params.bookId);
  const bookBorrowUserList = await getAllBookBorrowedUsers(bookId);
  return NextResponse.json(bookBorrowUserList);
}
