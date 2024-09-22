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
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const bookSchema = z.object({
  title: z.string().min(4, {
    message: "Title must be at least 4 character long.",
  }),
  author: z.string().min(2, {
    message: "Author must be at least 2 character long.",
  }),
  copies: z.number().min(1, {
    message: "Copies must be at least 1.",
  }),
});

export default function BookDialog({
  open,
  setOpen,
  bookId,
  callbackFn,
}: {
  open: boolean;
  setOpen: (input: boolean) => void;
  bookId: number | null;
  callbackFn: Function | null;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      copies: 1,
    },
  });

  async function fetchBook() {
    try {
      const response = await axios.get(`/api/library/books/${bookId}`);
      form.reset(response.data);
    } catch (err: any) {
      toast("Something went wrong finding book detail");
    } finally {
    }
  }

  useEffect(() => {
    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  async function onSubmit(data: z.infer<typeof bookSchema>) {
    setIsLoading(true);
    try {
      if (!bookId) {
        await axios.post(`/api/library/books`, data);
        toast("Book succesfully Added");
      } else {
        await axios.put(`/api/library/books/${bookId}`, data);
        toast("Book succesfully updated");
      }
      callbackFn?.();
      setOpen(false);
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
        <Button variant="outline">+ Book</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {bookId ? "Edit" : "Add"} book {bookId && `id - ${bookId}`}
        </DialogHeader>
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
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the book title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }: { field: any }) => (
                <>
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the book author" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />

            <FormField
              control={form.control}
              name="copies"
              render={({ field }: { field: any }) => (
                <>
                  <FormItem>
                    <FormLabel>Copies</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the book copies"
                        type="number"
                        {...field}
                        onChange={(event) =>
                          field.onChange(event.target.valueAsNumber)
                        }
                      />
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
