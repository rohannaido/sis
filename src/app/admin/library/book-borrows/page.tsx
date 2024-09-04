"use client";

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
import { BookBorrow } from "@prisma/client";
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

export default function BookBorrowsPage() {
  const router = useRouter();
  const [bookBorrowsList, setBookBorrowsList] = useState<BookBorrow[]>([]);

  const columns: ColumnDef<BookBorrow>[] = [
    {
      accessorKey: "user.name",
      id: "firstName",
      header: "User",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("firstName")}</div>
      ),
    },
    {
      accessorKey: "book.title",
      id: "bookTitle",
      header: "Book",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("bookTitle")}</div>
      ),
    },
    {
      accessorKey: "lendDate",
      header: "Borrow Date",
      cell: ({ row }) => (
        <div className="lowercase">
          {new Date(row.getValue("lendDate")).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "returnDate",
      header: "Return Date",
      cell: ({ row }) => (
        <div className="lowercase">
          {row.getValue("returnDate")
            ? new Date(row.getValue("returnDate")).toLocaleDateString()
            : "-"}
        </div>
      ),
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
                  router.push(
                    `/admin/teachers/manage-teacher/${row.getValue("id")}`
                  );
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

  const table = useReactTable({
    data: bookBorrowsList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  async function fetchBorrowedBooks() {
    try {
      const response = await fetch("/api/library/book-borrows");
      const data = await response.json();
      const bookBorrowsDisplayList = bookBorrowsList.map((item: any) => ({
        userName: item.user.name,
      }));
      setBookBorrowsList(data);
    } catch (err) {
      toast.error("Something went wrong while searching for txn");
    } finally {
    }
  }

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  return (
    <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-10">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>Book Borrow Transactions</CardTitle>
          <CardDescription>
            You can manage book borrow transactions.
          </CardDescription>
        </div>
      </CardHeader>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
