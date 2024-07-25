-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "classGradeId" INTEGER NOT NULL,
    "name" TEXT,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_classGradeId_fkey" FOREIGN KEY ("classGradeId") REFERENCES "ClassGrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
