import { getAllBookBorrowTxn } from "@/lib/library.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const bookBorrows = await getAllBookBorrowTxn();
  return NextResponse.json(bookBorrows);
}
