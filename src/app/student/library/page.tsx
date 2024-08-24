/**
 * v0 by Vercel.
 * @see https://v0.dev/t/iSlRFZIWpSq
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 grid gap-6">
        {/* <div className="relative">
          <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for books..."
            className="w-full rounded-lg bg-background pl-10 pr-4 py-2"
          />
        </div> */}
        {/* <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recommended Books</h2>
            <Link
              href="#"
              className="text-sm font-medium text-primary hover:underline"
              prefetch={false}
            >
              See all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              {
                id: 1,
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
              },
              { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" },
              { id: 3, title: "1984", author: "George Orwell" },
              { id: 4, title: "Pride and Prejudice", author: "Jane Austen" },
            ].map((book) => (
              <Card key={book.id}>
                <Link href="#" className="group" prefetch={false}>
                  <img
                    // src="/placeholder.svg"
                    alt={book.title}
                    width={200}
                    height={300}
                    className="rounded-t-lg w-full h-[300px] object-cover group-hover:opacity-80 transition-opacity"
                    style={{ aspectRatio: "200/300", objectFit: "cover" }}
                  />
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {book.author}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div> */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Borrowed Books</h2>
            <Link
              href="#"
              className="text-sm font-medium text-primary hover:underline"
              prefetch={false}
            >
              See all
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        Renew
                      </Button>
                      <Button size="sm" variant="outline">
                        Return
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}

function BookIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
