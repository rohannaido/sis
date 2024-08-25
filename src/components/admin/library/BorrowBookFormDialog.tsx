import { Book } from "@/app/library/books/page";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const borrowBookSchema = z.object({
  userId: z.string(),
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
    },
  });

  async function fetchBook() {
    try {
      const response = await axios.get(`/api/library/books/${bookId}`);
      setBook(response.data);
    } catch (err: any) {
      toast("Something went wrong finding book detail");
    } finally {
    }
  }

  async function fetchUsers() {
    try {
      const response = await axios.get(`/api/admin/users`);
      setUserList(response.data);
    } catch (err: any) {
      toast("Something went wrong finding user list");
    } finally {
    }
  }

  async function onSubmit(data: z.infer<typeof borrowBookSchema>) {
    try {
      const payload = {
        userId: data.userId,
        txnType: "BORROW",
      };
      await axios.post(`/api/library/books/${bookId}/borrow-return`, payload);
      toast("Book borrowed");
      callbackFn?.();
      setOpen(false);
    } catch (error: any) {
      console.log(error);
      toast(error.message);
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
            <div className="lg:col-span-2 flex justify-end">
              <Button type="submit">Borrow</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
