/*
  Warnings:

  - You are about to drop the `Grade` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Grade";

-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);
