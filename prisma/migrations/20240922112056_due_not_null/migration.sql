/*
Warnings:
- Made the column `dueDate` on table `BookBorrow` required. This step will fail if there are existing NULL values in that column.
*/
-- AlterTable
UPDATE "BookBorrow" SET "dueDate" = now() WHERE "dueDate" IS NULL;

ALTER TABLE "BookBorrow" ALTER COLUMN "dueDate" SET NOT NULL;