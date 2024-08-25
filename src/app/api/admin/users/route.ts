import { NextRequest, NextResponse } from "next/server";
import db from "@/db";

export async function GET(req: NextRequest) {
  const userList = await db.user.findMany();
  return NextResponse.json(userList);
}
