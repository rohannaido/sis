import db from "@/db";
import { Book as BookDb } from "@prisma/client";
import { Book } from "./Book";

class LibraryManager {
  async getAllBooks(): Promise<BookDb[]> {
    const bookListDb = await db.book.findMany({
      include: {
        bookBorrow: true,
      },
    });

    const bookList = bookListDb.map((bookListItem) => {
      const borrowedCopiesCount = bookListItem.bookBorrow.filter(
        (bookBorrowItem) => !bookBorrowItem.returnDate
      )?.length;
      return {
        id: bookListItem.id,
        title: bookListItem.title,
        author: bookListItem.author,
        copies: bookListItem.copies,
        borrowedCopies: borrowedCopiesCount,
        status:
          borrowedCopiesCount == bookListItem.copies ? "BORROWED" : "AVAILABLE",
      };
    });

    return bookList;
  }

  async addBook(title: string, author: string, copies: number): Promise<void> {
    await db.book.create({
      data: {
        title: title,
        author: author,
        copies: copies,
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

  async getAllBookBorrowTxn() {
    return await db.bookBorrow.findMany({
      include: {
        book: true,
        user: true,
      },
    });
  }
}

export const libraryManager = new LibraryManager();
