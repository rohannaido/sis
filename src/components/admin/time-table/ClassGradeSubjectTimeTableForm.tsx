import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
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

const classGradeSubjectTimeTableSchema = z.object({
  slotsGroupId: z.number().gt(0, "Select slots group!"),
  array: z.array(
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
    defaultValues: {
      array: [],
    },
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

  useEffect(() => {
    fetchSlotGroups();
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [classGradeId]);

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "array",
  });

  function onSubmit(data: z.infer<typeof classGradeSubjectTimeTableSchema>) {
    console.log("TEST @!#");
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
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a slots group" />
              </SelectTrigger>
              <SelectContent>
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
            {fields.map((item, index) => {
              return (
                <div className="flex gap-2" key={index}>
                  <FormField
                    render={({ field }) => (
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjectList.map((subjectItem, subjectIndex) => (
                            <SelectItem
                              key={index}
                              value={subjectItem.id.toString()}
                            >
                              {subjectItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    name={`array.${index}.subjectId`}
                  />
                  <FormField
                    render={({ field }) => (
                      <Input placeholder="Enter periods per week" />
                    )}
                    name={`array.${index}.subjectId`}
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
