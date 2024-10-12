import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/db";
import { DaysOfWeek, timeFormat } from "@/lib/utils";
import {  getServerAuthSession } from "@/lib/auth";
import { UserSession } from "@/lib/auth";

// TODO: add validations for time
const requestBodySchema = z.object({
  name: z.string(),
  slots: z.array(
    z.object({
      slotNumber: z.number(),
      startTime: z.string().refine((val) => timeFormat.test(val), {
        message: "Invalid time format. Expected HH:mm:ss in 24-hour format.",
      }),
      endTime: z.string().refine((val) => timeFormat.test(val), {
        message: "Invalid time format. Expected HH:mm:ss in 24-hour format.",
      }),
      type: z.string(),
    })
  ),
});

// TODO: add pagination
export async function GET() {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const slotGroupList = await db.slotsGroup.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      organizationId,
    },
  });

  return NextResponse.json(slotGroupList);
}

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const parsedRequest = requestBodySchema.safeParse(await req.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: parsedRequest.error.message },
      { status: 400 }
    );
  }

  const { name, slots } = parsedRequest.data;

  const slotGroup = await db.slotsGroup.create({
    data: {
      organizationId,
      name,
    },
  });

  let slotsList = slots.map((item) => ({
    ...item,
    slotGroupId: slotGroup.id,
  }));

  let slotsListWithDays: {
    dayOfWeek: DaysOfWeek;
    slotGroupId: number;
    type: string;
    startTime: string;
    endTime: string;
    slotNumber: number;
    organizationId: number;
  }[] = [];

  // TODO : change create for all 7 days to dynamic
  for (const day of Object.values(DaysOfWeek)) {
    slotsList.forEach((slot) =>
      slotsListWithDays.push({
        organizationId,
        ...slot,
        dayOfWeek: day,
      })
    );
  }

  await db.slots.createMany({
    data: slotsListWithDays,
  });

  return NextResponse.json(
    {
      message: "Slots successfully added",
    },
    {
      status: 200,
    }
  );
}
