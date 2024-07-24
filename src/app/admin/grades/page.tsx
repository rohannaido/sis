"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";

const gradeSchema = z.object({
  title: z.string().min(1, {
    message: "Title must be at least 1 character long.",
  }),
});

export default function Grades() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof gradeSchema>>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof gradeSchema>) => {
    setIsLoading(true);
    try {
      await axios.post("/api/admin/grade", data);
      toast("grade succesfully created");
      router.push("/");
    } catch (error: any) {
      console.log(error);
      toast(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-10">
      <CardHeader>
        <CardTitle>Create a new Grade</CardTitle>
        <CardDescription>Fill in the grade details below</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 p-4 pt-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 lg:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the grade title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="lg:col-span-2">
              {isLoading ? (
                <Button>Loading...</Button>
              ) : (
                <Button type="submit">Create</Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
