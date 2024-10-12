import { getServerAuthSession, UserSession } from "@/lib/auth";
import { getAllBookBorrowTxn } from "@/lib/library.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const bookBorrows = await getAllBookBorrowTxn(organizationId);
  return NextResponse.json(bookBorrows);
}
