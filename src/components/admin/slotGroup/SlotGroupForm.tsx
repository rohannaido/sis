"use client";

import { ClassGrade } from "@/components/admin/classGrade/ClassGradeCard";
import { Subject } from "@/components/admin/subject/SubjectCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePicker } from "@/components/ui/time-picker/time-picker-demo";
import { TimePickerInput } from "@/components/ui/time-picker/time-picker-input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

function formatDateToTime(date: Date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}:00`;
}

function timeStringToDate(timeString: string): Date {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds, 0); // set hours, minutes, seconds and milliseconds to 0
  return date;
}

const slotGroupSchema = z.object({
  title: z.string().min(3, {
    message: "Name must be 3 characters long.",
  }),
  slots: z.array(
    z.object({
      // id: z.number(),
      slotNumber: z.number(),
      startDateTime: z.date(),
      endDateTime: z.date(),
      type: z.string().min(1, "Select type"),
    })
  ),
});

enum SlotType {
  CLASS = "Class",
  BREAK = "Break",
}

export default function SlotGroupForm({
  type,
  slotGroupId,
  onSuccess,
}: {
  type?: string;
  slotGroupId?: number;
  onSuccess?: () => void;
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [slotsList, setSlotsList] = useState<Subject[][]>([]);

  useEffect(() => {
    if (type == "EDIT") {
      fetchSlotGroupDetail();
    }
  }, [slotGroupId]);

  async function fetchSlotGroupDetail() {
    try {
      const response = await fetch(`/api/admin/slot-groups/${slotGroupId}`);
      const data = await response.json();
      const { name, Slots, ...formData } = data;
      formData.title = name;
      formData.slots = Slots.map(
        (item: { [x: string]: any; startTime: any; endTime: any }) => {
          const { startTime, endTime, ...rest } = item;
          return {
            ...rest,
            startDateTime: timeStringToDate(startTime),
            endDateTime: timeStringToDate(endTime),
          };
        }
      );

      form.reset(formData);
    } catch (err) {
      toast.error("Something went wrong while searching for slot group!");
    } finally {
    }
  }

  const handleAddSlotAppend = () => {
    append({
      slotNumber: fields.length + 1,
      startDateTime: fields.length > 0 ? new Date(fields[fields.length - 1].endDateTime.getTime()) : new Date(),
      endDateTime: fields.length > 0
        ? new Date(fields[fields.length - 1].endDateTime.getTime() + (fields[0].endDateTime.getTime() - fields[0].startDateTime.getTime()))
        : new Date(new Date().getTime() + 60 * 60 * 1000),
      type: SlotType.CLASS,
    });
    if (slotsList.length < fields.length) {
      setSlotsList(() => {
        slotsList.push([]);
        return slotsList;
      });
    }
  };

  const handleAddSlotDelete = (index: number) => {
    remove(index);
    setSlotsList(() => {
      slotsList.splice(index, 1);
      return slotsList;
    });
  };

  const form = useForm<z.infer<typeof slotGroupSchema>>({
    resolver: zodResolver(slotGroupSchema),
    defaultValues: {
      title: "",
      slots: [],
    },
  });

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "slots",
  });

  const onSubmit = async (data: z.infer<typeof slotGroupSchema>) => {
    try {
      const { title, slots, ...rest } = data;

      const formattedSlots = slots.map((slotItem) => ({
        // id: slotItem.id,
        slotNumber: slotItem.slotNumber,
        startTime: formatDateToTime(slotItem.startDateTime),
        endTime: formatDateToTime(slotItem.endDateTime),
        type: slotItem.type,
      }));

      let formData = {
        ...rest,
        name: title,
        slots: formattedSlots,
      };

      if (type === "EDIT") {
        const res = await axios.put(
          `/api/admin/slot-groups/${slotGroupId}`,
          formData
        );
        toast.success("Teacher updated Successfully");
      } else {
        const res = await axios.post("/api/admin/slot-groups", formData);
        toast.success("Slots created Successfully");
      }
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
    }
  };

  return (
    <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-2">
      <CardContent className="mt-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <div className="grid gap-2 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the slot group name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-2">
              {fields?.length > 0 ? <div>Slots</div> : <></>}
            </div>
            <div className="flex flex-col items-start gap-2 min-w-full overflow-y-auto h-1/2">
              {fields.map((item, index) => {
                return (
                  <div
                    key={item.id}
                    className="gap-4 flex justify-between border border-gray-200 dark:border-gray-700 p-4 rounded-lg w-[700px]"
                  >
                    <div className="flex items-end gap-2">
                      <div className="h-full w-[200px] flex flex-col justify-center">
                        <Label>Slot {item.slotNumber} </Label>
                      </div>
                      <FormField
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <div className="grid gap-1 text-center">
                                <TimePicker
                                  setDate={field.onChange}
                                  date={field.value}
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                        name={`slots.${index}.startDateTime`}
                        control={control}
                      />
                      <FormField
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <div className="grid gap-1 text-center">
                                <TimePicker
                                  setDate={field.onChange}
                                  date={field.value}
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                        name={`slots.${index}.endDateTime`}
                        control={control}
                      />

                      <FormField
                        render={({ field }) => (
                          <FormItem className="w-full justify-between">
                            <FormLabel>Slot Type</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select slot type" />
                                </SelectTrigger>
                                <SelectContent {...field}>
                                  <SelectGroup>
                                    {Object.values(SlotType)?.map(
                                      (slotTypeItem) => (
                                        <SelectItem
                                          key={slotTypeItem}
                                          value={slotTypeItem}
                                        >
                                          {slotTypeItem}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                        name={`slots.${index}.type`}
                        control={control}
                      />
                    </div>
                    <Button
                      type="button"
                      className="bg-red-900 text-white"
                      onClick={() => {
                        handleAddSlotDelete(index);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddSlotAppend}
              >
                + Add Slot
              </Button>
            </div>
            <div className="lg:col-span-2 flex justify-end">
              {isLoading ? (
                <Button>Loading...</Button>
              ) : (
                <Button type="submit">Save</Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
