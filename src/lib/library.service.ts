import db from "@/db";
import { checkBookAvailable, getBookById } from "./book.service";

export async function lendBook(bookId: number, userId: string): Promise<void> {
  const isBookAvailable = await checkBookAvailable(bookId);
  if (!isBookAvailable) {
    throw new Error("Book is not available.");
  }

  await db.bookBorrow.create({
    data: {
      bookId,
      userId,
    },
  });
}

export async function returnBook(
  bookId: number,
  userId: string
): Promise<void> {
  const book = await getBookById(bookId);
  if (!book) {
    console.log("Book is not found.");
    return;
  }

  const borrow = await db.bookBorrow.findFirst({
    where: {
      bookId: bookId,
      userId: userId,
    },
  });

  if (!borrow) {
    throw new Error("User did not borrow!");
  }

  await db.bookBorrow.update({
    data: {
      returnDate: new Date(),
    },
    where: {
      id: borrow.id,
    },
  });

  console.log(`Book has been returned.`);
}

export async function getAllBookBorrowTxn() {
  return await db.bookBorrow.findMany({
    include: {
      book: true,
      user: true,
    },
  });
}
