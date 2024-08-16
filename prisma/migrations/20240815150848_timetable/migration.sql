-- CreateTable
CREATE TABLE "TimeTableGroup" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "TimeTableGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeTable" (
    "id" SERIAL NOT NULL,
    "timeTableGroupId" INTEGER NOT NULL,
    "classGradeId" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "slotsGroupId" INTEGER NOT NULL,
    "slotsId" INTEGER NOT NULL,
    "subjectId" INTEGER,
    "teacherId" INTEGER,

    CONSTRAINT "TimeTable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimeTable" ADD CONSTRAINT "TimeTable_timeTableGroupId_fkey" FOREIGN KEY ("timeTableGroupId") REFERENCES "TimeTableGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTable" ADD CONSTRAINT "TimeTable_classGradeId_fkey" FOREIGN KEY ("classGradeId") REFERENCES "ClassGrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTable" ADD CONSTRAINT "TimeTable_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTable" ADD CONSTRAINT "TimeTable_slotsGroupId_fkey" FOREIGN KEY ("slotsGroupId") REFERENCES "SlotsGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTable" ADD CONSTRAINT "TimeTable_slotsId_fkey" FOREIGN KEY ("slotsId") REFERENCES "Slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTable" ADD CONSTRAINT "TimeTable_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTable" ADD CONSTRAINT "TimeTable_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
