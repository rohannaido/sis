"use client";

import SlotGroupForm from "@/components/admin/slotGroup/SlotGroupForm";

export default function ManageSlotGroupPage({
  params,
}: {
  params: {
    slotGroupId: string;
  };
}) {
  return (
    <SlotGroupForm type="EDIT" slotGroupId={parseInt(params.slotGroupId)} />
  );
}
