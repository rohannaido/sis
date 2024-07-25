/*
  Warnings:

  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Class";

-- CreateTable
CREATE TABLE "ClassGrade" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "ClassGrade_pkey" PRIMARY KEY ("id")
);
