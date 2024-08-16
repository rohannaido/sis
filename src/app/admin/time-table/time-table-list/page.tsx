"use client";

import TimeTableCardList from "@/components/admin/time-table/TimeTableCardList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Clock10,
  MoreHorizontal,
  MoreVertical,
  School,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SlotGroupListPage from "../../../../components/admin/time-table/SlotGroupListPage";
import ClassSubjectsPage from "../../../../components/admin/time-table/TimeTableClassSettings";
import SlotGroupPage from "@/components/admin/time-table/SlotGroupPage";
import axios from "axios";

export default function TimeTableListPage() {
  const [classTimeTableList, setClassTimeTableList] = useState([]);
  const [openClassSettings, setOpenClassSettings] = useState<boolean>(false);
  const [openSlotGroupSettings, setOpenSlotGroupSettings] =
    useState<boolean>(false);
  async function fetchGenerateTimeTable() {
    try {
      // const res = await axios.post("/api/admin/time-table");
      // const data = await res.data;
      // toast.success("Generated Time Table!");
      const responseGet = await axios.get("/api/admin/time-table");
      const timeTableData = responseGet.data;
      console.log("timeTableData");
      console.log(timeTableData);
      setClassTimeTableList(timeTableData);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
    }
  }

  function handleGenerateTimeTableClick() {
    fetchGenerateTimeTable();
  }

  return (
    <div className="flex justify-between">
      <Card className="w-full max-w-6xl overflow-y-auto lg:mt-10">
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Time table</CardTitle>
            <CardDescription>
              You can generate and manage time tables here.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleGenerateTimeTableClick} variant="default">
              Generate Time table
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Dialog open={openClassSettings} onOpenChange={setOpenClassSettings}>
            <DialogContent className="sm:max-w-[900px] sm:h-full">
              <ClassSubjectsPage />
            </DialogContent>
          </Dialog>
          <Dialog
            open={openSlotGroupSettings}
            onOpenChange={setOpenSlotGroupSettings}
          >
            <DialogContent className="sm:max-w-[900px] sm:h-full">
              <SlotGroupPage />
            </DialogContent>
          </Dialog>
          <div>
            <TimeTableCardList classTimeTableList={classTimeTableList} />
          </div>
        </CardContent>
      </Card>
      <div className="rounded-lg flex flex-col gap-2 sm:fixed sm:top-[80px] sm:right-8">
        <Button
          className="h-20 flex flex-col justify-between p-3"
          variant="secondary"
          onClick={() => setOpenClassSettings(true)}
        >
          <School />
          Class Settings
        </Button>
        <Button
          className="h-20 flex flex-col justify-between p-3"
          variant="secondary"
          onClick={() => setOpenSlotGroupSettings(true)}
        >
          <Clock10 />
          Slot Settings
        </Button>
      </div>
    </div>
  );
}
