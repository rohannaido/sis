-- AlterTable
ALTER TABLE "ClassGrade" ADD COLUMN     "slotsGroupId" INTEGER;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "periodCountPerWeek" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "ClassGrade" ADD CONSTRAINT "ClassGrade_slotsGroupId_fkey" FOREIGN KEY ("slotsGroupId") REFERENCES "SlotsGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
