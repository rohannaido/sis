import db from "@/db";
import { checkBookAvailable, getBookById } from "./book.service";

export async function lendBook(
  bookId: number,
  userId: string,
  dueDate: string,
  organizationId: number
): Promise<void> {
  const isBookAvailable = await checkBookAvailable(bookId);
  if (!isBookAvailable) {
    throw new Error("Book is not available.");
  }

  const userBorrowedCount = await db.bookBorrow.count({
    where: {
      userId,
      returnDate: null,
    },
  });

  if (userBorrowedCount > 0) {
    throw new Error("User cannot borrow more books.");
  }

  dueDate = new Date(dueDate).toISOString();

  await db.bookBorrow.create({
    data: {
      organizationId: organizationId,
      bookId,
      userId,
      dueDate,
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

export async function getAllBookBorrowTxn(organizationId: number) {
  return await db.bookBorrow.findMany({
    where: {
      organizationId,
    },
    include: {
      book: true,
      user: true,
    },
    orderBy: {
      lendDate: "desc",
    },
  });
}
