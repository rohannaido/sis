import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { z } from "zod";
import { DaysOfWeek, timeFormat } from "@/lib/utils";
import {  getServerAuthSession } from "@/lib/auth";
import { UserSession } from "@/lib/auth";

type Params = {
  slotGroupId: string;
};

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

export async function GET(req: NextRequest, context: { params: Params }) {
  const forFullweek = req.nextUrl.searchParams.get("forFullweek");

  const slotGroupId = parseInt(context.params.slotGroupId);

  let slotGroup = await db.slotsGroup.findFirst({
    where: {
      id: slotGroupId,
    },
    select: {
      id: true,
      name: true,
      Slots: {
        select: {
          slotNumber: true,
          dayOfWeek: true,
          startTime: true,
          endTime: true,
          type: true,
          id: true,
          slotGroupId: true,
        },
      },
    },
  });

  function groupSlotsBySlotNumber(slots: any[]): {
    slotNumber: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    type: string;
    id: number;
    slotGroupId: number;
  }[] {
    return Object.values(
      slots.reduce((acc, slot) => {
        if (!acc[slot.slotNumber]) {
          acc[slot.slotNumber] = slot;
        }
        return acc;
      }, {})
    );
  }

  if (slotGroup && !(forFullweek === "true")) {
    slotGroup.Slots = groupSlotsBySlotNumber(slotGroup.Slots);
  }

  return NextResponse.json(slotGroup);
}

// TODO: OPTIMIZE DO NOT DELTE ALL
export async function PUT(req: NextRequest, context: { params: Params }) {
  const session = await getServerAuthSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const parsedRequest = requestBodySchema.safeParse(await req.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: parsedRequest.error.message },
      { status: 400 }
    );
  }

  const slotGroupId = parseInt(context.params.slotGroupId);

  const { name, slots } = parsedRequest.data;

  const slotGroup = await db.slotsGroup.findFirst({
    where: {
      id: slotGroupId,
    },
  });

  if (!slotGroup) {
    return NextResponse.json({ error: "Data not found!" }, { status: 400 });
  }

  await db.slotsGroup.update({
    data: {
      name,
    },
    where: {
      id: slotGroupId,
    },
  });

  await db.slots.deleteMany({
    where: {
      slotGroupId: slotGroupId,
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
      message: "Slots successfully updated",
    },
    {
      status: 200,
    }
  );
}
