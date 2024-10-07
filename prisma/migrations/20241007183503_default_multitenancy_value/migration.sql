-- AlterTable
ALTER TABLE "BackgroundJob" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "BookBorrow" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "ChapterContent" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "ClassGrade" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "SectionSubjectTeacher" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Slots" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "SlotsGroup" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "TeacherClassGradeSubjectLink" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "TimeTable" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "TimeTableGroup" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherClassGradeSubjectLink" ADD CONSTRAINT "TeacherClassGradeSubjectLink_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassGrade" ADD CONSTRAINT "ClassGrade_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterContent" ADD CONSTRAINT "ChapterContent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotsGroup" ADD CONSTRAINT "SlotsGroup_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slots" ADD CONSTRAINT "Slots_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionSubjectTeacher" ADD CONSTRAINT "SectionSubjectTeacher_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTableGroup" ADD CONSTRAINT "TimeTableGroup_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTable" ADD CONSTRAINT "TimeTable_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookBorrow" ADD CONSTRAINT "BookBorrow_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackgroundJob" ADD CONSTRAINT "BackgroundJob_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
