import { getServerAuthSession, UserSession } from "@/lib/auth";
import { getAllBookBorrowedUsers } from "@/lib/book.service";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  bookId: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const bookId = parseInt(context.params.bookId);
  const bookBorrowUserList = await getAllBookBorrowedUsers(bookId, organizationId);
  return NextResponse.json(bookBorrowUserList);
}
