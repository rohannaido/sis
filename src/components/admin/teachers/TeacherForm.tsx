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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const teacherSchema = z.object({
  title: z.string().min(3, {
    message: "Name must be 3 characters long.",
  }),
  email: z.string().email("Enter a valid Email."),
  teacherClassSubjectLink: z.array(
    z.object({
      id: z.number(),
      subjectId: z.number().gt(0, "Select valid subject."),
      classGradeId: z.number().gt(0, "Select valid class."),
    })
  ),
});

export default function TeacherForm({
  type,
  teacherId,
}: {
  type?: string;
  teacherId?: number;
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [classGradeList, setClassGradeList] = useState<ClassGrade[] | null>(
    null
  );
  const [classGradeSubjectList, setClassGradeSubjectList] = useState<
    Subject[][]
  >([]);

  useEffect(() => {
    fetchClassGradeList();
    if (type == "EDIT") {
      fetchTeacherDetail();
    }
  }, []);

  async function fetchTeacherDetail() {
    try {
      const response = await fetch(`/api/admin/teachers/${teacherId}`);
      const data = await response.json();
      const { name, teacherClassGradeSubjectLink, ...formData } = data;

      formData.title = name;
      formData.teacherClassSubjectLink = teacherClassGradeSubjectLink;
      form.reset(formData);

      const emptyArray = new Array(
        formData.teacherClassSubjectLink?.length || 0
      ).fill([]);
      setClassGradeSubjectList(emptyArray);

      formData.teacherClassSubjectLink?.forEach(
        (item: { classGradeId: string }, index: any) => {
          handleClassGradeSelect(item.classGradeId, index);
        }
      );
    } catch (err) {
      toast.error("Something went wrong while searching for teacher");
    } finally {
    }
  }

  async function fetchClassGradeList() {
    try {
      const response = await fetch(`/api/admin/classGrades`);
      const data = await response.json();
      setClassGradeList(data);
    } catch (err) {
      toast.error("Something went wrong while searching for videos");
    } finally {
    }
  }

  async function fetchSubjectByClassGrade(classGradeId: number) {
    try {
      const response = await fetch(
        `/api/admin/classGrades/${classGradeId}/subjects`
      );
      const data = await response.json();
      return data;
    } catch (err) {
      toast.error("Something went wrong while searching for subjects");
    } finally {
    }
  }

  const handleClassGradeSelect = (classGradeId: string, index: number) => {
    const classGradeIdInt = parseInt(classGradeId);
    fetchSubjectByClassGrade(classGradeIdInt).then((dataList) => {
      setClassGradeSubjectList(() => {
        const updatedList = [...classGradeSubjectList];
        updatedList[index] = dataList;
        return updatedList;
      });
    });
  };

  const handleLinkTeacherAppend = () => {
    append({ id: 0, subjectId: 0, classGradeId: 0 });
    if (classGradeSubjectList.length < fields.length) {
      setClassGradeSubjectList(() => {
        classGradeSubjectList.push([]);
        return classGradeSubjectList;
      });
    }
  };

  const handleLinkTeacherDelete = (index: number) => {
    remove(index);
    setClassGradeSubjectList(() => {
      classGradeSubjectList.splice(index, 1);
      return classGradeSubjectList;
    });
  };

  const form = useForm<z.infer<typeof teacherSchema>>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      title: "",
      email: "",
      teacherClassSubjectLink: [],
    },
  });

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "teacherClassSubjectLink",
  });

  const onSubmit = async (data: z.infer<typeof teacherSchema>) => {
    try {
      const { title, ...rest } = data;
      const formData = {
        name: title,
        ...rest,
      };
      if (type === "EDIT") {
        const res = await axios.put(
          `/api/admin/teachers/${teacherId}`,
          formData
        );
        toast.success("Teacher updated Successfully");
      } else {
        const res = await axios.post("/api/admin/teachers", formData);
        toast.success("Teacher created Successfully");
      }
      setTimeout(() => {
        router.push("/admin/teachers");
      }, 300);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
    }
  };

  return (
    <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-10">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>
            {type === "EDIT" ? <>Edit</> : <>Add</>} Teacher
          </CardTitle>
          <CardDescription>
            {type === "EDIT" ? <>Edit</> : <>Add</>} teacher here
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the teacher name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the teacher's email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4">
              {fields?.length > 0 ? <div>Teacher subject link</div> : <></>}
            </div>
            <div className="flex flex-col gap-4 min-w-full">
              {fields.map((item, index) => {
                return (
                  <div key={item.id} className="gap-4 flex justify-center">
                    <FormField
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Select
                              value={field.value.toString()}
                              onValueChange={(e) => {
                                field.onChange(parseInt(e));
                                handleClassGradeSelect(e, index);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a class" />
                              </SelectTrigger>
                              <SelectContent {...field}>
                                <SelectGroup>
                                  {classGradeList?.map((classGradeItem) => (
                                    <SelectItem
                                      key={classGradeItem.id}
                                      value={classGradeItem.id.toString()}
                                    >
                                      Class {classGradeItem.title}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                      name={`teacherClassSubjectLink.${index}.classGradeId`}
                      control={control}
                    />
                    <FormField
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Select
                              value={field.value.toString()}
                              onValueChange={(e) => field.onChange(parseInt(e))}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent {...field}>
                                <SelectGroup>
                                  {classGradeSubjectList?.[index]?.map(
                                    (subjectItem) => (
                                      <SelectItem
                                        key={subjectItem.id}
                                        value={subjectItem.id.toString()}
                                      >
                                        {subjectItem.name}
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
                      name={`teacherClassSubjectLink.${index}.subjectId`}
                      control={control}
                    />
                    <Button
                      type="button"
                      className="bg-red-900 text-white"
                      onClick={() => {
                        handleLinkTeacherDelete(index);
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
                onClick={handleLinkTeacherAppend}
              >
                + Link Subject
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
