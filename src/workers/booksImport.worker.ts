import { addBook } from "@/lib/book.service";
import { Worker, Queue } from "bullmq";
import Redis from "ioredis";
const connection = new Redis({
  maxRetriesPerRequest: null,
});

export const booksImportQueue = new Queue("booksImportQueue", {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

const worker = new Worker(
  "booksImportQueue",
  async (job) => {
    const data = job?.data;
    await addBook(data.title, data.author, data.copies);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
  {
    connection,
    concurrency: 1,
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  }
);

export default worker;
