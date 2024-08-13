"use client";

import { boolean } from "zod";
import SlotGroupListPage from "./SlotGroupListPage";
import { useState } from "react";
import SlotGroupForm from "../slotGroup/SlotGroupForm";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SlotGroupPage() {
  const [openEditor, setOpenEditor] = useState<boolean>(true);
  const [slotFormType, setSlotFormType] = useState<string>("");
  const [slotGroupEditId, setSlotGroupEditId] = useState<number>(0);

  const handleAddAction = () => {
    setSlotFormType("");
    setSlotGroupEditId(0);
    setOpenEditor(true);
  };

  const handleEditAction = (slotGroupId: number) => {
    setSlotFormType("EDIT");
    console.log("TEST >SDF", slotGroupId);
    setSlotGroupEditId(slotGroupId);
    setOpenEditor(true);
  };

  return (
    <>
      {openEditor ? (
        <div>
          <Button
            onClick={() => setOpenEditor(false)}
            variant="secondary"
            className="h-12 w-12"
          >
            <ArrowLeft />
          </Button>
          <SlotGroupForm type={slotFormType} slotGroupId={slotGroupEditId} />
        </div>
      ) : (
        <SlotGroupListPage
          addAction={handleAddAction}
          editAction={handleEditAction}
        />
      )}
    </>
  );
}
