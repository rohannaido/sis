import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { z } from "zod";
import { UserSession } from "@/lib/auth";
import { getServerSession } from "next-auth";

type Params = {
  teacherId: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  const teacherId = parseInt(context.params.teacherId);

  const teacherDetail = await db.teacher.findFirst({
    where: {
      id: teacherId,
    },
    select: {
      id: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      TeacherClassGradeSubjectLink: {
        select: {
          id: true,
          classGradeId: true,
          subjectId: true,
        },
      },
    },
  });

  const parsedTeacherDetail = {
    name: teacherDetail?.user.name,
    email: teacherDetail?.user.email,
    teacherClassGradeSubjectLink:
      teacherDetail?.TeacherClassGradeSubjectLink.map((item) => ({
        id: item.id,
        classGradeId: item.classGradeId,
        subjectId: item.subjectId,
      })),
  };

  return NextResponse.json(parsedTeacherDetail);
}

const requestBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  teacherClassSubjectLink: z.array(
    z.object({
      id: z.number(),
      subjectId: z.number(),
      classGradeId: z.number(),
    })
  ),
});

export async function PUT(
  req: NextRequest,
  context: {
    params: {
      teacherId: string;
    };
  }
) {
  const session = await getServerSession();
  const organizationId = (session as UserSession)?.user?.organizationId;

  const teacherId = parseInt(context.params.teacherId);
  const parsedRequest = requestBodySchema.safeParse(await req.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: parsedRequest.error.message },
      { status: 400 }
    );
  }

  const { name, email, teacherClassSubjectLink } = parsedRequest.data;

  const teacherDetail = await db.teacher.findFirst({
    where: {
      id: teacherId,
    },
  });

  if (!teacherDetail?.userId) {
    return NextResponse.json({ error: "Error updating" }, { status: 400 });
  }

  const user = await db.user.update({
    where: {
      id: teacherDetail.userId,
      organizationId: organizationId,
    },
    data: {
      name,
      email,
    },
  });

  const teacherSubjectList = await db.teacherClassGradeSubjectLink.findMany({
    where: {
      teacherId: teacherId,
      organizationId: organizationId,
    },
    select: {
      id: true,
    },
  });

  const teacherSubjectCurrIdList = teacherSubjectList.map((item) => item.id);

  const teacherClassSubjectLinkFormIdList = teacherClassSubjectLink.map(
    (item) => item.id
  );

  const teacherSubjectIdDeleteList = teacherSubjectCurrIdList.filter(
    (item) => !teacherClassSubjectLinkFormIdList.includes(item)
  );

  await db.teacherClassGradeSubjectLink.deleteMany({
    where: {
      id: {
        in: teacherSubjectIdDeleteList,
      },
      organizationId: organizationId,
    },
  });

  for (const teacherClassSubjectItem of teacherClassSubjectLink) {
    if (teacherClassSubjectItem.id != 0) {
      await db.teacherClassGradeSubjectLink.update({
        data: {
          classGradeId: teacherClassSubjectItem.classGradeId,
          subjectId: teacherClassSubjectItem.subjectId,
        },
        where: {
          id: teacherClassSubjectItem.id,
          organizationId: organizationId,
        },
      });
    } else {
      await db.teacherClassGradeSubjectLink.create({
        data: {
          organizationId: organizationId,
          teacherId: teacherId,
          classGradeId: teacherClassSubjectItem.classGradeId,
          subjectId: teacherClassSubjectItem.subjectId,
        },
      });
    }
  }

  return NextResponse.json(
    {
      message: "Teacher is successfully updated",
    },
    {
      status: 200,
    }
  );
}
