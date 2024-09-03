import db from "@/db";
import { BookBorrow } from "@prisma/client";

export class Book {
  private id: number;
  private title: string;
  private author: string;
  private bookBorrowList?: BookBorrow[];
  private copies: number;

  private constructor(
    id: number,
    title: string,
    author: string,
    copies: number,
    bookBorrowList?: BookBorrow[]
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.copies = copies;
    this.bookBorrowList = bookBorrowList;
  }

  static async fetchFromDatabase(bookId: number): Promise<Book | null> {
    try {
      const bookData = await db.book.findFirst({
        where: {
          id: bookId,
        },
        include: {
          bookBorrow: {
            include: {
              user: true,
            },
          },
        },
      });

      if (bookData) {
        return new Book(
          bookData.id,
          bookData.title,
          bookData.author,
          bookData.copies,
          bookData.bookBorrow
        );
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
      return null;
    }
  }

  isAvailable(): boolean {
    return !(
      this.bookBorrowList?.filter(
        (bookBorrowItem) => !bookBorrowItem.returnDate
      )?.length == this.copies
    );
  }

  currentBookBorrowTxn() {
    if ((this.bookBorrowList?.length || 0) - 1 < 0) {
      return null;
    }
    return this.bookBorrowList?.[this.bookBorrowList?.length - 1];
  }

  async borrowBook(userId: string) {
    await db.bookBorrow.create({
      data: {
        bookId: this.id,
        userId,
      },
    });
  }

  async returnBook(userId: string) {
    const borrow = await db.bookBorrow.findFirst({
      where: {
        bookId: this.id,
        userId: userId,
      },
    });

    if (!borrow) {
      throw new Error("User did not borrow!");
      return;
    }

    await db.bookBorrow.update({
      data: {
        returnDate: new Date(),
      },
      where: {
        id: borrow.id,
      },
    });
  }
}
