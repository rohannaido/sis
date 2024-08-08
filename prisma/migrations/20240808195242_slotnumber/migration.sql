/*
  Warnings:

  - Added the required column `slotNumber` to the `Slots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Slots" ADD COLUMN     "slotNumber" INTEGER NOT NULL,
ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" SET DATA TYPE TEXT;
