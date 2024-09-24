"use client";

import BookDialog from "@/components/admin/library/book/BookDialog";
import BookList from "@/components/admin/library/book/BookList";
import BorrowBookFormDialog from "@/components/admin/library/BorrowBookFormDialog";
import ReturnBookFormDialog from "@/components/admin/library/ReturnBookFormDialog";
import { Badge } from "@/components/ui/badge";
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
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import {
  CalendarDays,
  CircleX,
  Download,
  Info,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sampleBooks } from "./sampleBooks";
import {
  downloadExcelWithData,
  getExcelOutputDataExceptHeader,
} from "@/lib/excel";
import axios from "axios";
import { cn } from "@/lib/utils";

export type Book = {
  id: number;
  title: string | null;
  author: string | null;
  copies: number;
  borrowedCopies: number;
};

function downloadBooksUploadSampleExcel() {
  downloadExcelWithData(sampleBooks, "books_sample.xlsx");
}

export default function BooksPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [excelUploadData, setExcelUploadData] = useState<any[]>([]);
  const [bookList, setBookList] = useState<Book[]>([]);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [openBookForm, setOpenBookForm] = useState<boolean>(false);
  const [openBorrowBookForm, setOpenBorrowBookForm] = useState<boolean>(false);
  const [openReturnBookForm, setOpenReturnBookForm] = useState<boolean>(false);

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
      accessorKey: "borrowedCopies",
      header: "Borrowed Copies",
      cell: ({ row }) => (
        <div>
          {row.getValue("borrowedCopies") + " / " + row.getValue("copies")}
        </div>
      ),
    },
    {
      header: "Copies",
      accessorKey: "copies",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("status")}</Badge>
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
              <Button variant="ghost" className="h-2 w-4 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {parseInt(row.getValue("borrowedCopies") || "0") !=
                row.getValue("copies") && (
                <DropdownMenuItem
                  onClick={() => {
                    setEditingBookId(row.getValue("id"));
                    setOpenBorrowBookForm(true);
                  }}
                >
                  Borrow
                </DropdownMenuItem>
              )}
              {parseInt(row.getValue("borrowedCopies") || "0") > 0 && (
                <DropdownMenuItem
                  onClick={() => {
                    setEditingBookId(row.getValue("id"));
                    setOpenReturnBookForm(true);
                  }}
                >
                  Return
                </DropdownMenuItem>
              )}

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
      toast({
        variant: "destructive",
        description: "Something went wrong while fetching books",
      });
    } finally {
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    console.log(file);

    setSelectedFile(file);

    const reader = new FileReader();

    // When the file is successfully read
    reader.onload = (e: Event) => {
      const data = new Uint8Array(e?.target?.result);
      const excelData = getExcelOutputDataExceptHeader(data);
      setExcelUploadData(excelData);
    };

    reader.readAsArrayBuffer(file);
  }

  async function uploadBooks() {
    try {
      const response = await axios.post(
        "/api/library/books/bulk",
        excelUploadData
      );
      toast({
        description: "Books uploaded successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Something went wrong while uploading books",
      });
    } finally {
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <Card className="mx-auto w-full max-w-6xl overflow-y-auto lg:mt-10">
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-2">
          <CardTitle>Books</CardTitle>
        </div>
        <div className="flex flex-row gap-4">
          <div
            className={cn(
              "flex w-full max-w-md items-center gap-1.5 py-2 px-4",
              selectedFile && "border-2 border-primary rounded-lg"
            )}
          >
            <Label htmlFor="bulk_books">Import books</Label>

            <HoverCard>
              <HoverCardTrigger asChild>
                <Info />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4 text-sm">
                  <div className="space-y-1">
                    <h4 className="font-semibold">Bulk upload books</h4>
                    <p>For easy of uploading all the existing books</p>
                    <div className="flex flex-row gap-2 items-center pt-2">
                      <span>Download sample</span>
                      <Button
                        variant="outline"
                        onClick={() => {
                          downloadBooksUploadSampleExcel();
                        }}
                      >
                        <Download />
                      </Button>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <Input
              id="bulk_books"
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <div className="flex flex-row gap-2">
                <Button
                  disabled={!selectedFile}
                  onClick={() => {
                    uploadBooks();
                  }}
                >
                  Upload
                </Button>
                <Button
                  onClick={() => setSelectedFile(null)}
                  variant={"outline"}
                  className="p-2"
                >
                  <CircleX />
                </Button>
              </div>
            )}
          </div>
          <div className="py-2 px-4">
            <BookDialog
              bookId={editingBookId}
              callbackFn={() => fetchBooks()}
              open={openBookForm}
              setOpen={setOpenBookForm}
            />
          </div>
        </div>
        {openBorrowBookForm && (
          <BorrowBookFormDialog
            callbackFn={() => fetchBooks()}
            bookId={editingBookId}
            open={openBorrowBookForm}
            setOpen={setOpenBorrowBookForm}
          />
        )}
        {openReturnBookForm && (
          <ReturnBookFormDialog
            callbackFn={() => fetchBooks()}
            bookId={editingBookId}
            open={openReturnBookForm}
            setOpen={setOpenReturnBookForm}
          />
        )}
      </CardHeader>

      <BookList columnDef={columns} bookList={bookList} />
    </Card>
  );
}
