import { SubjectContext } from "@/app/admin/classGrades/[classGradeId]/(classGradePages)/subjects/[subjectId]/layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const chapterContentSchema = z.object({
  title: z.string().min(4, {
    message: "Name must be at least 4 character long.",
  }),
  type: z.string().min(1, {
    message: "Content Type must by 1 character long.",
  }),
  url: z.string().min(5, {
    message: "Content URL must by a valid url.",
  }),
});

export default function ChapterContentDialog({
  chapterId,
}: {
  chapterId: number;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const subject = useContext(SubjectContext);

  const form = useForm<z.infer<typeof chapterContentSchema>>({
    resolver: zodResolver(chapterContentSchema),
    defaultValues: {
      title: "",
      type: "",
      url: "",
    },
  });

  async function onSubmit(data: z.infer<typeof chapterContentSchema>) {
    setIsLoading(true);
    try {
      const obj = {
        name: data.title,
        type: data.type,
        url: data.url,
      };
      await axios.post(
        `/api/admin/subjects/${subject?.id}/chapters/${chapterId}/chapterContents`,
        obj
      );
      toast("class succesfully created");
      setOpen(false);
      //   callbackFn();
    } catch (error: any) {
      console.log(error);
      toast(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ Chapter Content</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>Add chapter content</DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 lg:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }: { field: any }) => (
                <>
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the content name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }: { field: any }) => (
                <>
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the content type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }: { field: any }) => (
                <>
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the content url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <div className="lg:col-span-2 flex justify-end">
              {isLoading ? (
                <Button>Loading...</Button>
              ) : (
                <Button type="submit">Save</Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
