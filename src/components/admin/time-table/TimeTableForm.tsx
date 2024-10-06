import TimeTableCardList from "@/components/admin/time-table/TimeTableCardList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Clock10, School } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SlotGroupPage from "@/components/admin/time-table/SlotGroupPage";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ClassGradeTimeTable } from "@/lib/timeTableGenerator";
import ClassSubjectsPage from "@/components/admin/time-table/TimeTableClassSettings";
import TimeTableBuilder, { TimeTableBuilderRef } from "./TimeTableBuilder";

export default function TimeTableForm({
  type,
  timeTableId,
}: {
  type?: "EDIT";
  timeTableId?: string;
}) {
  const { toast } = useToast();
  const [classTimeTableList, setClassTimeTableList] = useState<
    ClassGradeTimeTable[]
  >([]);
  const [openClassSettings, setOpenClassSettings] = useState<boolean>(false);
  const [openSlotGroupSettings, setOpenSlotGroupSettings] =
    useState<boolean>(false);
  const timeTableBuilderRef = useRef<TimeTableBuilderRef>(null);

  useEffect(() => {
    if (type == "EDIT") {
      fetchTimeTable();
    }
  }, []);

  async function fetchTimeTable() {
    try {
      const responseGet = await axios.get(
        `/api/admin/time-table/${timeTableId}`
      );
      const timeTableData = responseGet.data;
      setClassTimeTableList(timeTableData);
    } catch (err: any) {
      toast({
        variant: "destructive",
        description: err?.response?.data?.message || "Something went wrong!",
      });
    } finally {
    }
  }

  async function fetchGenerateTimeTable() {
    try {
      const responseGet = await axios.get("/api/admin/time-table-generator");
      const timeTableData = responseGet.data;
      setClassTimeTableList(timeTableData);
    } catch (err: any) {
      toast({
        variant: "destructive",
        description: err?.response?.data?.message || "Something went wrong!",
      });
    } finally {
    }
  }

  async function createTimeTable() {
    try {
      let timeTableData: any[] | undefined = [];
      classTimeTableList.forEach((classItem) =>
        classItem.Section.forEach((sectionItem) => {
          // @ts-ignore
          sectionItem?.TimeTable?.forEach((timeTableItem) => {
            timeTableData.push(timeTableItem);
          });
        })
      );
      await axios.post("/api/admin/time-table", timeTableData);
      toast({
        title: "Saved Time Table!",
      });
    } catch (err: any) {
    } finally {
    }
  }

  async function updateTimeTable() {
    try {
      let timeTableData: any[] | undefined = [];
      classTimeTableList.forEach((classItem) =>
        classItem.Section.forEach((sectionItem) => {
          // @ts-ignore
          sectionItem?.TimeTable?.forEach((timeTableItem) => {
            timeTableData.push(timeTableItem);
          });
        })
      );
      await axios.put(`/api/admin/time-table/${timeTableId}`, timeTableData);
      toast({
        title: "Saved Time Table!",
      });
    } catch (err: any) {
    } finally {
    }
  }

  function handleGenerateTimeTableClick() {
    fetchGenerateTimeTable();
  }

  function handleTimeTableSave() {
    if (type === "EDIT") {
      updateTimeTable();
    } else {
      createTimeTable();
    }
  }

  function handlePreviewAndSave() {
    timeTableBuilderRef.current?.previewAndSave();
  }

  return (
    <div className="flex justify-between">
      <div className="w-full">
        <Card className="w-full overflow-y-auto lg:mt-4">
          <CardHeader className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle>Time table</CardTitle>
              <CardDescription>
                You can generate and manage time tables here.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {/* {type != "EDIT" ? (
                <Button
                  onClick={handleGenerateTimeTableClick}
                  variant="default"
                >
                  Generate New Time table
                </Button>
              ) : (
                <></>
              )} */}
              <Button onClick={() => handlePreviewAndSave()}>
                Preview & Save
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Dialog
              open={openClassSettings}
              onOpenChange={setOpenClassSettings}
            >
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

            <TimeTableBuilder ref={timeTableBuilderRef} />
            {/* <div className="relative max-h-[600px]">
              <TimeTableCardList classTimeTableList={classTimeTableList} />
            </div> */}
          </CardContent>
        </Card>
        <div className="flex justify-end mt-2">
          {/* {classTimeTableList?.length ? (
            <Button onClick={handleTimeTableSave}>Save</Button>
          ) : (
            <span></span>
          )} */}
        </div>
      </div>

      {/* <div className="rounded-lg flex flex-col gap-2 sm:fixed sm:top-[80px] sm:right-8"> */}
      {/* <div className="">
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
      </div> */}
    </div>
  );
}
