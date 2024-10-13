"use client";

import { boolean } from "zod";
import SlotGroupListPage from "./SlotGroupListPage";
import { useState } from "react";
import SlotGroupForm from "../slotGroup/SlotGroupForm";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";

export default function SlotGroupPage() {
  const [openEditor, setOpenEditor] = useState<boolean>(false);
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
        <div className="h-full overflow-y-auto">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setOpenEditor(false)}
              variant="secondary"
              className="h-12 w-12"
            >
              <ArrowLeft />
            </Button>
            <CardTitle>
              {slotFormType === "EDIT" ? <>Edit</> : <>Add</>} Slot Group
            </CardTitle>
          </div>
          <SlotGroupForm
            type={slotFormType}
            slotGroupId={slotGroupEditId}
            onSuccess={() => setOpenEditor(false)}
          />
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
