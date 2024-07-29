import db from "@/db";

export const getAllSubjects = async (email: string) => {
  const user = await db.user.findFirst({
    where: { email },
    include: {
      Student: {
        include: {
          classGrade: {
            include: {
              Subject: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user?.Student?.[0]?.classGrade?.Subject) {
    throw new Error("Subject not found");
  }

  return user?.Student?.[0]?.classGrade?.Subject;
};
