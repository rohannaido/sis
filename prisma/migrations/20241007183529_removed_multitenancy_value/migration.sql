-- AlterTable
ALTER TABLE "BackgroundJob" ALTER COLUMN "organizationId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "organizationId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "BookBorrow" ALTER COLUMN "organizationId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Chapter" ALTER COLUMN "organizationId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ChapterContent" ALTER COLUMN "organizationId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ClassGrade" ALTER COLUMN "organizationId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Section" ALTER COLUMN "organizationId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SectionSubjectTeacher" ALTER COLUMN "organizationId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Slots" ALTER COLUMN "organizationId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SlotsGroup" ALTER COLUMN "organizationId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "organizationId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Subject" ALTER COLUMN "organizationId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "organizationId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "TeacherClassGradeSubjectLink" ALTER COLUMN "organizationId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "TimeTable" ALTER COLUMN "organizationId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "TimeTableGroup" ALTER COLUMN "organizationId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "organizationId" DROP DEFAULT;
