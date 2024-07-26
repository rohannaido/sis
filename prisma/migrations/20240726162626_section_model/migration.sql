-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "classGradeId" INTEGER NOT NULL,
    "name" TEXT,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_classGradeId_fkey" FOREIGN KEY ("classGradeId") REFERENCES "ClassGrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
