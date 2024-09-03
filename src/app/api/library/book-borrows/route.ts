import { libraryManager } from "@/lib/Library";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const bookBorrows = await libraryManager.getAllBookBorrowTxn();
  return NextResponse.json(bookBorrows);
}
