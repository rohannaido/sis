import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { UserSession } from "@/lib/auth";
import {  getServerAuthSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const userList = await db.user.findMany({
    where: {
      organizationId: organizationId,
    },
  });
  return NextResponse.json(userList);
}
