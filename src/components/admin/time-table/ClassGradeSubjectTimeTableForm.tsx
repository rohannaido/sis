import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Subject } from "../subject/SubjectCard";
import { useEffect, useState } from "react";
import { SlotsGroup } from "@/app/admin/time-table/slot-groups/page";
import { Label } from "@/components/ui/label";
import axios from "axios";

const classGradeSubjectTimeTableSchema = z.object({
  slotsGroupId: z.number().gt(0, "Select slots group!"),
  classSubjectCountList: z.array(
    z.object({
      subjectId: z.number().gt(0, "Select valid subject."),
      subjectPeriodCount: z.number().gt(0, "Select valid period count."),
    })
  ),
});

export default function ClassGradeSubjectTimeTableForm({
  classGradeId,
}: {
  classGradeId: number;
}) {
  const [subjectList, setSubjectList] = useState<Subject[]>([]);
  const [slotsGroupList, setSlotsGroupList] = useState<SlotsGroup[]>([]);

  const form = useForm<z.infer<typeof classGradeSubjectTimeTableSchema>>({
    resolver: zodResolver(classGradeSubjectTimeTableSchema),
    defaultValues: {},
  });

  async function fetchSubjects() {
    try {
      const response = await fetch(
        `/api/admin/classGrades/${classGradeId}/subjects`
      );
      const data = await response.json();
      setSubjectList(data);
    } catch (err) {
      toast.error("Something went wrong while searching for subjects");
    } finally {
    }
  }

  async function fetchSlotGroups() {
    try {
      const response = await fetch("/api/admin/slot-groups");
      const data = await response.json();
      setSlotsGroupList(data);
    } catch (err) {
      toast.error("Something went wrong while searching for slot groups");
    } finally {
    }
  }

  async function fetchClassGradeSubjectTimeTableLink() {
    try {
      const response = await fetch(
        `/api/admin/classGrades/${classGradeId}/time-table-subjects`
      );
      const data = await response.json();
      form.reset(data);
    } catch (err) {
      toast.error("Something went wrong while searching for class details");
    } finally {
    }
  }

  useEffect(() => {
    fetchSlotGroups();
  }, []);

  useEffect(() => {
    form.reset({
      classSubjectCountList: [],
    });
    fetchClassGradeSubjectTimeTableLink();
    fetchSubjects();
  }, [classGradeId]);

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "classSubjectCountList",
  });

  async function onSubmit(
    data: z.infer<typeof classGradeSubjectTimeTableSchema>
  ) {
    console.log("TEST @!#f", data);
    try {
      const res = await axios.put(
        `/api/admin/classGrades/${classGradeId}/time-table-subjects`,
        data
      );
      toast.success("Successfully linked class subjects to time table!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
    }
  }

  function handleLinkSubjectClick() {
    append({
      subjectId: 0,
      subjectPeriodCount: 0,
    });
  }

  function handleDeleteSubjectLinkClick(index: number) {
    remove(index);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-4 min-w-full">
            <Label>Slots Group</Label>
            <FormField
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(e) => field.onChange(parseInt(e))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a slots group" />
                      </SelectTrigger>
                      <SelectContent {...field}>
                        {slotsGroupList?.map((slotGroupItem) => (
                          <SelectItem
                            key={slotGroupItem.id}
                            value={slotGroupItem.id.toString()}
                          >
                            {slotGroupItem.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="slotsGroupId"
              control={control}
            />
            {fields.map((field, index) => {
              return (
                <div className="flex gap-2" key={field.id}>
                  <FormField
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Select
                            value={field.value?.toString()}
                            onValueChange={(e) => field.onChange(parseInt(e))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjectList.map((subjectItem, subjectIndex) => (
                                <SelectItem
                                  key={subjectIndex}
                                  value={subjectItem.id.toString()}
                                >
                                  {subjectItem.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    name={`classSubjectCountList.${index}.subjectId`}
                    control={control}
                  />
                  <FormField
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                            placeholder="Enter periods per week"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    control={control}
                    name={`classSubjectCountList.${index}.subjectPeriodCount`}
                  />
                  <Button
                    onClick={() => handleDeleteSubjectLinkClick(index)}
                    type="button"
                    className="bg-red-900 text-white"
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
              onClick={handleLinkSubjectClick}
            >
              + Link Subject
            </Button>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
