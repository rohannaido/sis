import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/db";

enum DaysOfWeek {
  MONDAY = "Monday",
  TUESDAY = "Tuesday",
  WEDNESDAY = "Wednesday",
  THURSDAY = "Thursday",
  FRIDAY = "Friday",
  SATURDAY = "Saturday",
  //   SUNDAY = "Sunday",
}

const timeFormat = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

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
  const slotGroupList = await db.slotsGroup.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json(slotGroupList);
}

export async function POST(req: NextRequest) {
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
  }[] = [];

  // TODO : change create for all 7 days to dynamic
  for (const day of Object.values(DaysOfWeek)) {
    slotsList.forEach((slot) =>
      slotsListWithDays.push({
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
