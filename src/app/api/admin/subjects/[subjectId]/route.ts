import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { z } from "zod";
import { getServerAuthSession, UserSession } from "@/lib/auth";

const requestBodySchema = z.object({
  name: z.string(),
});

// export async function GET(req: NextRequest) {
//   const classGrades = await db.classGrade.findMany();

//   return NextResponse.json(classGrades);
// }

type Params = {
  subjectId: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  const subjectId = parseInt(context.params.subjectId);

  const subject = await db.subject.findFirst({
    where: {
      id: subjectId,
    },
  });

  return NextResponse.json(subject);
}

export async function DELETE(req: NextRequest, context: { params: Params }) {
  try {
    const session = await getServerAuthSession();
    const organizationId = (session as UserSession)?.user?.organizationId;

  const subjectId = parseInt(context.params.subjectId);

  await db.subject.delete({
    where: { id: subjectId, organizationId },
  });

    return NextResponse.json({ message: "Subject deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete subject" }, { status: 500 });
  }
}

// export async function POST(req: NextRequest, context: { params: Params }) {
//   const parseResult = requestBodySchema.safeParse(await req.json());

//   const classGradeId = parseInt(context.params.classGradeId);

//   if (!parseResult.success) {
//     return NextResponse.json(
//       { error: parseResult.error.message },
//       { status: 400 }
//     );
//   }

//   const { name } = parseResult.data;

//   // TODO: admin auth
//   //   if (adminSecret !== process.env.ADMIN_SECRET) {
//   //     return NextResponse.json({}, { status: 401 });
//   //   }

//   console.log("GRADE CREATE");

//   await db.subject.create({
//     data: {
//       name: name,
//       classGradeId: classGradeId,
//     },
//   });

//   return NextResponse.json(
//     {
//       message: "Subject is successfully added",
//     },
//     {
//       status: 200,
//     }
//   );
// }
