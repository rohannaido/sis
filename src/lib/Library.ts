import db from "@/db";
import { Book as BookDb } from "@prisma/client";
import { Book } from "./Book";
import { title } from "process";

export class LibraryManager {
  async getAllBooks(): Promise<BookDb[]> {
    const bookListDb = await db.book.findMany({
      include: {
        bookBorrow: true,
      },
    });

    const bookList = bookListDb.map((bookListItem) => ({
      id: bookListItem.id,
      title: bookListItem.title,
      author: bookListItem.author,
      status: bookListItem.bookBorrow.find(
        (bookBorrowItem) => !bookBorrowItem.returnDate
      )
        ? "BORROWED"
        : "AVAILABLE",
    }));

    return bookList;
  }

  async addBook(title: string, author: string): Promise<void> {
    await db.book.create({
      data: {
        title: title,
        author: author,
      },
    });
  }

  async removeBook(bookId: number): Promise<void> {
    await db.book.delete({
      where: {
        id: bookId,
      },
    });
  }

  async lendBook(bookId: number, userId: string): Promise<void> {
    const book = await Book.fetchFromDatabase(bookId);
    if (!book) {
      console.log("Book is not available.");
      return;
    }

    if (book.isAvailable()) {
      book.borrowBook(userId);
    } else {
      console.log("Book is not available.");
    }
  }

  async returnBook(bookId: number, userId: string): Promise<void> {
    const book = await Book.fetchFromDatabase(bookId);
    if (!book) {
      console.log("Book is not found.");
      return;
    }

    await book.returnBook(userId);
    console.log(`Book has been returned.`);
  }

  async updateBook(
    bookId: number,
    title?: string,
    author?: string
  ): Promise<void> {
    const updateData: Partial<BookDb> = {};

    if (title) {
      updateData.title = title;
    }

    if (author) {
      updateData.author = author;
    }

    await db.book.update({
      where: {
        id: bookId,
      },
      data: updateData,
    });

    console.log(`Book with ID ${bookId} has been updated.`);
  }
}
