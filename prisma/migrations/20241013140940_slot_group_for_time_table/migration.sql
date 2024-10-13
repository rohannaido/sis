-- AlterTable
ALTER TABLE "TimeTableGroup" ADD COLUMN     "name" TEXT,
ADD COLUMN     "slotsGroupId" INTEGER;

-- AddForeignKey
ALTER TABLE "TimeTableGroup" ADD CONSTRAINT "TimeTableGroup_slotsGroupId_fkey" FOREIGN KEY ("slotsGroupId") REFERENCES "SlotsGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
