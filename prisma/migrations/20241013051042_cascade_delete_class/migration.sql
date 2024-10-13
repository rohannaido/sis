-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_classGradeId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classGradeId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_classGradeId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherClassGradeSubjectLink" DROP CONSTRAINT "TeacherClassGradeSubjectLink_classGradeId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherClassGradeSubjectLink" DROP CONSTRAINT "TeacherClassGradeSubjectLink_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "TimeTable" DROP CONSTRAINT "TimeTable_classGradeId_fkey";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classGradeId_fkey" FOREIGN KEY ("classGradeId") REFERENCES "ClassGrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherClassGradeSubjectLink" ADD CONSTRAINT "TeacherClassGradeSubjectLink_classGradeId_fkey" FOREIGN KEY ("classGradeId") REFERENCES "ClassGrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherClassGradeSubjectLink" ADD CONSTRAINT "TeacherClassGradeSubjectLink_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_classGradeId_fkey" FOREIGN KEY ("classGradeId") REFERENCES "ClassGrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_classGradeId_fkey" FOREIGN KEY ("classGradeId") REFERENCES "ClassGrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTable" ADD CONSTRAINT "TimeTable_classGradeId_fkey" FOREIGN KEY ("classGradeId") REFERENCES "ClassGrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
