import db from "@/db";
import { Book, BookBorrow } from "@prisma/client";
import { Book as BookDb } from "@prisma/client";

export async function addBook(
  title: string,
  author: string,
  copies: number
): Promise<void> {
  await db.book.create({
    data: {
      title: title,
      author: author,
      copies: copies,
    },
  });
}

export async function getAllBooks(): Promise<BookDb[]> {
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

export async function getBookById(bookId: number): Promise<Book | null> {
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
      return bookData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching book data:", error);
    return null;
  }
}

export async function updateBook(
  bookId: number,
  title?: string,
  author?: string,
  copies?: number
): Promise<void> {
  const updateData: Partial<BookDb> = {};

  if (title) {
    updateData.title = title;
  }

  if (author) {
    updateData.author = author;
  }

  if (copies) {
    updateData.copies = copies;
  }

  await db.book.update({
    where: {
      id: bookId,
    },
    data: updateData,
  });

  console.log(`Book with ID ${bookId} has been updated.`);
}

export async function removeBook(bookId: number): Promise<void> {
  await db.book.delete({
    where: {
      id: bookId,
    },
  });
}

export async function checkBookAvailable(bookId: number): Promise<boolean> {
  const book = await getBookById(bookId);
  if (!book) {
    throw new Error("Book is not found.");
  }

  const bookBorrows = await db.bookBorrow.count({
    where: {
      bookId,
      returnDate: null,
    },
  });

  return bookBorrows < book.copies;
}

export async function currentBookBorrowTxn(bookId: number) {
  const bookBorrows = await db.bookBorrow.findMany({
    where: {
      bookId,
    },
    include: {
      user: true,
    },
  });

  console.log(bookBorrows);

  if ((bookBorrows?.length || 0) - 1 < 0) {
    return null;
  }
  console.log(bookBorrows?.[bookBorrows?.length - 1]);

  return bookBorrows?.[bookBorrows?.length - 1];
}

export async function getAllBookBorrowedUsers(bookId: number) {
  const bookBorrows = await db.bookBorrow.findMany({
    where: {
      bookId,
      returnDate: null,
    },
    include: {
      user: true,
    },
  });

  const userList = [];

  for (let i = 0; i < bookBorrows.length; i++) {
    userList.push(bookBorrows[i].user);
  }

  return userList;
}
