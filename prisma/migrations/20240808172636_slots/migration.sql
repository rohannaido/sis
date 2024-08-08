-- CreateTable
CREATE TABLE "SlotsGroup" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "SlotsGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slots" (
    "id" SERIAL NOT NULL,
    "slotGroupId" INTEGER NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Slots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Slots" ADD CONSTRAINT "Slots_slotGroupId_fkey" FOREIGN KEY ("slotGroupId") REFERENCES "SlotsGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
