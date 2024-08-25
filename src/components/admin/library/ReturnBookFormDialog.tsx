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

export default function ReturnBookFormDialog({
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
  const [borrowTxn, setBorrowTxn] = useState<any>({});

  useEffect(() => {
    fetchBook();
    fetchBookBorrowDetail();
  }, [bookId]);

  async function fetchBook() {
    try {
      const response = await axios.get(`/api/library/books/${bookId}`);
      setBook(response.data);
    } catch (err: any) {
      toast("Something went wrong finding book detail");
    } finally {
    }
  }

  async function fetchBookBorrowDetail() {
    try {
      const response = await axios.get(
        `/api/library/books/${bookId}/borrow-return`
      );
      setBorrowTxn(response.data);
    } catch (err: any) {
      toast("Something went wrong finding book detail");
    } finally {
    }
  }

  async function returnBook() {
    try {
      const response = await axios.patch(
        `/api/library/books/${bookId}/borrow-return`,
        {
          userId: borrowTxn?.userId,
          txnType: "RETURN",
        }
      );
      callbackFn?.();
      setOpen(false);
    } catch (err: any) {
      toast("Returned Book");
    } finally {
    }
  }

  function onReturnClick() {
    returnBook();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>Return Book - {book && book.title}</DialogHeader>
        <div>User - {borrowTxn?.user?.name}</div>
        <div className="flex justify-end">
          <Button onClick={onReturnClick}>Return</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
