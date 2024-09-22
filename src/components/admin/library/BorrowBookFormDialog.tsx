import { Book } from "@/app/admin/library/books/page";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import axios from "axios";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";

const borrowBookSchema = z.object({
  userId: z.string(),
  dueDate: z.date({
    required_error: "A due date is required.",
  }),
});

export default function BorrowBookFormDialog({
  bookId,
  open,
  setOpen,
  callbackFn,
}: {
  bookId: number | null;
  open: boolean;
  setOpen: (value: boolean) => void;
  callbackFn?: Function;
}) {
  const { toast } = useToast();
  const [book, setBook] = useState<Book | null>(null);
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    fetchBook();
    fetchUsers();
  }, [bookId]);

  const form = useForm<z.infer<typeof borrowBookSchema>>({
    resolver: zodResolver(borrowBookSchema),
    defaultValues: {
      userId: "",
      // 2 weeks from now
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    },
  });

  async function fetchBook() {
    try {
      const response = await axios.get(`/api/library/books/${bookId}`);
      setBook(response.data);
    } catch (err: any) {
      toast({
        variant: "destructive",
        description: "Something went wrong finding book detail",
      });
    } finally {
    }
  }

  async function fetchUsers() {
    try {
      const response = await axios.get(`/api/admin/users`);
      setUserList(response.data);
    } catch (err: any) {
      toast({
        variant: "destructive",
        description: "Something went wrong finding users",
      });
    } finally {
    }
  }

  async function onSubmit(data: z.infer<typeof borrowBookSchema>) {
    try {
      const payload = {
        userId: data.userId,
        dueDate: format(data.dueDate, "yyyy-MM-dd"),
        txnType: "BORROW",
      };
      await axios.post(`/api/library/books/${bookId}/borrow-return`, payload);
      toast({
        variant: "default",
        description: "Book borrowed successfully",
      });
      callbackFn?.();
      setOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error?.response?.data?.error || "Something went wrong!",
      });
    } finally {
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>Borrow Book - {book && book.title}</DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 lg:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>User</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? userList.find(
                                (userItem) => userItem.id === field.value
                              )?.name
                            : "Select user"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search user..." />
                        <CommandList>
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {userList.map((userItem) => (
                              <CommandItem
                                value={userItem.name!}
                                key={userItem.id}
                                onSelect={() => {
                                  form.setValue("userId", userItem.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    userItem.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {userItem.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="lg:col-span-2 flex justify-end">
              <Button type="submit">Borrow</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
