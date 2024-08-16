/*
  Warnings:

  - Added the required column `dayOfWeek` to the `TimeTable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimeTable" ADD COLUMN     "dayOfWeek" TEXT NOT NULL;
