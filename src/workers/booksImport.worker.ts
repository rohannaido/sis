import { addBook } from "@/lib/book.service";
import { Worker, Queue, Job } from "bullmq";
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
  async (job: Job) => {
    const data = job?.data;

    for (let i = 0; i < data.length; i++) {
      const book = data[i];
      await addBook(book.title, book.author, book.copies);
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Update progress every 10%
      if (((i / data.length) * 100) % 10 === 0) {
        job.updateProgress((i / data.length) * 100);
      }
    }

    console.log("Job completed", job.id);
  },
  {
    connection,
    concurrency: 1,
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  }
);

worker.on("error", (error) => {
  console.log(error);
});

worker.on("progress", (job: Job, progress: number | object) => {
  console.log(`Progress: ${progress}%`);
});

worker.on("completed", (job: Job, returnvalue: any) => {
  console.log(`Job completed`);
});

export default worker;
