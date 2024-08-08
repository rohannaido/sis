/*
  Warnings:

  - Added the required column `name` to the `SlotsGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SlotsGroup" ADD COLUMN     "name" TEXT NOT NULL;
