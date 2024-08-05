-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherClassGradeSubjectLink" (
    "id" SERIAL NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "classGradeId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "TeacherClassGradeSubjectLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherClassGradeSubjectLink" ADD CONSTRAINT "TeacherClassGradeSubjectLink_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherClassGradeSubjectLink" ADD CONSTRAINT "TeacherClassGradeSubjectLink_classGradeId_fkey" FOREIGN KEY ("classGradeId") REFERENCES "ClassGrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherClassGradeSubjectLink" ADD CONSTRAINT "TeacherClassGradeSubjectLink_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
