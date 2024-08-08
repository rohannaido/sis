import { NextRequest, NextResponse } from "next/server";
import db from "@/db";

type Params = {
  slotGroupId: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
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

  if (slotGroup) {
    slotGroup.Slots = groupSlotsBySlotNumber(slotGroup.Slots);
  }

  return NextResponse.json(slotGroup);
}
