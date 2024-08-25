"use client";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import BookList from "@/components/admin/library/book/BookList";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Book } from "@/app/library/books/page";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export default function StudentLibraryPage() {
  const [bookList, setBookList] = useState<Book[]>([]);

  useEffect(() => {
    fetchBooks();
  }, []);
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
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 grid gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Borrowed Books</h2>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Due Date</TableHead>
                  {/* <TableHead>Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: 1, title: "The Great Gatsby", dueDate: "2023-06-30" },
                  {
                    id: 2,
                    title: "To Kill a Mockingbird",
                    dueDate: "2023-07-15",
                  },
                  { id: 3, title: "1984", dueDate: "2023-08-01" },
                ].map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.dueDate}</TableCell>
                    {/* <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        Renew
                      </Button>
                      <Button size="sm" variant="outline">
                        Return
                      </Button>
                    </div>
                  </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="flex items-center justify-between my-4">
            <h2 className="text-xl font-semibold">All Books</h2>
          </div>
          <Card>
            <BookList bookList={bookList} columnDef={columns} />
          </Card>
        </div>
      </main>
    </div>
  );
}
