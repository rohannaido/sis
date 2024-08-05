import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { z } from "zod";

const requestBodySchema = z.object({
  name: z.string(),
});

// export async function GET(req: NextRequest) {
//   const classGrades = await db.classGrade.findMany();

//   return NextResponse.json(classGrades);
// }

type Params = {
  sectionId: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  const sectionId = parseInt(context.params.sectionId);

  const subject = await db.section.findFirst({
    where: {
      id: sectionId,
    },
  });

  return NextResponse.json(subject);
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
