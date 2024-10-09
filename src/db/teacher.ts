import db from "@/db";

export const getAllTeachers = async (organizationId: number) => {
  const teacherList = await db.teacher.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    where: {
      organizationId,
    },
  });

  const parsedTeacherList = teacherList.map((item) => ({
    name: item.user.name,
    email: item.user.email,
  }));

  return parsedTeacherList;
};

export const getSubjectChapters = async (subjectId: number) => {
  const subjectChapters = await db.subject.findFirst({
    where: {
      id: subjectId,
    },
    include: {
      Chapter: true,
    },
  });

  return subjectChapters;
};

export const getChapterContent = async (chapterId: number) => {
  const chapterContents = await db.chapter.findFirst({
    where: {
      id: chapterId,
    },
    include: {
      ChapterContent: true,
    },
  });

  return chapterContents;
};
