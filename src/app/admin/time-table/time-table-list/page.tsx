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
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SlotGroupListPage from "../slot-groups/page";
import ClassSubjectsPage from "../class-subjects/page";

export default function TimeTableListPage() {
  const [classTimeTableList, setClassTimeTableList] = useState([]);
  const [open, setOpen] = useState<boolean>(false);
  async function fetchGenerateTimeTable() {
    try {
      const res = await fetch("/api/admin/time-table");
      const data = await res.json();
      setClassTimeTableList(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
    }
  }

  function handleGenerateTimeTableClick() {
    fetchGenerateTimeTable();
  }

  return (
    <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-10">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="h-10 w-10 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOpen(true)}>
                Class Subjects Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[800px] sm:h-[800px]">
            <ClassSubjectsPage />
          </DialogContent>
        </Dialog>
        <TimeTableCardList classTimeTableList={classTimeTableList} />
      </CardContent>
    </Card>
  );
}
