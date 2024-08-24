"use client";

import BookDialog from "@/components/admin/library/book/BookDialog";
import BookList from "@/components/admin/library/book/BookList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type Book = {
  id: number;
  title: string | null;
  author: string | null;
};

export default function BooksPage() {
  const router = useRouter();
  const [bookList, setBookList] = useState<Book[]>([]);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [openBookForm, setOpenBookForm] = useState<boolean>(false);

  const columns: ColumnDef<Book>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => <div>{row.getValue("author")}</div>,
    },
    {
      accessorKey: "id",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setEditingBookId(row.getValue("id"));
                  setOpenBookForm(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  async function fetchBooks() {
    try {
      const response = await fetch("/api/library/books");
      const data = await response.json();
      setBookList(data);
    } catch (err) {
      toast.error("Something went wrong while searching for books");
    } finally {
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-10">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>Books</CardTitle>
        </div>
        <BookDialog
          bookId={editingBookId}
          callbackFn={() => fetchBooks()}
          open={openBookForm}
          setOpen={setOpenBookForm}
        />
      </CardHeader>

      <BookList columnDef={columns} bookList={bookList} />
    </Card>
  );
}
